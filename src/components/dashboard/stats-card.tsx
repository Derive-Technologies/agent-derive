import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { cn } from "../../lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  change?: {
    value: number
    period: string
    isPositive: boolean
  }
  className?: string
  variant?: "default" | "success" | "warning" | "destructive"
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  change,
  className,
  variant = "default"
}: StatsCardProps) {
  const variantStyles = {
    default: "border-border",
    success: "border-green-200 bg-green-50/50",
    warning: "border-orange-200 bg-orange-50/50", 
    destructive: "border-red-200 bg-red-50/50"
  }

  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`
      }
      return val.toLocaleString()
    }
    return val
  }

  const getTrendIcon = () => {
    if (!trend) return null
    
    if (trend.isPositive === undefined) {
      return <Minus className="h-3 w-3" />
    }
    
    return trend.isPositive ? (
      <TrendingUp className="h-3 w-3" />
    ) : (
      <TrendingDown className="h-3 w-3" />
    )
  }

  const getTrendColor = () => {
    if (!trend || trend.isPositive === undefined) {
      return "text-muted-foreground"
    }
    return trend.isPositive ? "text-green-600" : "text-red-600"
  }

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {formatValue(value)}
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            {/* Trend indicator */}
            {trend && (
              <div className={cn("flex items-center space-x-1 text-xs", getTrendColor())}>
                {getTrendIcon()}
                <span className="font-medium">
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-muted-foreground">
                  {trend.label}
                </span>
              </div>
            )}

            {/* Change indicator */}
            {change && (
              <Badge 
                variant={change.isPositive ? "success" : "destructive"}
                className="text-xs font-normal"
              >
                {change.isPositive ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(change.value)}% {change.period}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Pre-configured stat cards for common metrics
export function WorkflowStatsCard({ 
  totalWorkflows, 
  activeWorkflows,
  className 
}: { 
  totalWorkflows: number
  activeWorkflows: number
  className?: string 
}) {
  const activePercentage = totalWorkflows > 0 ? 
    Math.round((activeWorkflows / totalWorkflows) * 100) : 0

  return (
    <StatsCard
      title="Active Workflows"
      value={activeWorkflows}
      description={`${totalWorkflows} total workflows`}
      trend={{
        value: activePercentage,
        label: "of total",
        isPositive: activePercentage > 50
      }}
      className={className}
    />
  )
}

export function ExecutionStatsCard({ 
  executions,
  successRate,
  period = "24h",
  className 
}: { 
  executions: number
  successRate: number
  period?: string
  className?: string 
}) {
  return (
    <StatsCard
      title="Executions"
      value={executions}
      description={`Success rate: ${successRate}%`}
      change={{
        value: successRate,
        period,
        isPositive: successRate >= 90
      }}
      variant={successRate >= 90 ? "success" : successRate >= 70 ? "warning" : "destructive"}
      className={className}
    />
  )
}

export function ApprovalStatsCard({ 
  pendingApprovals,
  averageTime,
  className 
}: { 
  pendingApprovals: number
  averageTime: number // in minutes
  className?: string 
}) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <StatsCard
      title="Pending Approvals"
      value={pendingApprovals}
      description={`Avg. response: ${formatTime(averageTime)}`}
      variant={pendingApprovals > 10 ? "warning" : "default"}
      className={className}
    />
  )
}