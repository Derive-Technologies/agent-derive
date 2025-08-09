import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Workflow, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export type ParallelNodeData = {
  label: string;
  config?: {
    executionMode?: 'all' | 'any' | 'first'; // Wait for all, any, or first to complete
    timeout?: number; // in minutes
    maxConcurrency?: number;
    failureMode?: 'fail_fast' | 'continue' | 'ignore';
    branches?: Array<{
      id: string;
      label: string;
      steps: string[];
      priority?: number;
    }>;
  };
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'partial';
  executionData?: {
    startedBranches?: number;
    completedBranches?: number;
    failedBranches?: number;
    branchResults?: Array<{
      branchId: string;
      status: 'pending' | 'running' | 'completed' | 'failed';
      result?: any;
      error?: string;
      startedAt?: string;
      completedAt?: string;
    }>;
  };
};

export const ParallelNode: React.FC<NodeProps<ParallelNodeData>> = ({
  data,
  isConnectable,
  selected,
}) => {
  const getStatusIcon = () => {
    switch (data.status) {
      case 'running':
        return <Clock className="w-4 h-4 animate-spin text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Workflow className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'running':
        return 'bg-blue-100 text-blue-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'failed':
        return 'bg-red-100 text-red-600';
      case 'partial':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getProgressInfo = () => {
    if (!data.executionData) return null;
    
    const { completedBranches = 0, failedBranches = 0, startedBranches = 0 } = data.executionData;
    const totalBranches = data.config?.branches?.length || 0;
    
    return { completedBranches, failedBranches, startedBranches, totalBranches };
  };

  const progress = getProgressInfo();

  return (
    <Card className={`min-w-[250px] p-3 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{data.label}</h3>
          <Badge variant="outline" className="text-xs">
            Parallel
          </Badge>
        </div>
      </div>

      {data.config?.executionMode && (
        <div className="text-xs text-gray-600 mb-1">
          Mode: {data.config.executionMode}
        </div>
      )}

      {data.config?.maxConcurrency && (
        <div className="text-xs text-gray-600 mb-1">
          Max concurrent: {data.config.maxConcurrency}
        </div>
      )}

      {data.config?.timeout && (
        <div className="text-xs text-gray-600 mb-1">
          Timeout: {data.config.timeout}m
        </div>
      )}

      {data.config?.branches && (
        <div className="text-xs text-gray-600 mb-2">
          Branches: {data.config.branches.length}
        </div>
      )}

      {progress && progress.totalBranches > 0 && (
        <div className="text-xs mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">
              {progress.completedBranches}/{progress.totalBranches}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ 
                width: `${(progress.completedBranches / progress.totalBranches) * 100}%` 
              }}
            />
          </div>
          {progress.failedBranches > 0 && (
            <div className="text-red-600 mt-1">
              Failed: {progress.failedBranches}
            </div>
          )}
        </div>
      )}

      {data.status && (
        <div className="text-xs mt-2">
          <Badge variant={data.status === 'completed' ? 'default' : 'secondary'}>
            {data.status}
          </Badge>
        </div>
      )}

      {/* Branch Status Indicators */}
      {data.executionData?.branchResults && data.executionData.branchResults.length > 0 && (
        <div className="mt-2 space-y-1">
          {data.executionData.branchResults.slice(0, 3).map((branch, index) => (
            <div key={branch.branchId} className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Branch {index + 1}</span>
              <Badge 
                variant={branch.status === 'completed' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {branch.status}
              </Badge>
            </div>
          ))}
          {data.executionData.branchResults.length > 3 && (
            <div className="text-xs text-gray-500">
              +{data.executionData.branchResults.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
      
      {/* Output Handles for branches */}
      {data.config?.branches?.map((branch, index) => (
        <Handle
          key={branch.id}
          type="source"
          position={Position.Right}
          id={branch.id}
          isConnectable={isConnectable}
          className="w-3 h-3"
          style={{ 
            top: `${20 + (index * 60 / Math.max(1, (data.config?.branches?.length || 1) - 1))}%` 
          }}
        />
      ))}
      
      {/* Default output handle if no branches configured */}
      {(!data.config?.branches || data.config.branches.length === 0) && (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-3 h-3"
        />
      )}
    </Card>
  );
};