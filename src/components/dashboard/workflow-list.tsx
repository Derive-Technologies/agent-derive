import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table"
import { 
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Calendar,
  User
} from "lucide-react"
import { cn, formatRelativeTime } from "../../lib/utils"

interface Workflow {
  id: string
  name: string
  description?: string
  status: "draft" | "active" | "paused" | "archived"
  lastRun?: Date
  nextRun?: Date
  executionCount: number
  successRate: number
  createdBy: {
    name: string
    avatar?: string
  }
  createdAt: Date
  updatedAt: Date
}

interface WorkflowListProps {
  workflows: Workflow[]
  onWorkflowClick?: (workflowId: string) => void
  onEdit?: (workflowId: string) => void
  onDuplicate?: (workflowId: string) => void
  onDelete?: (workflowId: string) => void
  onToggleStatus?: (workflowId: string, newStatus: "active" | "paused") => void
  className?: string
  showSearch?: boolean
  showFilters?: boolean
  compact?: boolean
}

const statusConfig = {
  draft: {
    label: "Draft",
    variant: "outline" as const,
    color: "text-gray-500"
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

export function WorkflowList({
  workflows,
  onWorkflowClick,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  className,
  showSearch = true,
  showFilters = true,
  compact = false
}: WorkflowListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"name" | "updated" | "executions" | "successRate">("updated")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Filter and sort workflows
  const filteredWorkflows = (workflows || [])
    .filter(workflow => {
      const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || workflow.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "updated":
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          break
        case "executions":
          comparison = b.executionCount - a.executionCount
          break
        case "successRate":
          comparison = b.successRate - a.successRate
          break
      }
      return sortOrder === "desc" ? comparison : -comparison
    })

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const SortButton = ({ field, children }: { field: typeof sortBy, children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 hover:text-foreground font-medium"
    >
      <span>{children}</span>
      {sortBy === field && (
        sortOrder === "desc" ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />
      )}
    </button>
  )

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Workflows</CardTitle>
            <Badge variant="secondary">{workflows.length}</Badge>
          </div>
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredWorkflows.slice(0, 5).map((workflow) => (
              <div
                key={workflow.id}
                onClick={() => onWorkflowClick?.(workflow.id)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-sm truncate">{workflow.name}</h4>
                    <Badge variant={statusConfig[workflow.status].variant} className="text-xs">
                      {statusConfig[workflow.status].label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {workflow.executionCount} executions • {workflow.successRate}% success
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Workflows</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{filteredWorkflows.length} of {workflows.length}</Badge>
          </div>
        </div>

        {(showSearch || showFilters) && (
          <div className="flex items-center space-x-2">
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {showFilters && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter === "all" ? "All Status" : statusConfig[statusFilter as keyof typeof statusConfig]?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                      {config.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="name">Workflow</SortButton>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <SortButton field="executions">Executions</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="successRate">Success Rate</SortButton>
              </TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>
                <SortButton field="updated">Updated</SortButton>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkflows.map((workflow) => (
              <TableRow 
                key={workflow.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onWorkflowClick?.(workflow.id)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{workflow.name}</div>
                    {workflow.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {workflow.description}
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={workflow.createdBy.avatar} />
                        <AvatarFallback className="text-xs">
                          {workflow.createdBy.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {workflow.createdBy.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusConfig[workflow.status].variant}>
                    {statusConfig[workflow.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{workflow.executionCount.toLocaleString()}</div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "font-medium",
                    workflow.successRate >= 90 ? "text-green-600" :
                    workflow.successRate >= 70 ? "text-orange-600" : "text-red-600"
                  )}>
                    {workflow.successRate}%
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {workflow.lastRun ? formatRelativeTime(workflow.lastRun) : "Never"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatRelativeTime(workflow.updatedAt)}</div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
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
                      <DropdownMenuSeparator />
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredWorkflows.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No workflows found</p>
            {searchTerm || statusFilter !== "all" ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Clear filters
              </Button>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}