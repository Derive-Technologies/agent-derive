import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { 
  CheckCircle,
  XCircle,
  Clock,
  Play,
  AlertTriangle,
  ChevronRight,
  RotateCw
} from "lucide-react"
import { cn, formatRelativeTime } from "../../lib/utils"

interface ExecutionStep {
  id: string
  name: string
  type: "action" | "condition" | "approval" | "integration"
  status: "pending" | "running" | "completed" | "failed" | "skipped"
  startedAt?: Date
  completedAt?: Date
  duration?: number // in milliseconds
  error?: string
  output?: Record<string, any>
  retryCount?: number
}

interface ExecutionTimelineProps {
  executionId: string
  workflowName: string
  status: "running" | "completed" | "failed" | "cancelled"
  steps: ExecutionStep[]
  startedAt: Date
  completedAt?: Date
  onRetryStep?: (stepId: string) => void
  onViewStepDetails?: (stepId: string) => void
  className?: string
}

const stepStatusConfig = {
  pending: {
    icon: Clock,
    color: "text-gray-400",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200"
  },
  running: {
    icon: RotateCw,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    animate: true
  },
  completed: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200"
  },
  failed: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200"
  },
  skipped: {
    icon: ChevronRight,
    color: "text-gray-400",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-100"
  }
}

const executionStatusConfig = {
  running: { label: "Running", variant: "info" as const },
  completed: { label: "Completed", variant: "success" as const },
  failed: { label: "Failed", variant: "destructive" as const },
  cancelled: { label: "Cancelled", variant: "secondary" as const }
}

function StepItem({ 
  step, 
  isLast, 
  onRetry, 
  onViewDetails 
}: { 
  step: ExecutionStep
  isLast: boolean
  onRetry?: (stepId: string) => void
  onViewDetails?: (stepId: string) => void
}) {
  const config = stepStatusConfig[step.status]
  const Icon = config.icon

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  return (
    <div className="flex items-start space-x-3">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full border-2",
            config.bgColor,
            config.borderColor
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4",
              config.color,
              config.animate && "animate-spin"
            )}
          />
        </div>
        {!isLast && (
          <div className="w-px h-12 bg-gray-200 mt-2" />
        )}
      </div>

      {/* Step content */}
      <div className="flex-1 min-w-0 pb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-sm">{step.name}</h4>
              <Badge variant="outline" className="text-xs">
                {step.type}
              </Badge>
              {step.retryCount && step.retryCount > 0 && (
                <Badge variant="warning" className="text-xs">
                  Retry {step.retryCount}
                </Badge>
              )}
            </div>

            {/* Timing info */}
            <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
              {step.startedAt && (
                <span>Started {formatRelativeTime(step.startedAt)}</span>
              )}
              {step.duration && (
                <span>Duration: {formatDuration(step.duration)}</span>
              )}
            </div>

            {/* Error message */}
            {step.error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                {step.error}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 ml-4">
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(step.id)}
                className="h-6 text-xs"
              >
                Details
              </Button>
            )}
            {step.status === "failed" && onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRetry(step.id)}
                className="h-6 text-xs"
              >
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ExecutionTimeline({
  executionId,
  workflowName,
  status,
  steps,
  startedAt,
  completedAt,
  onRetryStep,
  onViewStepDetails,
  className
}: ExecutionTimelineProps) {
  const statusConfig = executionStatusConfig[status]
  
  const totalDuration = completedAt 
    ? completedAt.getTime() - startedAt.getTime()
    : Date.now() - startedAt.getTime()

  const completedSteps = steps.filter(step => step.status === "completed").length
  const failedSteps = steps.filter(step => step.status === "failed").length

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{workflowName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Execution #{executionId.slice(-8)}
            </p>
          </div>
          <Badge variant={statusConfig.variant}>
            {statusConfig.label}
          </Badge>
        </div>

        {/* Summary stats */}
        <div className="flex items-center space-x-6 text-sm">
          <div>
            <span className="text-muted-foreground">Duration: </span>
            <span className="font-medium">
              {totalDuration < 1000 ? `${totalDuration}ms` : 
               totalDuration < 60000 ? `${(totalDuration / 1000).toFixed(1)}s` : 
               `${(totalDuration / 60000).toFixed(1)}m`}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Steps: </span>
            <span className="font-medium">
              {completedSteps}/{steps.length} completed
            </span>
          </div>
          {failedSteps > 0 && (
            <div>
              <span className="text-muted-foreground">Failed: </span>
              <span className="font-medium text-red-600">{failedSteps}</span>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Started: </span>
            <span className="font-medium">
              {formatRelativeTime(startedAt)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-0">
          {steps.map((step, index) => (
            <StepItem
              key={step.id}
              step={step}
              isLast={index === steps.length - 1}
              onRetry={onRetryStep}
              onViewDetails={onViewStepDetails}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}