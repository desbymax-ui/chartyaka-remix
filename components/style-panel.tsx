"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Info } from "lucide-react"
import type { ChartStyles } from "@/components/chart-workspace"

interface StylePanelProps {
  styles: ChartStyles
  onStyleChange: (styles: ChartStyles) => void
}

export function StylePanel({ styles, onStyleChange }: StylePanelProps) {
  return (
    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
      <div>
        <h2 className="font-semibold text-foreground mb-4">Style Options</h2>
      </div>

      {/* Info about colors */}
      <div className="p-3 rounded-lg bg-muted/50 border border-border">
        <div className="flex gap-2 items-start">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Colors are automatically randomized with high contrast for better readability.
          </p>
        </div>
      </div>

      {/* Toggle Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="grid" className="text-sm">
            Grid Lines
          </Label>
          <Switch
            id="grid"
            checked={styles.showGrid}
            onCheckedChange={(checked) => onStyleChange({ ...styles, showGrid: checked })}
            className="data-[state=unchecked]:bg-muted-foreground/30 data-[state=unchecked]:border data-[state=unchecked]:border-muted-foreground/50"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="legend" className="text-sm">
            Show Legend
          </Label>
          <Switch
            id="legend"
            checked={styles.showLegend}
            onCheckedChange={(checked) => onStyleChange({ ...styles, showLegend: checked })}
            className="data-[state=unchecked]:bg-muted-foreground/30 data-[state=unchecked]:border data-[state=unchecked]:border-muted-foreground/50"
          />
        </div>
      </div>
    </div>
  )
}
