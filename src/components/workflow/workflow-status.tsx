import React from "react"
import { Badge } from "../ui/badge"
import { 
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause,
  AlertTriangle,
  FileText
} from "lucide-react"
import { cn } from "../../lib/utils"

export type WorkflowStatusType = 
  | "draft" 
  | "active" 
  | "paused" 
  | "completed" 
  | "failed" 
  | "running" 
  | "pending"

interface WorkflowStatusProps {
  status: WorkflowStatusType
  className?: string
  showIcon?: boolean
  size?: "sm" | "md" | "lg"
}

const statusConfig = {
  draft: {
    label: "Draft",
    variant: "outline" as const,
    icon: FileText,
    color: "text-gray-500"
  },
  active: {
    label: "Active",
    variant: "success" as const,
    icon: Play,
    color: "text-green-600"
  },
  paused: {
    label: "Paused",
    variant: "warning" as const,
    icon: Pause,
    color: "text-orange-600"
  },
  completed: {
    label: "Completed",
    variant: "success" as const,
    icon: CheckCircle,
    color: "text-green-600"
  },
  failed: {
    label: "Failed",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-red-600"
  },
  running: {
    label: "Running",
    variant: "info" as const,
    icon: Play,
    color: "text-blue-600"
  },
  pending: {
    label: "Pending",
    variant: "pending" as const,
    icon: Clock,
    color: "text-orange-500"
  }
}

export function WorkflowStatus({ 
  status, 
  className, 
  showIcon = true,
  size = "md" 
}: WorkflowStatusProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5", 
    lg: "text-base px-3 py-1"
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  return (
    <Badge 
      variant={config.variant} 
      className={cn(
        "inline-flex items-center gap-1",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </Badge>
  )
}

// Helper component for workflow execution status with additional context
interface ExecutionStatusProps extends WorkflowStatusProps {
  executionTime?: number // in milliseconds
  errorMessage?: string
}

export function ExecutionStatus({ 
  status, 
  executionTime, 
  errorMessage,
  className,
  ...props 
}: ExecutionStatusProps) {
  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <WorkflowStatus status={status} {...props} />
      
      {executionTime && status === "completed" && (
        <span className="text-xs text-muted-foreground">
          in {formatExecutionTime(executionTime)}
        </span>
      )}
      
      {errorMessage && status === "failed" && (
        <span className="text-xs text-red-600 truncate max-w-32" title={errorMessage}>
          {errorMessage}
        </span>
      )}
    </div>
  )
}