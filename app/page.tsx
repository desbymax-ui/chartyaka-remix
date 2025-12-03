"use client"

import { useState } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { DataInputScreen } from "@/components/data-input-screen"
import { TemplateSelectionScreen } from "@/components/template-selection-screen"
import { ChartWorkspace } from "@/components/chart-workspace"

export type ChartType = "bar" | "line" | "area" | "pie"

export interface ChartData {
  title: string
  data: Array<Record<string, string | number>>
  columns: string[]
}

export default function Home() {
  const [step, setStep] = useState<"welcome" | "data" | "template" | "workspace">("welcome")
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<ChartType>("bar")

  const handleStart = () => setStep("data")

  const handleDataSubmit = (data: ChartData) => {
    setChartData(data)
    setStep("template")
  }

  const handleTemplateSelect = (template: ChartType) => {
    setSelectedTemplate(template)
    setStep("workspace")
  }

  const handleBack = () => {
    if (step === "data") setStep("welcome")
    if (step === "template") setStep("data")
    if (step === "workspace") setStep("welcome")
  }

  return (
    <main className="min-h-screen bg-background">
      {step === "welcome" && <WelcomeScreen onStart={handleStart} />}
      {step === "data" && <DataInputScreen onSubmit={handleDataSubmit} onBack={handleBack} />}
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
