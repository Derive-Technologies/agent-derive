import React from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { 
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  Calendar,
  User
} from "lucide-react"
import { cn, formatRelativeTime } from "../../lib/utils"

interface WorkflowCardProps {
  workflow: {
    id: string
    name: string
    description?: string
    status: "draft" | "active" | "paused" | "archived"
    lastRun?: Date
    nextRun?: Date
    createdBy: {
      name: string
      avatar?: string
    }
    executionCount: number
    successRate: number
  }
  onEdit?: (workflowId: string) => void
  onDelete?: (workflowId: string) => void
  onDuplicate?: (workflowId: string) => void
  onToggleStatus?: (workflowId: string, newStatus: "active" | "paused") => void
  className?: string
}

const statusConfig = {
  draft: {
    label: "Draft",
    variant: "outline" as const,
    color: "text-gray-600"
  },
  active: {
    label: "Active",
    variant: "success" as const,
    color: "text-green-600"
  },
  paused: {
    label: "Paused",
    variant: "warning" as const,
    color: "text-orange-600"
  },
  archived: {
    label: "Archived",
    variant: "secondary" as const,
    color: "text-gray-500"
  }
}

export function WorkflowCard({
  workflow,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  className
}: WorkflowCardProps) {
  const statusInfo = statusConfig[workflow.status]

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{workflow.name}</h3>
          {workflow.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {workflow.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Badge variant={statusInfo.variant}>
            {statusInfo.label}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open workflow menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(workflow.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onToggleStatus && workflow.status !== "archived" && (
                <DropdownMenuItem 
                  onClick={() => onToggleStatus(
                    workflow.id, 
                    workflow.status === "active" ? "paused" : "active"
                  )}
                >
                  {workflow.status === "active" ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(workflow.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(workflow.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Execution Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Executions</span>
            <p className="font-medium">{workflow.executionCount.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Success Rate</span>
            <p className="font-medium">
              <span className={workflow.successRate >= 90 ? "text-green-600" : 
                workflow.successRate >= 70 ? "text-orange-600" : "text-red-600"}>
                {workflow.successRate}%
              </span>
            </p>
          </div>
        </div>

        {/* Timeline Info */}
        <div className="space-y-2 text-sm">
          {workflow.lastRun && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Last run {formatRelativeTime(workflow.lastRun)}
            </div>
          )}
          {workflow.nextRun && workflow.status === "active" && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Next run {formatRelativeTime(workflow.nextRun)}
            </div>
          )}
        </div>

        {/* Creator Info */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={workflow.createdBy.avatar} />
              <AvatarFallback className="text-xs">
                {workflow.createdBy.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              by {workflow.createdBy.name}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}