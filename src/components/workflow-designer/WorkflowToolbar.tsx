import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Save,
  Play,
  RotateCcw,
  Maximize,
  Download,
  Upload,
  Grid3X3,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { toast } from 'sonner';

export interface WorkflowToolbarProps {
  onSave?: () => void;
  onExecute?: () => void;
  onReset?: () => void;
  onFitView?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onToggleGrid?: () => void;
  isSaving?: boolean;
  isExecuting?: boolean;
  canExecute?: boolean;
  readOnly?: boolean;
  showGrid?: boolean;
}

export const WorkflowToolbar: React.FC<WorkflowToolbarProps> = ({
  onSave,
  onExecute,
  onReset,
  onFitView,
  onZoomIn,
  onZoomOut,
  onExport,
  onImport,
  onToggleGrid,
  isSaving = false,
  isExecuting = false,
  canExecute = false,
  readOnly = false,
  showGrid = true,
}) => {
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      toast.info('Export functionality coming soon');
    }
  };

  const handleImport = () => {
    if (onImport) {
      onImport();
    } else {
      toast.info('Import functionality coming soon');
    }
  };

  const handleZoomIn = () => {
    if (onZoomIn) {
      onZoomIn();
    } else {
      toast.info('Use the zoom controls in the bottom right');
    }
  };

  const handleZoomOut = () => {
    if (onZoomOut) {
      onZoomOut();
    } else {
      toast.info('Use the zoom controls in the bottom right');
    }
  };

  const handleToggleGrid = () => {
    if (onToggleGrid) {
      onToggleGrid();
    } else {
      toast.info('Grid toggle coming soon');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Save and Execute */}
      {!readOnly && (
        <>
          <Button
            onClick={onSave}
            disabled={isSaving}
            size="sm"
            variant="outline"
          >
            <Save className="w-3 h-3 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>

          <Button
            onClick={onExecute}
            disabled={!canExecute || isExecuting}
            size="sm"
            variant="default"
          >
            <Play className="w-3 h-3 mr-1" />
            {isExecuting ? 'Running...' : 'Execute'}
          </Button>

          <Separator orientation="vertical" className="h-6" />
        </>
      )}

      {/* View Controls */}
      <Button
        onClick={onFitView}
        size="sm"
        variant="ghost"
        title="Fit to view"
      >
        <Maximize className="w-3 h-3" />
      </Button>

      <Button
        onClick={handleZoomIn}
        size="sm"
        variant="ghost"
        title="Zoom in"
      >
        <ZoomIn className="w-3 h-3" />
      </Button>

      <Button
        onClick={handleZoomOut}
        size="sm"
        variant="ghost"
        title="Zoom out"
      >
        <ZoomOut className="w-3 h-3" />
      </Button>

      <Button
        onClick={handleToggleGrid}
        size="sm"
        variant="ghost"
        title="Toggle grid"
      >
        <Grid3X3 className="w-3 h-3" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Import/Export */}
      <Button
        onClick={handleExport}
        size="sm"
        variant="ghost"
        title="Export workflow"
      >
        <Download className="w-3 h-3" />
      </Button>

      {!readOnly && (
        <Button
          onClick={handleImport}
          size="sm"
          variant="ghost"
          title="Import workflow"
        >
          <Upload className="w-3 h-3" />
        </Button>
      )}

      {/* Reset */}
      {!readOnly && (
        <>
          <Separator orientation="vertical" className="h-6" />
          
          <Button
            onClick={onReset}
            size="sm"
            variant="ghost"
            title="Clear workflow"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </>
      )}
    </div>
  );
};