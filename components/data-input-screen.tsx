"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, HelpCircle, Upload, Loader2, Sparkles } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ChartData, ChartType } from "@/app/page"
import Image from "next/image"
import { analyzeData } from "@/lib/ai-service"

interface DataInputScreenProps {
  onSubmit: (data: ChartData, recommendations: ChartType[]) => void
  onBack: () => void
}

const sampleText = `Monthly Sales Report
January: 4000 sales, 2400 expenses
February: 3000 sales, 1398 expenses
March: 2000 sales, 9800 expenses`

export function DataInputScreen({ onSubmit, onBack }: DataInputScreenProps) {
  const [inputData, setInputData] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!inputData.trim()) {
      setError("Please enter your data")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await analyzeData(inputData)
      onSubmit(result.data, result.recommendations)
    } catch (err) {
      setError("Failed to analyze data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadSample = () => {
    setInputData(sampleText)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 bg-card">
        <div className="flex items-center">
          <Image src="/logo.svg" alt="ChartFlow" width={140} height={35} priority />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-xl w-full space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Describe your data
            </h1>
            <p className="text-muted-foreground">
              Paste any text, CSV, or JSON. Our AI will structure it for you.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="data">Raw Data</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>You can paste unstructured text like emails or reports. We'll extract the numbers.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-sm text-muted-foreground">
                  <button
                    onClick={loadSample}
                    className="text-foreground hover:underline hover:text-primary transition-colors"
                  >
                    Try Sample Data
                  </button>
                </div>
              </div>
              <Textarea
                id="data"
                placeholder="Paste your data here..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="min-h-[300px] font-mono text-sm resize-none"
              />
            </div>

            <div className="flex gap-2 items-center">
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".csv,.txt,.json,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    const reader = new FileReader()
                    reader.onload = (e) => {
                      const text = e.target?.result as string
                      setInputData(text)
                    }
                    reader.readAsText(file)
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 border border-white/20 text-white hover:bg-card hover:text-white hover:border-white/30"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports CSV, JSON, TXT - AI auto-formatting
              </p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button onClick={handleSubmit} disabled={isLoading} className="w-full gap-2" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Data...
              </>
            ) : (
              <>
                Generate Charts
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
