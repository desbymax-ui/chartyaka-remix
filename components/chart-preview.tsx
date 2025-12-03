"use client"

import { useMemo } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import type { ChartType, ChartData } from "@/app/page"
import type { ChartStyles } from "@/components/chart-workspace"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

interface ChartPreviewProps {
  data: ChartData
  chartType: ChartType
  styles: ChartStyles
}

export function ChartPreview({ data, chartType, styles }: ChartPreviewProps) {
  const { colorPalette, showGrid, showLegend } = styles

  const { numericColumns, labelColumn } = useMemo(() => {
    const firstRow = data.data[0]
    if (!firstRow) return { numericColumns: [], labelColumn: data.columns[0] || "" }

    const numeric = data.columns.filter((col) => typeof firstRow[col] === "number")
    const label = data.columns.find((col) => typeof firstRow[col] === "string") || data.columns[0] || ""

    return { numericColumns: numeric, labelColumn: label }
  }, [data])

  const tooltipStyle = {
    backgroundColor: "#1a1a2e",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
  }

  if (!data.data.length || !data.columns.length) {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>{data.title || "Chart"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderBarChart = () => (
    <BarChart data={data.data}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#333" />}
      <XAxis dataKey={labelColumn} stroke="#888" fontSize={12} />
      <YAxis stroke="#888" fontSize={12} />
      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255, 255, 255, 0.1)" }} />
      {showLegend && <Legend />}
      {numericColumns.map((col, i) => (
        <Bar key={col} dataKey={col} fill={colorPalette[i % colorPalette.length]} radius={[4, 4, 0, 0]} />
      ))}
    </BarChart>
  )

  const renderLineChart = () => (
    <LineChart data={data.data}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#333" />}
      <XAxis dataKey={labelColumn} stroke="#888" fontSize={12} />
      <YAxis stroke="#888" fontSize={12} />
      <Tooltip contentStyle={tooltipStyle} />
      {showLegend && <Legend />}
      {numericColumns.map((col, i) => (
        <Line
          key={col}
          type="monotone"
          dataKey={col}
          stroke={colorPalette[i % colorPalette.length]}
          strokeWidth={2}
          dot={{ fill: colorPalette[i % colorPalette.length] }}
        />
      ))}
    </LineChart>
  )

  const renderAreaChart = () => (
    <AreaChart data={data.data}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#333" />}
      <XAxis dataKey={labelColumn} stroke="#888" fontSize={12} />
      <YAxis stroke="#888" fontSize={12} />
      <Tooltip contentStyle={tooltipStyle} />
      {showLegend && <Legend />}
      {numericColumns.map((col, i) => (
        <Area
          key={col}
          type="monotone"
          dataKey={col}
          stroke={colorPalette[i % colorPalette.length]}
          fill={colorPalette[i % colorPalette.length]}
          fillOpacity={0.3}
          strokeWidth={2}
        />
      ))}
    </AreaChart>
  )

  const renderPieChart = () => {
    const pieData = data.data.map((row, i) => ({
      name: String(row[labelColumn] || ""),
      value: Number(row[numericColumns[0]] || 0),
      fill: colorPalette[i % colorPalette.length],
    }))

    return (
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={{ stroke: "#888" }}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#fff" }} />
        {showLegend && <Legend />}
      </PieChart>
    )
  }

  const chartComponents: Record<ChartType, () => React.ReactElement> = {
    bar: renderBarChart,
    line: renderLineChart,
    area: renderAreaChart,
    pie: renderPieChart,
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartComponents[chartType]()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
