import React from "react"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "../ui/dropdown-menu"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "../ui/command"
import { 
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Plus,
  Workflow,
  Zap,
  HelpCircle,
  Moon,
  Sun,
  Monitor
} from "lucide-react"
import { cn } from "../../lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: Date
}

interface UserProfile {
  name: string
  email: string
  avatar?: string
  role?: string
  tenant?: string
}

interface HeaderProps {
  user: UserProfile
  notifications?: Notification[]
  onUserMenuAction?: (action: "profile" | "settings" | "logout") => void
  onNotificationClick?: (notification: Notification) => void
  onCreateWorkflow?: () => void
  onSearch?: (query: string) => void
  showSearch?: boolean
  showNotifications?: boolean
  showCreateButton?: boolean
  className?: string
  theme?: "light" | "dark" | "system"
  onThemeChange?: (theme: "light" | "dark" | "system") => void
}

export function Header({
  user,
  notifications = [],
  onUserMenuAction,
  onNotificationClick,
  onCreateWorkflow,
  onSearch,
  showSearch = true,
  showNotifications = true,
  showCreateButton = true,
  className,
  theme = "system",
  onThemeChange
}: HeaderProps) {
  const [isCommandOpen, setIsCommandOpen] = React.useState(false)
  
  const unreadNotifications = notifications.filter(n => !n.read)
  
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCommandOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return Sun
      case "dark":
        return Moon
      default:
        return Monitor
    }
  }

  const ThemeIcon = getThemeIcon()

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}>
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Left side - Logo and search */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Workflow className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Agent Derive</span>
            </div>

            {showSearch && (
              <Button
                variant="outline"
                className="relative w-64 justify-start text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsCommandOpen(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                Search workflows...
                <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            )}
          </div>

          {/* Right side - Actions and user menu */}
          <div className="flex items-center space-x-2">
            {/* Create workflow button */}
            {showCreateButton && (
              <Button onClick={onCreateWorkflow} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Button>
            )}

            {/* Notifications */}
            {showNotifications && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadNotifications.length > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadNotifications.length > 9 ? "9+" : unreadNotifications.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          onClick={() => onNotificationClick?.(notification)}
                          className="flex flex-col items-start p-3 cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium text-sm">{notification.title}</span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground mt-1">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Theme toggle */}
            {onThemeChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ThemeIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onThemeChange("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onThemeChange("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onThemeChange("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                    <AvatarFallback>
                      {user?.name ? user.name.split(" ").map(n => n[0]).join("") : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'No email'}
                    </p>
                    {user?.role && (
                      <Badge variant="secondary" className="text-xs w-fit mt-1">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onUserMenuAction?.("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUserMenuAction?.("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onUserMenuAction?.("logout")}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Command palette */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={onCreateWorkflow}>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </CommandItem>
            <CommandItem>
              <Workflow className="mr-2 h-4 w-4" />
              Browse Templates
            </CommandItem>
            <CommandItem>
              <Zap className="mr-2 h-4 w-4" />
              View Integrations
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Navigation">
            <CommandItem>
              <Workflow className="mr-2 h-4 w-4" />
              Workflows
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}