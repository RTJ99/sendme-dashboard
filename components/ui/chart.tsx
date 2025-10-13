"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface ChartProps {
  children: React.ReactNode
  className?: string
}

const Chart: React.FC<ChartProps> = ({ children, className }) => {
  return <div className={cn("w-full", className)}>{children}</div>
}

interface ChartContainerProps {
  children: React.ReactNode
  className?: string
}

const ChartContainer: React.FC<ChartContainerProps> = ({ children, className }) => {
  return <div className={cn("relative", className)}>{children}</div>
}

interface ChartLegendProps {
  children: React.ReactNode
  className?: string
}

const ChartLegend: React.FC<ChartLegendProps> = ({ children, className }) => {
  return <div className={cn("flex items-center gap-4", className)}>{children}</div>
}

interface ChartLegendItemProps {
  name: string
  color: string
  className?: string
}

const ChartLegendItem: React.FC<ChartLegendItemProps> = ({ name, color, className }) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: color }}></span>
      <span className="text-sm text-gray-600">{name}</span>
    </div>
  )
}

interface ChartTooltipProps {
  children: React.ReactNode
  className?: string
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ children, className }) => {
  return <div className={cn("absolute z-10 rounded-md border bg-white p-2 shadow-md", className)}>{children}</div>
}

interface ChartTooltipContentProps {
  children: React.ReactNode
  className?: string
}

const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

interface ChartTooltipItemProps {
  name: string
  value: string | number
  className?: string
}

const ChartTooltipItem: React.FC<ChartTooltipItemProps> = ({ name, value, className }) => {
  return (
    <div className={cn("flex items-center justify-between space-x-2", className)}>
      <span className="text-sm font-medium">{name}</span>
      <span className="text-sm text-gray-500">{value}</span>
    </div>
  )
}

export { Chart, ChartContainer, ChartLegend, ChartLegendItem, ChartTooltip, ChartTooltipContent, ChartTooltipItem }
