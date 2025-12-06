"use client"

import { useState } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { DataInputScreen } from "@/components/data-input-screen"
import { TemplateSelectionScreen } from "@/components/template-selection-screen"
import { ChartWorkspace } from "@/components/chart-workspace"
import { ChartRecommendationScreen } from "@/components/chart-recommendation-screen"

export type ChartType = "bar" | "line" | "area" | "pie" | "flow" | "tree" | "org" | "mindmap"

export interface ChartData {
  title: string
  data: Array<Record<string, string | number>>
  columns: string[]
}

export default function Home() {
  const [step, setStep] = useState<"welcome" | "data" | "recommendation" | "template" | "workspace">("welcome")
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<ChartType>("bar")
  const [recommendations, setRecommendations] = useState<ChartType[]>([])

  const handleStart = () => setStep("data")

  const handleDataSubmit = (data: ChartData, recs: ChartType[]) => {
    setChartData(data)
    setRecommendations(recs)
    setStep("recommendation")
  }

  const handleRecommendationSelect = (template: ChartType) => {
    setSelectedTemplate(template)
    setStep("workspace")
  }

  const handleCustomSelect = () => {
    setStep("template")
  }

  const handleTemplateSelect = (template: ChartType) => {
    setSelectedTemplate(template)
    setStep("workspace")
  }

  const handleBack = () => {
    if (step === "data") setStep("welcome")
    if (step === "recommendation") setStep("data")
    if (step === "template") setStep("recommendation")
    if (step === "workspace") setStep("recommendation")
  }

  return (
    <main className="min-h-screen bg-background">
      {step === "welcome" && <WelcomeScreen onStart={handleStart} />}
      {step === "data" && <DataInputScreen onSubmit={handleDataSubmit} onBack={handleBack} />}
      {step === "recommendation" && chartData && (
        <ChartRecommendationScreen
          data={chartData}
          recommendations={recommendations}
          onSelect={handleRecommendationSelect}
          onCustomSelect={handleCustomSelect}
          onBack={handleBack}
        />
      )}
      {step === "template" && <TemplateSelectionScreen onSelect={handleTemplateSelect} onBack={handleBack} />}
      {step === "workspace" && chartData && (
        <ChartWorkspace
          chartData={chartData}
          chartType={selectedTemplate}
          onChartTypeChange={setSelectedTemplate}
          onBack={handleBack}
        />
      )}
    </main>
  )
}
