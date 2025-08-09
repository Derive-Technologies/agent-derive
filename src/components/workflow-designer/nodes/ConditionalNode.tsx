import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Check, X } from 'lucide-react';

export type ConditionalNodeData = {
  label: string;
  config?: {
    condition?: string; // JavaScript expression
    conditionType?: 'simple' | 'advanced' | 'script';
    variables?: string[]; // Variables used in condition
    trueBranch?: {
      label?: string;
      color?: string;
    };
    falseBranch?: {
      label?: string;
      color?: string;
    };
    defaultBranch?: 'true' | 'false' | 'error';
  };
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  status?: 'pending' | 'evaluating' | 'completed' | 'failed';
  evaluationResult?: {
    result?: boolean;
    selectedPath?: 'true' | 'false';
    evaluatedAt?: string;
    variables?: Record<string, any>;
  };
};

export const ConditionalNode: React.FC<NodeProps<ConditionalNodeData>> = ({
  data,
  isConnectable,
  selected,
}) => {
  const getStatusColor = () => {
    switch (data.status) {
      case 'evaluating':
        return 'bg-yellow-100 text-yellow-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'failed':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <Card className={`min-w-[240px] p-3 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor()}`}>
          <GitBranch className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{data.label}</h3>
          <Badge variant="outline" className="text-xs">
            Conditional
          </Badge>
        </div>
      </div>

      {data.config?.condition && (
        <div className="text-xs text-gray-600 mb-2 p-2 bg-gray-50 rounded font-mono">
          {data.config.condition.length > 30 
            ? `${data.config.condition.substring(0, 30)}...` 
            : data.config.condition
          }
        </div>
      )}

      {data.config?.conditionType && (
        <div className="text-xs text-gray-600 mb-1">
          Type: {data.config.conditionType}
        </div>
      )}

      {data.config?.variables && data.config.variables.length > 0 && (
        <div className="text-xs text-gray-500 mb-2">
          Variables: {data.config.variables.join(', ')}
        </div>
      )}

      {/* Branch Labels */}
      <div className="flex justify-between items-center mb-2 text-xs">
        <div className="flex items-center gap-1 text-green-600">
          <Check className="w-3 h-3" />
          <span>{data.config?.trueBranch?.label || 'True'}</span>
        </div>
        <div className="flex items-center gap-1 text-red-600">
          <X className="w-3 h-3" />
          <span>{data.config?.falseBranch?.label || 'False'}</span>
        </div>
      </div>

      {data.status && (
        <div className="text-xs mb-2">
          <Badge variant={data.status === 'completed' ? 'default' : 'secondary'}>
            {data.status}
          </Badge>
        </div>
      )}

      {data.evaluationResult?.result !== undefined && (
        <div className="text-xs">
          <Badge variant={data.evaluationResult.result ? 'default' : 'destructive'}>
            Result: {data.evaluationResult.result ? 'True' : 'False'}
          </Badge>
        </div>
      )}

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
      
      {/* True Path Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        isConnectable={isConnectable}
        className="w-3 h-3"
        style={{ top: '30%' }}
      />
      
      {/* False Path Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        isConnectable={isConnectable}
        className="w-3 h-3"
        style={{ top: '70%' }}
      />
    </Card>
  );
};