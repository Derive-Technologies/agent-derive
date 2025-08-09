import React from "react"
import { Button } from "../ui/button"
import { 
  ChevronRight,
  Home,
  MoreHorizontal
} from "lucide-react"
import { cn } from "../../lib/utils"

interface BreadcrumbItem {
  id: string
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ComponentType<{ className?: string }>
  isActive?: boolean
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  separator?: React.ComponentType<{ className?: string }>
  onNavigate?: (item: BreadcrumbItem) => void
  className?: string
  showHome?: boolean
  maxItems?: number
}

export function BreadcrumbNav({
  items,
  separator: Separator = ChevronRight,
  onNavigate,
  className,
  showHome = true,
  maxItems = 5
}: BreadcrumbNavProps) {
  // Add home item if requested
  const allItems = showHome 
    ? [
        {
          id: "home",
          label: "Home",
          icon: Home,
          onClick: () => onNavigate?.({ id: "home", label: "Home" })
        },
        ...items
      ]
    : items

  // Handle overflow with ellipsis
  const displayItems = allItems.length > maxItems 
    ? [
        allItems[0], // Always show first item
        {
          id: "ellipsis",
          label: "...",
          icon: MoreHorizontal
        },
        ...allItems.slice(-2) // Show last 2 items
      ]
    : allItems

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.id === "ellipsis") return
    
    if (item.onClick) {
      item.onClick()
    } else {
      onNavigate?.(item)
    }
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1", className)}>
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          const Icon = item.icon

          return (
            <li key={item.id} className="flex items-center">
              {/* Breadcrumb item */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleItemClick(item)}
                disabled={item.id === "ellipsis" || (isLast && item.isActive)}
                className={cn(
                  "h-8 px-2 text-sm font-normal",
                  (isLast && item.isActive) && "text-foreground font-medium",
                  !isLast && "text-muted-foreground hover:text-foreground",
                  item.id === "ellipsis" && "cursor-default hover:bg-transparent"
                )}
              >
                {Icon && (
                  <Icon className={cn(
                    "h-4 w-4",
                    item.label !== "..." && "mr-2"
                  )} />
                )}
                {item.id !== "ellipsis" && (
                  <span className="truncate max-w-32">
                    {item.label}
                  </span>
                )}
              </Button>

              {/* Separator */}
              {!isLast && (
                <Separator className="h-4 w-4 mx-1 text-muted-foreground" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Preset breadcrumb configurations for common page hierarchies
export function DashboardBreadcrumb({ 
  onNavigate, 
  className 
}: { 
  onNavigate?: (item: BreadcrumbItem) => void
  className?: string 
}) {
  const items: BreadcrumbItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      isActive: true
    }
  ]

  return (
    <BreadcrumbNav
      items={items}
      onNavigate={onNavigate}
      className={className}
    />
  )
}

export function WorkflowBreadcrumb({ 
  workflowName,
  onNavigate,
  className 
}: { 
  workflowName: string
  onNavigate?: (item: BreadcrumbItem) => void
  className?: string 
}) {
  const items: BreadcrumbItem[] = [
    {
      id: "workflows",
      label: "Workflows",
      onClick: () => onNavigate?.({ id: "workflows", label: "Workflows" })
    },
    {
      id: "workflow",
      label: workflowName,
      isActive: true
    }
  ]

  return (
    <BreadcrumbNav
      items={items}
      onNavigate={onNavigate}
      className={className}
    />
  )
}

export function WorkflowEditorBreadcrumb({ 
  workflowName,
  onNavigate,
  className 
}: { 
  workflowName: string
  onNavigate?: (item: BreadcrumbItem) => void
  className?: string 
}) {
  const items: BreadcrumbItem[] = [
    {
      id: "workflows",
      label: "Workflows",
      onClick: () => onNavigate?.({ id: "workflows", label: "Workflows" })
    },
    {
      id: "workflow",
      label: workflowName,
      onClick: () => onNavigate?.({ id: "workflow", label: workflowName })
    },
    {
      id: "editor",
      label: "Editor",
      isActive: true
    }
  ]

  return (
    <BreadcrumbNav
      items={items}
      onNavigate={onNavigate}
      className={className}
    />
  )
}

export function ExecutionBreadcrumb({ 
  workflowName,
  executionId,
  onNavigate,
  className 
}: { 
  workflowName: string
  executionId: string
  onNavigate?: (item: BreadcrumbItem) => void
  className?: string 
}) {
  const items: BreadcrumbItem[] = [
    {
      id: "executions",
      label: "Executions",
      onClick: () => onNavigate?.({ id: "executions", label: "Executions" })
    },
    {
      id: "workflow",
      label: workflowName,
      onClick: () => onNavigate?.({ id: "workflow", label: workflowName })
    },
    {
      id: "execution",
      label: `#${executionId.slice(-8)}`,
      isActive: true
    }
  ]

  return (
    <BreadcrumbNav
      items={items}
      onNavigate={onNavigate}
      className={className}
    />
  )
}

export function SettingsBreadcrumb({ 
  section,
  onNavigate,
  className 
}: { 
  section?: string
  onNavigate?: (item: BreadcrumbItem) => void
  className?: string 
}) {
  const items: BreadcrumbItem[] = [
    {
      id: "settings",
      label: "Settings",
      onClick: section ? () => onNavigate?.({ id: "settings", label: "Settings" }) : undefined,
      isActive: !section
    }
  ]

  if (section) {
    items.push({
      id: "section",
      label: section,
      isActive: true
    })
  }

  return (
    <BreadcrumbNav
      items={items}
      onNavigate={onNavigate}
      className={className}
    />
  )
}