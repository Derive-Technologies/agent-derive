import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, FileText, BarChart3, Lightbulb } from 'lucide-react';

export type AIAgentNodeData = {
  label: string;
  config?: {
    taskType?: 'text_generation' | 'data_analysis' | 'decision_making' | 'content_review' | 'classification';
    model?: string;
    temperature?: number;
    maxTokens?: number;
    prompt?: string;
    systemPrompt?: string;
    parameters?: Record<string, any>;
    outputFormat?: 'text' | 'json' | 'structured';
    validation?: {
      enabled: boolean;
      rules?: string[];
    };
  };
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  executionData?: {
    startedAt?: string;
    completedAt?: string;
    tokensUsed?: number;
    cost?: number;
    result?: any;
  };
};

export const AIAgentNode: React.FC<NodeProps<AIAgentNodeData>> = ({
  data,
  isConnectable,
  selected,
}) => {
  const getTaskIcon = () => {
    switch (data.config?.taskType) {
      case 'text_generation':
        return <FileText className="w-4 h-4" />;
      case 'data_analysis':
        return <BarChart3 className="w-4 h-4" />;
      case 'decision_making':
        return <Lightbulb className="w-4 h-4" />;
      case 'content_review':
        return <FileText className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'running':
        return 'bg-purple-100 text-purple-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'failed':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-purple-100 text-purple-600';
    }
  };

  return (
    <Card className={`min-w-[220px] p-3 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor()}`}>
          <Bot className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{data.label}</h3>
          <Badge variant="outline" className="text-xs">
            AI Agent
          </Badge>
        </div>
        <div className="text-purple-600">
          {getTaskIcon()}
        </div>
      </div>

      {data.config?.taskType && (
        <div className="text-xs text-gray-600 mb-1">
          Task: {data.config.taskType.replace('_', ' ')}
        </div>
      )}

      {data.config?.model && (
        <div className="text-xs text-gray-600 mb-1">
          Model: {data.config.model}
        </div>
      )}

      {data.config?.temperature !== undefined && (
        <div className="text-xs text-gray-600 mb-1">
          Temperature: {data.config.temperature}
        </div>
      )}

      {data.config?.maxTokens && (
        <div className="text-xs text-gray-600 mb-1">
          Max tokens: {data.config.maxTokens}
        </div>
      )}

      {data.config?.outputFormat && (
        <div className="text-xs text-gray-500 mb-1">
          Output: {data.config.outputFormat}
        </div>
      )}

      {data.config?.validation?.enabled && (
        <div className="text-xs text-gray-500 mb-1">
          ✓ Validation enabled
        </div>
      )}

      {data.status && (
        <div className="text-xs mt-2">
          <Badge variant={data.status === 'completed' ? 'default' : 'secondary'}>
            {data.status}
          </Badge>
        </div>
      )}

      {data.executionData?.tokensUsed && (
        <div className="text-xs text-gray-500 mt-1">
          Tokens: {data.executionData.tokensUsed.toLocaleString()}
        </div>
      )}

      {data.executionData?.cost && (
        <div className="text-xs text-gray-500">
          Cost: ${data.executionData.cost.toFixed(4)}
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