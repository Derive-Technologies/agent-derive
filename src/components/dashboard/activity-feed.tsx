import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { 
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause,
  User,
  Workflow,
  AlertTriangle,
  MoreHorizontal,
  ExternalLink
} from "lucide-react"
import { cn, formatRelativeTime } from "../../lib/utils"

interface ActivityItem {
  id: string
  type: "execution" | "approval" | "workflow_update" | "system"
  title: string
  description: string
  timestamp: Date
  status: "success" | "error" | "warning" | "info"
  user?: {
    name: string
    avatar?: string
  }
  workflowName?: string
  workflowId?: string
  metadata?: Record<string, any>
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  onViewActivity?: (activityId: string) => void
  onViewWorkflow?: (workflowId: string) => void
  className?: string
  showHeader?: boolean
  maxHeight?: string
}

const activityIcons = {
  execution: Workflow,
  approval: User,
  workflow_update: Play,
  system: AlertTriangle
}

const statusConfig = {
  success: {
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200"
  },
  error: {
    color: "text-red-600",
    bgColor: "bg-red-100", 
    borderColor: "border-red-200"
  },
  warning: {
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200"
  },
  info: {
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200"
  }
}

function ActivityIcon({ type, status }: { type: ActivityItem["type"], status: ActivityItem["status"] }) {
  const Icon = activityIcons[type]
  const config = statusConfig[status]

  return (
    <div className={cn(
      "flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0",
      config.bgColor,
      config.borderColor
    )}>
      <Icon className={cn("h-4 w-4", config.color)} />
    </div>
  )
}

function ActivityItemComponent({ 
  activity, 
  onViewActivity, 
  onViewWorkflow 
}: { 
  activity: ActivityItem
  onViewActivity?: (id: string) => void
  onViewWorkflow?: (id: string) => void
}) {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
      <ActivityIcon type={activity.type} status={activity.status} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium leading-tight">
              {activity.title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {activity.description}
            </p>
            
            {/* Metadata */}
            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
              <span>{formatRelativeTime(activity.timestamp)}</span>
              
              {activity.user && (
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{activity.user.name}</span>
                </div>
              )}
              
              {activity.workflowName && (
                <button
                  onClick={() => activity.workflowId && onViewWorkflow?.(activity.workflowId)}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  <Workflow className="h-3 w-3" />
                  <span>{activity.workflowName}</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-1 ml-2">
            {onViewActivity && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewActivity(activity.id)}
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ActivityFeed({
  activities,
  onViewActivity,
  onViewWorkflow,
  className,
  showHeader = true,
  maxHeight = "400px"
}: ActivityFeedProps) {
  const groupedActivities = (activities || []).reduce((acc, activity) => {
    const date = activity.timestamp.toDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(activity)
    return acc
  }, {} as Record<string, ActivityItem[]>)

  const formatDateGroup = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { 
        weekday: "long", 
        month: "short", 
        day: "numeric" 
      })
    }
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {activities.length}
            </Badge>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }}>
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Workflow className="h-8 w-8 mb-2" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {Object.entries(groupedActivities)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([date, items]) => (
                  <div key={date}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {formatDateGroup(date)}
                    </h3>
                    <div className="space-y-1">
                      {items.map((activity) => (
                        <ActivityItemComponent
                          key={activity.id}
                          activity={activity}
                          onViewActivity={onViewActivity}
                          onViewWorkflow={onViewWorkflow}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Helper function to create activity items from common events
export const createActivityItem = {
  executionSuccess: (
    executionId: string,
    workflowName: string,
    workflowId: string,
    duration: number
  ): ActivityItem => ({
    id: `exec-${executionId}`,
    type: "execution",
    title: "Workflow executed successfully",
    description: `${workflowName} completed in ${duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(1)}s`}`,
    timestamp: new Date(),
    status: "success",
    workflowName,
    workflowId
  }),

  executionFailure: (
    executionId: string,
    workflowName: string,
    workflowId: string,
    error: string
  ): ActivityItem => ({
    id: `exec-${executionId}`,
    type: "execution",
    title: "Workflow execution failed",
    description: `${workflowName}: ${error}`,
    timestamp: new Date(),
    status: "error",
    workflowName,
    workflowId
  }),

  approvalRequest: (
    approvalId: string,
    workflowName: string,
    workflowId: string,
    requestedBy: { name: string; avatar?: string }
  ): ActivityItem => ({
    id: `approval-${approvalId}`,
    type: "approval",
    title: "Approval requested",
    description: `${workflowName} is waiting for approval`,
    timestamp: new Date(),
    status: "warning",
    user: requestedBy,
    workflowName,
    workflowId
  }),

  workflowUpdated: (
    workflowId: string,
    workflowName: string,
    updatedBy: { name: string; avatar?: string }
  ): ActivityItem => ({
    id: `workflow-${workflowId}-${Date.now()}`,
    type: "workflow_update",
    title: "Workflow updated",
    description: `${workflowName} configuration was modified`,
    timestamp: new Date(),
    status: "info",
    user: updatedBy,
    workflowName,
    workflowId
  })
}