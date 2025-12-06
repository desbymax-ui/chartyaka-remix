"use client"

import { useMemo } from "react"
import type { ChartData } from "@/app/page"
import { getRandomPalette } from "@/lib/color-generator"

interface DiagramPreviewProps {
    data: ChartData
    diagramType: "flow" | "tree" | "org" | "mindmap"
}

export function DiagramPreview({ data, diagramType }: DiagramPreviewProps) {
    // Generate random colors for each diagram render
    const colors = useMemo(() => getRandomPalette(), [])

    const renderFlowDiagram = () => {
        const nodeHeight = 60
        const nodeWidth = 180
        const verticalGap = 80
        const horizontalGap = 40

        return (
            <svg width="100%" height="100%" viewBox="0 0 600 400" className="mx-auto">
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3, 0 6" fill="#888" />
                    </marker>
                </defs>
                {data.data.map((item, index) => {
                    const x = 300 - nodeWidth / 2
                    const y = 50 + index * (nodeHeight + verticalGap)
                    const color = colors[index % colors.length]
                    const label = String(item[data.columns[0]] || "")
                    const value = String(item[data.columns[1]] || "")

                    return (
                        <g key={index}>
                            {/* Connection arrow */}
                            {index > 0 && (
                                <line
                                    x1={x + nodeWidth / 2}
                                    y1={y - verticalGap + nodeHeight}
                                    x2={x + nodeWidth / 2}
                                    y2={y}
                                    stroke="#888"
                                    strokeWidth="2"
                                    markerEnd="url(#arrowhead)"
                                />
                            )}
                            {/* Node */}
                            <rect
                                x={x}
                                y={y}
                                width={nodeWidth}
                                height={nodeHeight}
                                fill={color}
                                rx="8"
                                opacity="0.9"
                            />
                            <text
                                x={x + nodeWidth / 2}
                                y={y + 25}
                                textAnchor="middle"
                                fill="white"
                                fontSize="14"
                                fontWeight="600"
                            >
                                {label.length > 20 ? label.substring(0, 20) + "..." : label}
                            </text>
                            <text
                                x={x + nodeWidth / 2}
                                y={y + 45}
                                textAnchor="middle"
                                fill="white"
                                fontSize="11"
                                opacity="0.9"
                            >
                                {value.length > 25 ? value.substring(0, 25) + "..." : value}
                            </text>
                        </g>
                    )
                })}
            </svg>
        )
    }

    const renderTreeDiagram = () => {
        const nodeSize = 100
        const levelHeight = 120
        const maxItemsPerLevel = 3

        // Create tree structure
        const root = data.data[0]
        const children = data.data.slice(1)

        return (
            <svg width="100%" height="100%" viewBox="0 0 600 400" className="mx-auto">
                {/* Root node */}
                <g>
                    <circle cx={300} cy={50} r={40} fill={colors[0]} opacity="0.9" />
                    <text
                        x={300}
                        y={55}
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="600"
                    >
                        {String(root?.[data.columns[0]] || "Root").substring(0, 10)}
                    </text>
                </g>

                {/* Child nodes */}
                {children.slice(0, 6).map((item, index) => {
                    const totalChildren = Math.min(children.length, 6)
                    const spacing = 500 / (totalChildren + 1)
                    const x = 50 + spacing * (index + 1)
                    const y = 180
                    const color = colors[(index + 1) % colors.length]
                    const label = String(item[data.columns[0]] || "")

                    return (
                        <g key={index}>
                            {/* Connection line */}
                            <line
                                x1={300}
                                y1={90}
                                x2={x}
                                y2={y - 30}
                                stroke="#888"
                                strokeWidth="2"
                                opacity="0.5"
                            />
                            {/* Node */}
                            <circle cx={x} cy={y} r={30} fill={color} opacity="0.9" />
                            <text
                                x={x}
                                y={y + 5}
                                textAnchor="middle"
                                fill="white"
                                fontSize="10"
                                fontWeight="600"
                            >
                                {label.substring(0, 8)}
                            </text>
                        </g>
                    )
                })}
            </svg>
        )
    }

    const renderOrgChart = () => {
        const nodeWidth = 140
        const nodeHeight = 50
        const levelHeight = 100

        return (
            <svg width="100%" height="100%" viewBox="0 0 600 400" className="mx-auto">
                {/* CEO/Root */}
                {data.data[0] && (
                    <g>
                        <rect
                            x={300 - nodeWidth / 2}
                            y={30}
                            width={nodeWidth}
                            height={nodeHeight}
                            fill={colors[0]}
                            rx="6"
                            opacity="0.9"
                        />
                        <text
                            x={300}
                            y={60}
                            textAnchor="middle"
                            fill="white"
                            fontSize="12"
                            fontWeight="600"
                        >
                            {String(data.data[0][data.columns[0]] || "").substring(0, 15)}
                        </text>
                    </g>
                )}

                {/* Department heads */}
                {data.data.slice(1, 4).map((item, index) => {
                    const totalDepts = Math.min(data.data.length - 1, 3)
                    const spacing = 400 / (totalDepts + 1)
                    const x = 100 + spacing * (index + 1) - nodeWidth / 2
                    const y = 150
                    const color = colors[(index + 1) % colors.length]
                    const label = String(item[data.columns[0]] || "")

                    return (
                        <g key={index}>
                            {/* Connection line */}
                            <line
                                x1={300}
                                y1={80}
                                x2={x + nodeWidth / 2}
                                y2={y}
                                stroke="#888"
                                strokeWidth="2"
                                opacity="0.5"
                            />
                            {/* Node */}
                            <rect
                                x={x}
                                y={y}
                                width={nodeWidth}
                                height={nodeHeight}
                                fill={color}
                                rx="6"
                                opacity="0.9"
                            />
                            <text
                                x={x + nodeWidth / 2}
                                y={y + 30}
                                textAnchor="middle"
                                fill="white"
                                fontSize="11"
                                fontWeight="600"
                            >
                                {label.substring(0, 15)}
                            </text>
                        </g>
                    )
                })}
            </svg>
        )
    }

    const renderMindMap = () => {
        const centerX = 300
        const centerY = 200
        const radius = 120

        return (
            <svg width="100%" height="100%" viewBox="0 0 600 400" className="mx-auto">
                {/* Central node */}
                {data.data[0] && (
                    <g>
                        <ellipse
                            cx={centerX}
                            cy={centerY}
                            rx={80}
                            ry={50}
                            fill={colors[0]}
                            opacity="0.9"
                        />
                        <text
                            x={centerX}
                            y={centerY + 5}
                            textAnchor="middle"
                            fill="white"
                            fontSize="13"
                            fontWeight="600"
                        >
                            {String(data.data[0][data.columns[0]] || "").substring(0, 12)}
                        </text>
                    </g>
                )}

                {/* Branch nodes */}
                {data.data.slice(1, 7).map((item, index) => {
                    const angle = (index * 360) / Math.min(data.data.length - 1, 6)
                    const radian = (angle * Math.PI) / 180
                    const x = centerX + radius * Math.cos(radian)
                    const y = centerY + radius * Math.sin(radian)
                    const color = colors[(index + 1) % colors.length]
                    const label = String(item[data.columns[0]] || "")

                    return (
                        <g key={index}>
                            {/* Connection line */}
                            <line
                                x1={centerX}
                                y1={centerY}
                                x2={x}
                                y2={y}
                                stroke="#888"
                                strokeWidth="2"
                                opacity="0.5"
                            />
                            {/* Node */}
                            <ellipse
                                cx={x}
                                cy={y}
                                rx={60}
                                ry={35}
                                fill={color}
                                opacity="0.9"
                            />
                            <text
                                x={x}
                                y={y + 5}
                                textAnchor="middle"
                                fill="white"
                                fontSize="10"
                                fontWeight="600"
                            >
                                {label.substring(0, 10)}
                            </text>
                        </g>
                    )
                })}
            </svg>
        )
    }

    const diagramRenderers = {
        flow: renderFlowDiagram,
        tree: renderTreeDiagram,
        org: renderOrgChart,
        mindmap: renderMindMap,
    }

    if (!data.data.length) {
        return (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                No data available
            </div>
        )
    }

    return (
        <div className="h-full w-full flex items-center justify-center bg-background/50 rounded-lg">
            {diagramRenderers[diagramType]()}
        </div>
    )
}
