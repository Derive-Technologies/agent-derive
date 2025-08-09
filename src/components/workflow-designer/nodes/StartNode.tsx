import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';

export type StartNodeData = {
  label: string;
  config?: {
    triggerType?: 'manual' | 'scheduled' | 'webhook' | 'event';
    scheduleConfig?: {
      cron?: string;
      timezone?: string;
    };
    webhookConfig?: {
      url?: string;
      secret?: string;
    };
  };
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
};

export const StartNode: React.FC<NodeProps<StartNodeData>> = ({
  data,
  isConnectable,
  selected,
}) => {
  return (
    <Card className={`min-w-[200px] p-3 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
          <Play className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{data.label}</h3>
          <Badge variant="outline" className="text-xs">
            Start
          </Badge>
        </div>
      </div>

      {data.config?.triggerType && (
        <div className="text-xs text-gray-600 mb-2">
          Trigger: {data.config.triggerType}
        </div>
      )}

      {data.config?.scheduleConfig?.cron && (
        <div className="text-xs text-gray-500">
          Schedule: {data.config.scheduleConfig.cron}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
    </Card>
  );
};