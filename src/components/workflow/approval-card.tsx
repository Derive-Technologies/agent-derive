import React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { 
  Check, 
  X, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  MessageCircle
} from "lucide-react"
import { cn, formatRelativeTime } from "../../lib/utils"

interface ApprovalRequest {
  id: string
  workflowName: string
  workflowId: string
  title: string
  description: string
  status: "pending" | "approved" | "rejected"
  priority: "low" | "medium" | "high" | "urgent"
  requestedBy: {
    name: string
    email: string
    avatar?: string
  }
  requestedAt: Date
  approvedBy?: {
    name: string
    avatar?: string
  }
  approvedAt?: Date
  rejectionReason?: string
  executionData?: Record<string, any>
  estimatedImpact?: string
}

interface ApprovalCardProps {
  approval: ApprovalRequest
  onApprove?: (approvalId: string) => void
  onReject?: (approvalId: string, reason?: string) => void
  onViewDetails?: (approvalId: string) => void
  className?: string
  showActions?: boolean
}

const priorityConfig = {
  low: {
    label: "Low",
    variant: "secondary" as const,
    color: "text-gray-600"
  },
  medium: {
    label: "Medium",
    variant: "outline" as const,
    color: "text-blue-600"
  },
  high: {
    label: "High",
    variant: "warning" as const,
    color: "text-orange-600"
  },
  urgent: {
    label: "Urgent",
    variant: "destructive" as const,
    color: "text-red-600"
  }
}

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "pending" as const,
    icon: Clock,
    color: "text-orange-500"
  },
  approved: {
    label: "Approved",
    variant: "success" as const,
    icon: Check,
    color: "text-green-600"
  },
  rejected: {
    label: "Rejected",
    variant: "destructive" as const,
    icon: X,
    color: "text-red-600"
  }
}

export function ApprovalCard({
  approval,
  onApprove,
  onReject,
  onViewDetails,
  className,
  showActions = true
}: ApprovalCardProps) {
  const priorityInfo = priorityConfig[approval.priority]
  const statusInfo = statusConfig[approval.status]
  const StatusIcon = statusInfo.icon

  const isPending = approval.status === "pending"
  const isUrgent = approval.priority === "urgent"

  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow",
      isUrgent && isPending && "ring-2 ring-red-200 border-red-200",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{approval.title}</h3>
              {isUrgent && (
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              in <span className="font-medium">{approval.workflowName}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 ml-4">
            <Badge 
              variant={statusInfo.variant}
              className="inline-flex items-center gap-1"
            >
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </Badge>
            <Badge variant={priorityInfo.variant} className="text-xs">
              {priorityInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700 line-clamp-3">
          {approval.description}
        </p>

        {approval.estimatedImpact && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Estimated Impact
            </h4>
            <p className="text-sm text-blue-700">
              {approval.estimatedImpact}
            </p>
          </div>
        )}

        {/* Request Info */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={approval.requestedBy.avatar} />
              <AvatarFallback className="text-xs">
                {approval.requestedBy.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              by {approval.requestedBy.name}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(approval.requestedAt)}
          </span>
        </div>

        {/* Approval/Rejection Info */}
        {approval.status !== "pending" && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={approval.approvedBy?.avatar} />
                  <AvatarFallback className="text-xs">
                    {approval.approvedBy?.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {approval.status === "approved" ? "Approved" : "Rejected"} by{" "}
                  <span className="font-medium">{approval.approvedBy?.name}</span>
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {approval.approvedAt && formatRelativeTime(approval.approvedAt)}
              </span>
            </div>
            {approval.rejectionReason && (
              <p className="text-sm text-gray-600 mt-2 pl-8">
                Reason: {approval.rejectionReason}
              </p>
            )}
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="flex justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails?.(approval.id)}
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Details
          </Button>

          {isPending && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject?.(approval.id)}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <X className="h-3 w-3 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => onApprove?.(approval.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-3 w-3 mr-1" />
                Approve
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}