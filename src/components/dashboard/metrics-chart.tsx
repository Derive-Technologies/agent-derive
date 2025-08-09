import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Download,
  RefreshCw
} from "lucide-react"
import { cn } from "../../lib/utils"

interface MetricDataPoint {
  timestamp: string | Date
  value: number
  label?: string
  [key: string]: any
}

interface MetricsChartProps {
  title: string
  data: MetricDataPoint[]
  type?: "line" | "area" | "bar" | "pie"
  timeRange?: "24h" | "7d" | "30d" | "90d"
  onTimeRangeChange?: (range: string) => void
  onRefresh?: () => void
  onExport?: () => void
  isLoading?: boolean
  className?: string
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  colors?: string[]
  yAxisLabel?: string
  xAxisLabel?: string
  tooltip?: boolean
}

const defaultColors = [
  "#8b5cf6", // purple-500
  "#10b981", // emerald-500  
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#3b82f6", // blue-500
  "#8b5a2b", // orange-600
  "#6366f1", // indigo-500
  "#ec4899", // pink-500
]

const timeRangeLabels = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days", 
  "30d": "Last 30 days",
  "90d": "Last 90 days"
}

function CustomTooltip({ active, payload, label, type }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm">
            {entry.name}: <span className="font-medium">{entry.value}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

function LoadingSkeleton({ height }: { height: number }) {
  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="bg-muted rounded-lg w-full h-full flex items-center justify-center">
        <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin" />
      </div>
    </div>
  )
}

export function MetricsChart({
  title,
  data,
  type = "line",
  timeRange = "7d",
  onTimeRangeChange,
  onRefresh,
  onExport,
  isLoading = false,
  className,
  height = 300,
  showLegend = false,
  showGrid = true,
  colors = defaultColors,
  yAxisLabel,
  xAxisLabel,
  tooltip = true
}: MetricsChartProps) {
  const formatXAxis = (tickItem: any) => {
    if (timeRange === "24h") {
      return new Date(tickItem).toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit" 
      })
    } else {
      return new Date(tickItem).toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
      })
    }
  }

  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000000) {
      return `${(tickItem / 1000000).toFixed(1)}M`
    }
    if (tickItem >= 1000) {
      return `${(tickItem / 1000).toFixed(1)}K`
    }
    return tickItem.toString()
  }

  const calculateTrend = () => {
    if (!data || data.length < 2) return null
    
    const latest = data[data.length - 1]?.value || 0
    const previous = data[data.length - 2]?.value || 0
    
    if (previous === 0) return null
    
    const change = ((latest - previous) / previous) * 100
    return {
      value: Math.abs(change),
      isPositive: change > 0
    }
  }

  const trend = calculateTrend()

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data available
        </div>
      )
    }
    
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    switch (type) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxis}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              fontSize={12}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            />
            {tooltip && <Tooltip content={<CustomTooltip type={type} />} />}
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        )

      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxis}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              fontSize={12}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            />
            {tooltip && <Tooltip content={<CustomTooltip type={type} />} />}
            {showLegend && <Legend />}
            <Bar dataKey="value" fill={colors[0]} />
          </BarChart>
        )

      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {tooltip && <Tooltip />}
          </PieChart>
        )

      default: // line
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxis}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              fontSize={12}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            />
            {tooltip && <Tooltip content={<CustomTooltip type={type} />} />}
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          {trend && (
            <Badge 
              variant={trend.isPositive ? "success" : "destructive"}
              className="text-xs"
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {trend.value.toFixed(1)}%
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Time range selector */}
          {onTimeRangeChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {timeRangeLabels[timeRange]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(timeRangeLabels).map(([value, label]) => (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => onTimeRangeChange(value)}
                    className={timeRange === value ? "bg-accent" : ""}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onRefresh && (
                <DropdownMenuItem onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </DropdownMenuItem>
              )}
              {onExport && (
                <DropdownMenuItem onClick={onExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div style={{ height }}>
          {isLoading ? (
            <LoadingSkeleton height={height} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Pre-configured chart components for common use cases
export function ExecutionMetricsChart({ 
  data, 
  timeRange, 
  onTimeRangeChange,
  className 
}: {
  data: MetricDataPoint[]
  timeRange?: string
  onTimeRangeChange?: (range: string) => void
  className?: string
}) {
  return (
    <MetricsChart
      title="Workflow Executions"
      data={data}
      type="area"
      timeRange={timeRange as any}
      onTimeRangeChange={onTimeRangeChange}
      yAxisLabel="Executions"
      className={className}
    />
  )
}

export function SuccessRateChart({ 
  data, 
  className 
}: {
  data: MetricDataPoint[]
  className?: string
}) {
  return (
    <MetricsChart
      title="Success Rate"
      data={data}
      type="line"
      yAxisLabel="Success Rate (%)"
      colors={["#10b981"]}
      className={className}
    />
  )
}