"use client"

import React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export interface AreaChartProps {
    data: Record<string, string | number>[]
    config: ChartConfig
    dataKey: string
    xAxisKey?: string

    // Chart styling
    margin?: {
        top?: number
        right?: number
        bottom?: number
        left?: number
    }
    fillOpacity?: number
    areaType?: "basis" | "basisClosed" | "basisOpen" | "linear" | "linearClosed" | "natural" | "monotone" | "step" | "stepBefore" | "stepAfter"

    // Chart options
    showGrid?: boolean
    gridVertical?: boolean
    showTooltip?: boolean
    tooltipCursor?: boolean | React.ComponentProps<typeof ChartTooltip>["cursor"]
    tooltipIndicator?: "line" | "dot" | "dashed"

    // XAxis props
    tickLine?: boolean
    axisLine?: boolean
    tickMargin?: number
    tickFormatter?: (value: string | number, index: number) => string

    [key: string]: unknown
}

const defaultChartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]

const defaultChartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export const ChartArea = ({
    data = defaultChartData,
    config = defaultChartConfig,
    dataKey = "desktop",
    xAxisKey,
    margin = { left: 12, right: 12 },
    fillOpacity = 0.4,
    areaType = "natural",
    showGrid = true,
    gridVertical = false,
    showTooltip = true,
    tooltipCursor = false,
    tooltipIndicator = "line",
    tickLine = false,
    axisLine = false,
    tickMargin = 8,
    tickFormatter,

    ...rest
}: AreaChartProps): React.JSX.Element => {
    // Simplified: choose xAxisKey if given, else use the first key from the data object (usually appropriate for axis labels)
    const xAxisDataKey = xAxisKey || Object.keys(data[0] || {})[0];

    const colorKey = config[dataKey as keyof typeof config]
    const color = colorKey?.color || `var(--color-${dataKey})`

    return (
                <ChartContainer config={config}>
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={margin}
                        {...rest}
                    >
                        {showGrid && <CartesianGrid vertical={gridVertical} />}
                        <XAxis
                            dataKey={xAxisDataKey}
                            tickLine={tickLine}
                            axisLine={axisLine}
                            tickMargin={tickMargin}
                            tickFormatter={tickFormatter}
                        />
                        {showTooltip && (
                            <ChartTooltip
                                cursor={tooltipCursor}
                                content={<ChartTooltipContent indicator={tooltipIndicator} />}
                            />
                        )}
                        <Area
                            dataKey={dataKey}
                            type={areaType}
                            fill={color}
                            fillOpacity={fillOpacity}
                            stroke={color}
                        />
                    </AreaChart>
                </ChartContainer>

    )
};

export default ChartArea;