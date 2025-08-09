import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Square } from 'lucide-react';

export type EndNodeData = {
  label: string;
  config?: {
    returnData?: boolean;
    notifyOnCompletion?: boolean;
    webhookUrl?: string;
  };
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
};

export const EndNode: React.FC<NodeProps<EndNodeData>> = ({
  data,
  isConnectable,
  selected,
}) => {
  return (
    <Card className={`min-w-[200px] p-3 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
          <Square className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{data.label}</h3>
          <Badge variant="outline" className="text-xs">
            End
          </Badge>
        </div>
      </div>

      {data.config?.returnData && (
        <div className="text-xs text-gray-600 mb-1">
          ✓ Return workflow data
        </div>
      )}

      {data.config?.notifyOnCompletion && (
        <div className="text-xs text-gray-600 mb-1">
          ✓ Send completion notification
        </div>
      )}

      {data.config?.webhookUrl && (
        <div className="text-xs text-gray-500 truncate">
          Webhook: {data.config.webhookUrl}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
    </Card>
  );
};