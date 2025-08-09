import React from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Separator } from "@radix-ui/react-separator"
import { 
  MoreHorizontal,
  ArrowLeft,
  Share,
  Bookmark,
  Star,
  Download,
  RefreshCw
} from "lucide-react"
import { cn } from "../../lib/utils"

interface PageAction {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: () => void
  variant?: "default" | "outline" | "ghost" | "destructive"
  disabled?: boolean
}

interface PageHeaderProps {
  title: string
  description?: string
  badge?: {
    text: string
    variant?: "default" | "secondary" | "success" | "warning" | "destructive"
  }
  actions?: PageAction[]
  onBack?: () => void
  backLabel?: string
  children?: React.ReactNode
  className?: string
  showDivider?: boolean
}

export function PageHeader({
  title,
  description,
  badge,
  actions = [],
  onBack,
  backLabel,
  children,
  className,
  showDivider = true
}: PageHeaderProps) {
  const primaryActions = actions.filter(action => 
    action.variant === "default" || action.variant === undefined
  )
  const secondaryActions = actions.filter(action => 
    action.variant && action.variant !== "default"
  )

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1 min-w-0">
          {/* Back button */}
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel || "Back"}
            </Button>
          )}

          {/* Title and badge */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {title}
            </h1>
            {badge && (
              <Badge variant={badge.variant}>
                {badge.text}
              </Badge>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}

          {/* Custom children */}
          {children}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex items-center space-x-2 ml-4">
            {/* Primary actions */}
            {primaryActions.slice(0, 2).map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="flex items-center gap-2"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {action.label}
                </Button>
              )
            })}

            {/* Secondary actions */}
            {secondaryActions.slice(0, 2).map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant={action.variant}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="flex items-center gap-2"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {action.label}
                </Button>
              )
            })}

            {/* More actions menu if needed */}
            {actions.length > 4 && (
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {showDivider && <Separator className="bg-border h-px" />}
    </div>
  )
}

// Preset page headers for common pages
export function DashboardPageHeader({ 
  onRefresh,
  onExport,
  lastUpdated,
  className 
}: {
  onRefresh?: () => void
  onExport?: () => void
  lastUpdated?: Date
  className?: string
}) {
  const actions: PageAction[] = []

  if (onRefresh) {
    actions.push({
      id: "refresh",
      label: "Refresh",
      icon: RefreshCw,
      onClick: onRefresh,
      variant: "outline"
    })
  }

  if (onExport) {
    actions.push({
      id: "export",
      label: "Export",
      icon: Download,
      onClick: onExport,
      variant: "outline"
    })
  }

  return (
    <PageHeader
      title="Dashboard"
      description="Overview of your workflows, executions, and approvals"
      actions={actions}
      className={className}
    >
      {lastUpdated && (
        <p className="text-sm text-muted-foreground">
          Last updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </PageHeader>
  )
}

export function WorkflowPageHeader({ 
  workflowName,
  workflowStatus,
  onEdit,
  onShare,
  onSave,
  onBack,
  hasUnsavedChanges = false,
  className
}: {
  workflowName: string
  workflowStatus?: "draft" | "active" | "paused" | "archived"
  onEdit?: () => void
  onShare?: () => void
  onSave?: () => void
  onBack?: () => void
  hasUnsavedChanges?: boolean
  className?: string
}) {
  const statusConfig = {
    draft: { text: "Draft", variant: "outline" as const },
    active: { text: "Active", variant: "success" as const },
    paused: { text: "Paused", variant: "warning" as const },
    archived: { text: "Archived", variant: "secondary" as const }
  }

  const actions: PageAction[] = []

  if (onSave) {
    actions.push({
      id: "save",
      label: hasUnsavedChanges ? "Save Changes" : "Save",
      onClick: onSave,
      disabled: !hasUnsavedChanges
    })
  }

  if (onEdit) {
    actions.push({
      id: "edit", 
      label: "Edit",
      onClick: onEdit,
      variant: "outline"
    })
  }

  if (onShare) {
    actions.push({
      id: "share",
      label: "Share",
      icon: Share,
      onClick: onShare,
      variant: "outline"
    })
  }

  return (
    <PageHeader
      title={workflowName}
      badge={workflowStatus ? statusConfig[workflowStatus] : undefined}
      actions={actions}
      onBack={onBack}
      backLabel="Back to workflows"
      className={className}
    >
      {hasUnsavedChanges && (
        <div className="flex items-center space-x-2 text-sm text-amber-600">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span>You have unsaved changes</span>
        </div>
      )}
    </PageHeader>
  )
}

export function AnalyticsPageHeader({ 
  dateRange,
  onDateRangeChange,
  onExport,
  className
}: {
  dateRange?: string
  onDateRangeChange?: (range: string) => void
  onExport?: () => void
  className?: string
}) {
  const actions: PageAction[] = []

  if (onExport) {
    actions.push({
      id: "export",
      label: "Export Report",
      icon: Download,
      onClick: onExport,
      variant: "outline"
    })
  }

  return (
    <PageHeader
      title="Analytics"
      description="Performance metrics and insights for your workflows"
      actions={actions}
      className={className}
    >
      {dateRange && (
        <Badge variant="secondary" className="w-fit">
          {dateRange}
        </Badge>
      )}
    </PageHeader>
  )
}