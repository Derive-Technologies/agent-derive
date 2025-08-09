import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { 
  Plus,
  Play,
  FileText,
  Upload,
  Settings,
  Users,
  BarChart3,
  Zap,
  Clock,
  BookOpen,
  HelpCircle
} from "lucide-react"
import { cn } from "../../lib/utils"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  variant?: "default" | "primary" | "secondary"
  badge?: {
    text: string
    variant: "default" | "secondary" | "success" | "warning" | "destructive"
  }
  shortcut?: string
}

interface QuickActionsProps {
  actions?: QuickAction[]
  onCreateWorkflow?: () => void
  onRunWorkflow?: () => void
  onViewTemplates?: () => void
  onImportWorkflow?: () => void
  onViewAnalytics?: () => void
  onManageTeam?: () => void
  onViewSettings?: () => void
  onViewDocs?: () => void
  className?: string
}

const defaultActions: QuickAction[] = [
  {
    id: "create-workflow",
    title: "Create Workflow",
    description: "Build a new workflow from scratch",
    icon: Plus,
    onClick: () => {},
    variant: "primary"
  },
  {
    id: "run-workflow",
    title: "Run Workflow",
    description: "Execute an existing workflow",
    icon: Play,
    onClick: () => {},
    badge: { text: "Quick", variant: "success" }
  },
  {
    id: "browse-templates",
    title: "Browse Templates",
    description: "Start from pre-built templates",
    icon: FileText,
    onClick: () => {},
    badge: { text: "Popular", variant: "secondary" }
  },
  {
    id: "import-workflow",
    title: "Import Workflow",
    description: "Upload workflow from file",
    icon: Upload,
    onClick: () => {}
  },
  {
    id: "view-analytics",
    title: "View Analytics",
    description: "Check performance metrics",
    icon: BarChart3,
    onClick: () => {},
    shortcut: "⌘A"
  },
  {
    id: "manage-team",
    title: "Manage Team",
    description: "Add users and set permissions",
    icon: Users,
    onClick: () => {}
  }
]

const additionalActions: QuickAction[] = [
  {
    id: "scheduled-workflows",
    title: "Scheduled Workflows",
    description: "Manage automated schedules",
    icon: Clock,
    onClick: () => {},
    badge: { text: "5 Active", variant: "default" }
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect external services",
    icon: Zap,
    onClick: () => {}
  },
  {
    id: "documentation",
    title: "Documentation",
    description: "Learn how to use the platform",
    icon: BookOpen,
    onClick: () => {}
  },
  {
    id: "settings",
    title: "Settings",
    description: "Configure your workspace",
    icon: Settings,
    onClick: () => {},
    shortcut: "⌘,"
  }
]

export function QuickActions({
  actions,
  onCreateWorkflow,
  onRunWorkflow,
  onViewTemplates,
  onImportWorkflow,
  onViewAnalytics,
  onManageTeam,
  onViewSettings,
  onViewDocs,
  className
}: QuickActionsProps) {
  // Use custom actions if provided, otherwise use defaults
  const actionsList = actions || defaultActions.map(action => ({
    ...action,
    onClick: () => {
      switch (action.id) {
        case "create-workflow":
          onCreateWorkflow?.()
          break
        case "run-workflow":
          onRunWorkflow?.()
          break
        case "browse-templates":
          onViewTemplates?.()
          break
        case "import-workflow":
          onImportWorkflow?.()
          break
        case "view-analytics":
          onViewAnalytics?.()
          break
        case "manage-team":
          onManageTeam?.()
          break
        default:
          break
      }
    }
  }))

  const getButtonVariant = (variant?: string) => {
    switch (variant) {
      case "primary":
        return "default"
      case "secondary":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actionsList.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant={getButtonVariant(action.variant)}
                onClick={action.onClick}
                className={cn(
                  "h-auto p-4 justify-start text-left",
                  action.variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <div className="flex items-start space-x-3 w-full">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">
                        {action.title}
                      </h3>
                      {action.badge && (
                        <Badge 
                          variant={action.badge.variant} 
                          className="ml-2 text-xs"
                        >
                          {action.badge.text}
                        </Badge>
                      )}
                      {action.shortcut && (
                        <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-muted rounded border">
                          {action.shortcut}
                        </kbd>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>

        {/* Additional actions in a separate section */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">More Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {additionalActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    switch (action.id) {
                      case "documentation":
                        onViewDocs?.()
                        break
                      case "settings":
                        onViewSettings?.()
                        break
                      default:
                        action.onClick()
                        break
                    }
                  }}
                  className="justify-start h-auto py-2"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="text-xs">{action.title}</span>
                  {action.badge && (
                    <Badge 
                      variant={action.badge.variant} 
                      className="ml-auto text-xs"
                    >
                      {action.badge.text}
                    </Badge>
                  )}
                  {action.shortcut && (
                    <kbd className="ml-auto px-1 py-0.5 text-xs bg-muted rounded border">
                      {action.shortcut}
                    </kbd>
                  )}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Help section */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Need help getting started?
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onViewDocs}>
              View Guide
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}