import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { 
  Check,
  X,
  Clock,
  AlertTriangle,
  ExternalLink,
  User,
  Calendar
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
}

interface RecentApprovalsProps {
  approvals: ApprovalRequest[]
  onApprove?: (approvalId: string) => void
  onReject?: (approvalId: string) => void
  onViewDetails?: (approvalId: string) => void
  onViewWorkflow?: (workflowId: string) => void
  className?: string
  showActions?: boolean
  maxHeight?: string
  limit?: number
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

function ApprovalItem({ 
  approval, 
  onApprove, 
  onReject, 
  onViewDetails, 
  onViewWorkflow,
  showActions = true 
}: { 
  approval: ApprovalRequest
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onViewDetails?: (id: string) => void
  onViewWorkflow?: (id: string) => void
  showActions?: boolean
}) {
  const priorityInfo = priorityConfig[approval.priority]
  const statusInfo = statusConfig[approval.status]
  const StatusIcon = statusInfo.icon
  
  const isPending = approval.status === "pending"
  const isUrgent = approval.priority === "urgent"

  return (
    <div className={cn(
      "p-4 border rounded-lg space-y-3 transition-colors",
      isUrgent && isPending && "border-red-200 bg-red-50/50",
      "hover:shadow-sm"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-sm truncate">{approval.title}</h4>
            {isUrgent && (
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
            )}
          </div>
          <button
            onClick={() => onViewWorkflow?.(approval.workflowId)}
            className="text-sm text-muted-foreground hover:text-primary truncate"
          >
            in {approval.workflowName}
          </button>
        </div>
        <div className="flex flex-col items-end space-y-1 ml-4">
          <Badge 
            variant={statusInfo.variant}
            className="inline-flex items-center gap-1 text-xs"
          >
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
          <Badge variant={priorityInfo.variant} className="text-xs">
            {priorityInfo.label}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-gray-700 line-clamp-2">
        {approval.description}
      </p>

      {/* Request info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Avatar className="h-4 w-4">
            <AvatarImage src={approval.requestedBy.avatar} />
            <AvatarFallback className="text-xs">
              {approval.requestedBy.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <span>by {approval.requestedBy.name}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>{formatRelativeTime(approval.requestedAt)}</span>
        </div>
      </div>

      {/* Approval/Rejection info */}
      {approval.status !== "pending" && (
        <div className="bg-gray-50 rounded p-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-4 w-4">
                <AvatarImage src={approval.approvedBy?.avatar} />
                <AvatarFallback className="text-xs">
                  {approval.approvedBy?.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span>
                {approval.status === "approved" ? "Approved" : "Rejected"} by{" "}
                <span className="font-medium">{approval.approvedBy?.name}</span>
              </span>
            </div>
            <span className="text-muted-foreground">
              {approval.approvedAt && formatRelativeTime(approval.approvedAt)}
            </span>
          </div>
          {approval.rejectionReason && (
            <p className="mt-1 text-gray-600">
              Reason: {approval.rejectionReason}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails?.(approval.id)}
            className="text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Details
          </Button>

          {isPending && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject?.(approval.id)}
                className="text-xs text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <X className="h-3 w-3 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => onApprove?.(approval.id)}
                className="text-xs bg-green-600 hover:bg-green-700"
              >
                <Check className="h-3 w-3 mr-1" />
                Approve
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function RecentApprovals({
  approvals,
  onApprove,
  onReject,
  onViewDetails,
  onViewWorkflow,
  className,
  showActions = true,
  maxHeight = "600px",
  limit
}: RecentApprovalsProps) {
  const safeApprovals = approvals || []
  const displayedApprovals = limit ? safeApprovals.slice(0, limit) : safeApprovals
  const pendingCount = safeApprovals.filter(a => a.status === "pending").length
  const urgentCount = safeApprovals.filter(a => a.priority === "urgent" && a.status === "pending").length

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Approvals</CardTitle>
          <div className="flex items-center space-x-2">
            {urgentCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {urgentCount} Urgent
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {pendingCount} Pending
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {displayedApprovals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mb-2" />
            <p className="text-sm">No approval requests</p>
          </div>
        ) : (
          <ScrollArea style={{ height: maxHeight }}>
            <div className="p-4 space-y-3">
              {displayedApprovals.map((approval) => (
                <ApprovalItem
                  key={approval.id}
                  approval={approval}
                  onApprove={onApprove}
                  onReject={onReject}
                  onViewDetails={onViewDetails}
                  onViewWorkflow={onViewWorkflow}
                  showActions={showActions}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}