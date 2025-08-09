import React from "react"
import { Button } from "../ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Badge } from "../ui/badge"
import { 
  Play,
  Pause,
  Save,
  MoreVertical,
  Download,
  Upload,
  Copy,
  Trash2,
  History,
  Settings,
  Share2,
  TestTube,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid
} from "lucide-react"
import { cn } from "../../lib/utils"

interface WorkflowToolbarProps {
  workflowStatus: "draft" | "active" | "paused"
  hasUnsavedChanges?: boolean
  canUndo?: boolean
  canRedo?: boolean
  onSave?: () => void
  onTest?: () => void
  onPublish?: () => void
  onPause?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFitView?: () => void
  onToggleGrid?: () => void
  onExport?: () => void
  onImport?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  onShare?: () => void
  onViewHistory?: () => void
  onSettings?: () => void
  className?: string
  showGridToggle?: boolean
  isGridVisible?: boolean
}

export function WorkflowToolbar({
  workflowStatus,
  hasUnsavedChanges = false,
  canUndo = false,
  canRedo = false,
  onSave,
  onTest,
  onPublish,
  onPause,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleGrid,
  onExport,
  onImport,
  onDuplicate,
  onDelete,
  onShare,
  onViewHistory,
  onSettings,
  className,
  showGridToggle = true,
  isGridVisible = false
}: WorkflowToolbarProps) {
  const statusConfig = {
    draft: { label: "Draft", variant: "outline" as const },
    active: { label: "Active", variant: "success" as const },
    paused: { label: "Paused", variant: "warning" as const }
  }

  const status = statusConfig[workflowStatus]

  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-white border-b border-gray-200",
      className
    )}>
      {/* Left side - Main actions */}
      <div className="flex items-center space-x-2">
        {/* Save button */}
        <Button 
          onClick={onSave}
          disabled={!hasUnsavedChanges}
          variant={hasUnsavedChanges ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save
          {hasUnsavedChanges && (
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          )}
        </Button>

        {/* Test button */}
        <Button onClick={onTest} variant="outline" size="sm">
          <TestTube className="h-4 w-4 mr-2" />
          Test
        </Button>

        {/* Publish/Pause button */}
        {workflowStatus === "draft" ? (
          <Button onClick={onPublish} size="sm">
            <Play className="h-4 w-4 mr-2" />
            Publish
          </Button>
        ) : workflowStatus === "active" ? (
          <Button onClick={onPause} variant="warning" size="sm">
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
        ) : (
          <Button onClick={onPublish} size="sm">
            <Play className="h-4 w-4 mr-2" />
            Activate
          </Button>
        )}

        <div className="h-6 w-px bg-gray-300" />

        {/* Undo/Redo */}
        <Button 
          onClick={onUndo}
          disabled={!canUndo}
          variant="ghost" 
          size="sm"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button 
          onClick={onRedo}
          disabled={!canRedo}
          variant="ghost" 
          size="sm"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-gray-300" />

        {/* Zoom controls */}
        <Button onClick={onZoomOut} variant="ghost" size="sm">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button onClick={onZoomIn} variant="ghost" size="sm">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button onClick={onFitView} variant="ghost" size="sm">
          <Maximize className="h-4 w-4" />
        </Button>

        {/* Grid toggle */}
        {showGridToggle && (
          <Button 
            onClick={onToggleGrid}
            variant={isGridVisible ? "secondary" : "ghost"}
            size="sm"
          >
            <Grid className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Right side - Status and menu */}
      <div className="flex items-center space-x-3">
        {/* Status badge */}
        <Badge variant={status.variant}>
          {status.label}
        </Badge>

        {/* More actions menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onShare && (
              <DropdownMenuItem onClick={onShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            )}
            
            {onViewHistory && (
              <DropdownMenuItem onClick={onViewHistory}>
                <History className="mr-2 h-4 w-4" />
                Version History
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {onExport && (
              <DropdownMenuItem onClick={onExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
            )}
            
            {onImport && (
              <DropdownMenuItem onClick={onImport}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </DropdownMenuItem>
            )}
            
            {onDuplicate && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
              </>
            )}
            
            {onSettings && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </>
            )}
            
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}