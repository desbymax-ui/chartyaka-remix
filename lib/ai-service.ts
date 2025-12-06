import { ChartData, ChartType } from "@/app/page"

// Placeholder for API Key - User will provide this later
const AI_API_KEY = process.env.NEXT_PUBLIC_AI_API_KEY || ""

export interface AnalysisResult {
    data: ChartData
    recommendations: ChartType[]
    summary: string
}

export interface AIError {
    type: 'api_key' | 'network' | 'rate_limit' | 'invalid_response' | 'unknown'
    message: string
    canUseFallback: boolean
}

export async function analyzeData(text: string, useFallbackOnError = false): Promise<AnalysisResult> {
    // Check for API key
    if (!AI_API_KEY || AI_API_KEY.trim() === "" || AI_API_KEY.includes("YOUR_API_KEY")) {
        const error: AIError = {
            type: 'api_key',
            message: 'AI API key is missing or invalid. Please add your OpenAI API key to the .env.local file.',
            canUseFallback: true
        }

        if (useFallbackOnError) {
            console.warn("No valid API key found, using heuristic fallback.")
            return heuristicFallback(text)
        }

        throw error
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${AI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are a data visualization and diagram expert. Analyze the user's text to understand its structure and recommend the most appropriate visualizations.

            ANALYZE THE TEXT FOR:
            1. **Processes/Workflows**: Sequential steps, procedures, algorithms → Recommend "flow" diagram
            2. **Hierarchies**: Organizational structures, taxonomies, parent-child relationships → Recommend "tree" or "org" diagram
            3. **Concepts/Ideas**: Brainstorming, interconnected thoughts, knowledge maps → Recommend "mindmap" diagram
            4. **Quantitative Data**: Numbers, metrics, statistics → Recommend charts ("bar", "line", "pie", "area")
            
            CRITICAL RULES:
            1. **Summarize & Aggregate**: Do NOT return more than 15 data points. If the data is large, aggregate it.
            2. **Clean Data**: Ensure numeric values are pure numbers (no currency symbols, commas, or units).
            3. **Smart Recommendations**: Recommend 2-4 visualization types that BEST fit the text content.
               - For processes: prioritize "flow"
               - For hierarchies: prioritize "tree" or "org"
               - For concepts: prioritize "mindmap"
               - For metrics: prioritize charts
            4. **Structure**: Return ONLY valid JSON matching the format below.
            
            JSON Structure:
            {
              "data": {
                "title": "A concise, professional title",
                "columns": ["LabelColumn", "ValueColumn"], // First column = label (string), second = value (number or string for diagrams)
                "data": [
                  { "LabelColumn": "Step 1", "ValueColumn": "Description" },
                  { "LabelColumn": "Step 2", "ValueColumn": "Description" }
                ]
              },
              "recommendations": ["flow", "tree", "bar"], // 2-4 types that best fit the content
              "summary": "A 1-sentence insight about the data or structure."
            }
            
            For diagrams, the data structure should represent nodes/steps. For charts, use numeric values.`,
                    },
                    {
                        role: "user",
                        content: text,
                    },
                ],
                response_format: { type: "json_object" },
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("OpenAI API Error:", response.status, errorText)

            let error: AIError

            if (response.status === 401) {
                error = {
                    type: 'api_key',
                    message: 'Invalid API key. Please check your OpenAI API key in the .env.local file.',
                    canUseFallback: true
                }
            } else if (response.status === 429) {
                error = {
                    type: 'rate_limit',
                    message: 'Rate limit exceeded. Please try again in a few moments or check your OpenAI account quota.',
                    canUseFallback: true
                }
            } else if (response.status >= 500) {
                error = {
                    type: 'network',
                    message: 'OpenAI service is temporarily unavailable. Please try again later.',
                    canUseFallback: true
                }
            } else {
                error = {
                    type: 'unknown',
                    message: `API Error (${response.status}): ${response.statusText}`,
                    canUseFallback: true
                }
            }

            if (useFallbackOnError) {
                console.warn("API error, using fallback:", error.message)
                return heuristicFallback(text)
            }

            throw error
        }

        const json = await response.json()
        const content = json.choices[0].message.content
        console.log("AI Raw Response:", content) // Debug log
        const result = JSON.parse(content) as AnalysisResult

        return result
    } catch (error) {
        console.error("AI Analysis failed:", error)

        // If it's already an AIError, rethrow it
        if (error && typeof error === 'object' && 'type' in error && 'message' in error) {
            throw error
        }

        // Network or parsing error
        const aiError: AIError = {
            type: 'network',
            message: error instanceof Error ? error.message : 'Failed to connect to AI service. Please check your internet connection.',
            canUseFallback: true
        }

        if (useFallbackOnError) {
            console.warn("Network error, using fallback:", aiError.message)
            return heuristicFallback(text)
        }

        throw aiError
    }
}

function heuristicFallback(text: string): AnalysisResult {
    // Simple heuristic: try to parse as CSV first
    const csvResult = parseCSV(text)
    if (csvResult) {
        return {
            data: csvResult,
            recommendations: recommendCharts(csvResult),
            summary: "Successfully parsed CSV data (Fallback).",
        }
    }

    // Fallback: Return sample data if parsing fails
    return {
        data: {
            title: "AI Extracted Data (Fallback)",
            columns: ["Category", "Value"],
            data: [
                { Category: "Item A", Value: 10 },
                { Category: "Item B", Value: 25 },
                { Category: "Item C", Value: 15 },
            ],
        },
        recommendations: ["bar", "pie", "line"],
        summary: "Could not parse data. Showing sample fallback.",
    }
}

function parseCSV(csv: string): ChartData | null {
    try {
        const lines = csv.trim().split("\n")
        if (lines.length < 2) return null

        const headers = lines[0].split(",").map((h) => h.trim())
        const data = lines.slice(1).map((line) => {
            const values = line.split(",").map((v) => v.trim())
            const row: Record<string, string | number> = {}
            headers.forEach((header, i) => {
                const num = Number.parseFloat(values[i])
                row[header] = isNaN(num) ? values[i] : num
            })
            return row
        })

        return { title: "Imported Data", data, columns: headers }
    } catch {
        return null
    }
}

function recommendCharts(data: ChartData): ChartType[] {
    const rowCount = data.data.length
    const hasNumeric = data.data.some((row) => Object.values(row).some((v) => typeof v === "number"))
    const hasStringValues = data.data.some((row) => Object.values(row).some((v) => typeof v === "string" && v.length > 20))

    // If data has long string values, it's likely process/concept data
    if (hasStringValues) {
        return ["flow", "tree", "mindmap"]
    }

    // If numeric data exists, recommend charts
    if (rowCount > 10 && hasNumeric) {
        return ["line", "area", "bar"]
    } else if (rowCount <= 10 && hasNumeric) {
        return ["bar", "pie", "line"]
    }

    // Default to diagram types for non-numeric data
    return ["flow", "tree", "bar", "mindmap"]
}
