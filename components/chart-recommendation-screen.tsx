"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BarChart3, LineChart, PieChart, Activity, GitBranch, Network, Workflow, Brain } from "lucide-react"
import type { ChartType, ChartData } from "@/app/page"
import { ChartPreview } from "@/components/chart-preview"
import { ThemeToggle } from "@/components/theme-toggle"

interface ChartRecommendationScreenProps {
    data: ChartData
    recommendations: ChartType[]
    onSelect: (type: ChartType) => void
    onCustomSelect: () => void
    onBack: () => void
}

export function ChartRecommendationScreen({
    data,
    recommendations,
    onSelect,
    onCustomSelect,
    onBack,
}: ChartRecommendationScreenProps) {

    const getIcon = (type: ChartType) => {
        switch (type) {
            case "bar": return <BarChart3 className="w-6 h-6" />
            case "line": return <LineChart className="w-6 h-6" />
            case "pie": return <PieChart className="w-6 h-6" />
            case "area": return <Activity className="w-6 h-6" />
            case "flow": return <Workflow className="w-6 h-6" />
            case "tree": return <GitBranch className="w-6 h-6" />
            case "org": return <Network className="w-6 h-6" />
            case "mindmap": return <Brain className="w-6 h-6" />
            default: return <BarChart3 className="w-6 h-6" />
        }
    }

    const getLabel = (type: ChartType) => {
        switch (type) {
            case "bar": return "Bar Chart"
            case "line": return "Line Chart"
            case "pie": return "Pie Chart"
            case "area": return "Area Chart"
            case "flow": return "Flow Diagram"
            case "tree": return "Tree Diagram"
            case "org": return "Org Chart"
            case "mindmap": return "Mind Map"
            default: return "Chart"
        }
    }

    const getDescription = (type: ChartType) => {
        switch (type) {
            case "bar": return "Best for comparing categories."
            case "line": return "Ideal for trends over time."
            case "pie": return "Good for showing proportions."
            case "area": return "Great for volume trends."
            case "flow": return "Perfect for processes and workflows."
            case "tree": return "Ideal for hierarchies and structures."
            case "org": return "Great for organizational charts."
            case "mindmap": return "Best for concepts and ideas."
            default: return "Standard visualization."
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="border-b border-border px-4 py-3 bg-card flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <ThemeToggle />
            </header>

            <div className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold">Recommended for you</h1>
                        <p className="text-muted-foreground">
                            Based on your data, these chart styles would work best.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendations.map((type) => (
                            <Card
                                key={type}
                                className="cursor-pointer hover:border-primary transition-colors overflow-hidden group"
                                onClick={() => onSelect(type)}
                            >
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        {getIcon(type)}
                                    </div>
                                    <div>
                                        <CardTitle>{getLabel(type)}</CardTitle>
                                        <CardDescription>{getDescription(type)}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="h-48 bg-muted/30 p-4 flex items-center justify-center relative">
                                    {/* Simplified Preview - In a real app, this might be a static image or a lightweight chart */}
                                    <div className="w-full h-full opacity-70 pointer-events-none">
                                        <ChartPreview
                                            data={data}
                                            chartType={type}
                                            styles={{ showGrid: false, showLegend: false }}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-4 flex justify-end">
                                    <Button variant="ghost" className="gap-2 group-hover:text-primary">
                                        Select <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center pt-8">
                        <Button variant="outline" size="lg" onClick={onCustomSelect}>
                            View All Chart Styles
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
