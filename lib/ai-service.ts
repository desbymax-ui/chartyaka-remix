import { ChartData, ChartType } from "@/app/page"

// Placeholder for API Key - User will provide this later
const AI_API_KEY = process.env.NEXT_PUBLIC_AI_API_KEY || ""

export interface AnalysisResult {
    data: ChartData
    recommendations: ChartType[]
    summary: string
}

export async function analyzeData(text: string): Promise<AnalysisResult> {
    if (!AI_API_KEY || AI_API_KEY.includes("YOUR_API_KEY")) {
        console.warn("No valid API key found, using heuristic fallback.")
        return heuristicFallback(text)
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
                        content: `You are a data visualization expert. Your goal is to transform raw, unstructured text into a clean, summarized dataset perfect for a chart.

            Analyze the user's input and extract the key quantitative data.
            
            CRITICAL RULES:
            1. **Summarize & Aggregate**: Do NOT return more than 15 data points. If the data is large, aggregate it (e.g., sum by category, average by month, top 10 items).
            2. **Clean Data**: Ensure the numeric values are pure numbers (no currency symbols, commas, or units in the value).
            3. **Structure**: Return ONLY valid JSON matching the format below.
            
            JSON Structure:
            {
              "data": {
                "title": "A concise, professional chart title",
                "columns": ["LabelColumn", "ValueColumn"], // First column should be the label (string), second should be the value (number)
                "data": [
                  { "LabelColumn": "Jan", "ValueColumn": 100 },
                  { "LabelColumn": "Feb", "ValueColumn": 200 }
                ]
              },
              "recommendations": ["bar", "line", "pie", "area"], // Select the best 2-3 types.
              "summary": "A 1-sentence insight about the data."
            }
            
            If the input is vague or lacks numbers, infer a reasonable dataset that represents the *intent* of the text (e.g., if text says "sales are growing", generate a growing trend).`,
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
            throw new Error(`API Error: ${response.statusText}`)
        }

        const json = await response.json()
        const content = json.choices[0].message.content
        console.log("AI Raw Response:", content) // Debug log
        const result = JSON.parse(content) as AnalysisResult

        return result
    } catch (error) {
        console.error("AI Analysis failed:", error)
        return heuristicFallback(text)
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

    if (rowCount > 10 && hasNumeric) {
        return ["line", "area", "bar"]
    } else if (rowCount <= 10 && hasNumeric) {
        return ["bar", "pie", "line"]
    }

    return ["bar", "line", "area", "pie"]
}
