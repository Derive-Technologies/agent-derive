import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Play,
  Square,
  CheckSquare,
  UserCheck,
  Bot,
  GitBranch,
  Workflow,
  Zap,
  Clock,
  Database,
  Globe,
} from 'lucide-react';

export interface NodePaletteItem {
  id: string;
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  color: string;
}

const nodeCategories = {
  flow: 'Flow Control',
  action: 'Actions',
  logic: 'Logic & AI',
  integration: 'Integrations',
};

const paletteItems: NodePaletteItem[] = [
  // Flow Control
  {
    id: 'start',
    type: 'start',
    label: 'Start',
    description: 'Workflow entry point',
    icon: <Play className="w-4 h-4" />,
    category: 'flow',
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'end',
    type: 'end',
    label: 'End',
    description: 'Workflow completion point',
    icon: <Square className="w-4 h-4" />,
    category: 'flow',
    color: 'bg-red-100 text-red-600',
  },
  
  // Actions
  {
    id: 'task',
    type: 'task',
    label: 'Task',
    description: 'Execute a task or action',
    icon: <CheckSquare className="w-4 h-4" />,
    category: 'action',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'approval',
    type: 'approval',
    label: 'Approval',
    description: 'Request human approval',
    icon: <UserCheck className="w-4 h-4" />,
    category: 'action',
    color: 'bg-yellow-100 text-yellow-600',
  },
  
  // Logic & AI
  {
    id: 'ai_agent',
    type: 'ai_agent',
    label: 'AI Agent',
    description: 'AI-powered task execution',
    icon: <Bot className="w-4 h-4" />,
    category: 'logic',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'conditional',
    type: 'conditional',
    label: 'Conditional',
    description: 'Branch based on conditions',
    icon: <GitBranch className="w-4 h-4" />,
    category: 'logic',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    id: 'parallel',
    type: 'parallel',
    label: 'Parallel',
    description: 'Execute multiple branches simultaneously',
    icon: <Workflow className="w-4 h-4" />,
    category: 'logic',
    color: 'bg-teal-100 text-teal-600',
  },
  
  // Integrations
  {
    id: 'webhook',
    type: 'webhook',
    label: 'Webhook',
    description: 'Send HTTP requests',
    icon: <Globe className="w-4 h-4" />,
    category: 'integration',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 'database',
    type: 'database',
    label: 'Database',
    description: 'Database operations',
    icon: <Database className="w-4 h-4" />,
    category: 'integration',
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'scheduler',
    type: 'scheduler',
    label: 'Scheduler',
    description: 'Schedule tasks for later',
    icon: <Clock className="w-4 h-4" />,
    category: 'integration',
    color: 'bg-pink-100 text-pink-600',
  },
];

export const NodePalette: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-label', nodeLabel);
    event.dataTransfer.effectAllowed = 'move';
  };

  const groupedItems = paletteItems.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, NodePaletteItem[]>);

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-sm text-gray-900 mb-2">Node Palette</h3>
        <p className="text-xs text-gray-600">
          Drag nodes onto the canvas to build your workflow
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <div className="flex items-center mb-2">
              <h4 className="text-xs font-medium text-gray-700">
                {nodeCategories[category as keyof typeof nodeCategories]}
              </h4>
              <Separator className="ml-2 flex-1" />
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="p-3 cursor-grab hover:shadow-md transition-shadow border-dashed border-gray-300 hover:border-blue-400"
                  draggable
                  onDragStart={(e) => onDragStart(e, item.type, item.label)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <div className="text-xs text-blue-700 font-medium mb-1">
          <Zap className="w-3 h-3 inline mr-1" />
          Tip
        </div>
        <div className="text-xs text-blue-600">
          Double-click nodes on the canvas to configure their settings and behavior.
        </div>
      </div>
    </div>
  );
};