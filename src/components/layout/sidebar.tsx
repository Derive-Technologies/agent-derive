import React from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { 
  LayoutDashboard,
  Workflow,
  Clock,
  CheckSquare,
  BarChart3,
  Users,
  Settings,
  Zap,
  FileText,
  HelpCircle,
  ChevronLeft,
  Plus,
  FolderOpen
} from "lucide-react"
import { cn } from "../../lib/utils"

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  badge?: {
    text: string
    variant?: "default" | "secondary" | "success" | "warning" | "destructive"
  }
  isActive?: boolean
  children?: NavigationItem[]
}

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  navigationItems?: NavigationItem[]
  onNavigate?: (item: NavigationItem) => void
  className?: string
  showFooter?: boolean
}

const defaultNavigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    isActive: true
  },
  {
    id: "workflows",
    label: "Workflows",
    icon: Workflow,
    href: "/dashboard/workflows",
    badge: { text: "5", variant: "secondary" }
  },
  {
    id: "ai-agents",
    label: "AI Agents",
    icon: Zap,
    href: "/dashboard/ai-agents"
  },
  {
    id: "approvals",
    label: "Approvals", 
    icon: CheckSquare,
    href: "/dashboard/approvals",
    badge: { text: "2", variant: "warning" }
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics"
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings"
  }
]

function NavigationLink({ 
  item, 
  isCollapsed, 
  onNavigate, 
  level = 0 
}: { 
  item: NavigationItem
  isCollapsed: boolean
  onNavigate?: (item: NavigationItem) => void
  level?: number
}) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const Icon = item.icon
  const hasChildren = item.children && item.children.length > 0

  const handleClick = () => {
    if (hasChildren && !isCollapsed) {
      setIsExpanded(!isExpanded)
    } else {
      onNavigate?.(item)
    }
  }

  return (
    <div>
      <Button
        variant={item.isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start h-10",
          level > 0 && "ml-4 w-[calc(100%-1rem)]",
          isCollapsed && "justify-center"
        )}
        onClick={handleClick}
      >
        <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge 
                variant={item.badge.variant} 
                className="text-xs ml-auto"
              >
                {item.badge.text}
              </Badge>
            )}
          </>
        )}
      </Button>

      {/* Children */}
      {hasChildren && !isCollapsed && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavigationLink
              key={child.id}
              item={child}
              isCollapsed={isCollapsed}
              onNavigate={onNavigate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  navigationItems = defaultNavigationItems,
  onNavigate,
  className,
  showFooter = true
}: SidebarProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [internalCollapsed, setInternalCollapsed] = React.useState(true)
  
  // Use controlled state if provided, otherwise use internal state
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed
  const handleToggleCollapse = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed))
  
  // Expand on hover if collapsed
  const effectiveCollapsed = isCollapsed && !isHovered
  
  return (
    <div 
      className={cn(
        "flex flex-col border-r bg-muted/10 transition-all duration-300",
        effectiveCollapsed ? "w-16" : "w-64",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleCollapse}
            className={cn(
              "h-8 w-8",
              effectiveCollapsed && "mx-auto"
            )}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180"
            )} />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {/* Quick action */}
          <Button 
            className={cn(
              "w-full",
              effectiveCollapsed ? "justify-center px-2" : "justify-start"
            )}
            onClick={() => onNavigate?.({ id: "create", label: "Create Workflow", icon: Plus })}
          >
            <Plus className={cn("h-4 w-4", !effectiveCollapsed && "mr-2")} />
            {!effectiveCollapsed && "Create Workflow"}
          </Button>

          <div className="border-t my-4" />

          {/* Navigation items */}
          {navigationItems.map((item) => (
            <NavigationLink
              key={item.id}
              item={item}
              isCollapsed={effectiveCollapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      {showFooter && (
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={cn(
              "w-full",
              effectiveCollapsed ? "justify-center" : "justify-start"
            )}
            onClick={() => onNavigate?.({ id: "help", label: "Help & Support", icon: HelpCircle })}
          >
            <HelpCircle className={cn("h-4 w-4", !effectiveCollapsed && "mr-2")} />
            {!effectiveCollapsed && "Help & Support"}
          </Button>

          {!effectiveCollapsed && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-2">
                Need help?
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs">
                View Documentation
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Hook for managing sidebar state
export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  
  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  // Auto-collapse on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Check on mount

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return {
    isCollapsed,
    toggleCollapse,
    setIsCollapsed
  }
}