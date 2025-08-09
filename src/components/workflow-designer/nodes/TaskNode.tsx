import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

export type TaskNodeData = {
  label: string;
  config?: {
    taskType?: 'manual' | 'automated' | 'script' | 'api_call' | 'webhook';
    timeout?: number; // in minutes
    retryPolicy?: {
      maxRetries?: number;
      retryDelay?: number;
      backoffMultiplier?: number;
    };
    scriptConfig?: {
      language?: 'javascript' | 'python' | 'bash';
      code?: string;
    };
    apiConfig?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      url?: string;
      headers?: Record<string, string>;
      body?: any;
    };
    webhookConfig?: {
      url?: string;
      method?: 'GET' | 'POST';
      payload?: any;
    };
  };
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
};

export const TaskNode: React.FC<NodeProps<TaskNodeData>> = ({
  data,
  isConnectable,
  selected,
}) => {
  const getStatusIcon = () => {
    switch (data.status) {
      case 'running':
        return <Clock className="w-4 h-4 animate-spin text-blue-600" />;
      case 'completed':
        return <CheckSquare className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <CheckSquare className="w-4 h-4 text-gray-600" />;
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
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className={`min-w-[200px] p-3 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{data.label}</h3>
          <Badge variant="outline" className="text-xs">
            Task
          </Badge>
        </div>
      </div>

      {data.config?.taskType && (
        <div className="text-xs text-gray-600 mb-1">
          Type: {data.config.taskType}
        </div>
      )}

      {data.config?.timeout && (
        <div className="text-xs text-gray-600 mb-1">
          Timeout: {data.config.timeout}m
        </div>
      )}

      {data.config?.retryPolicy?.maxRetries && (
        <div className="text-xs text-gray-500">
          Max retries: {data.config.retryPolicy.maxRetries}
        </div>
      )}

      {data.status && (
        <div className="text-xs mt-2">
          <Badge variant={data.status === 'completed' ? 'default' : 'secondary'}>
            {data.status}
          </Badge>
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
    </Card>
  );
};