import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { WorkflowNodeData } from './nodes';

export interface NodeConfigPanelProps {
  node: Node<WorkflowNodeData>;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (node: Node<WorkflowNodeData>) => void;
  onDelete: (nodeId: string) => void;
}

export const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({
  node,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [editedNode, setEditedNode] = useState<Node<WorkflowNodeData>>(node);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedNode(node);
    setHasChanges(false);
  }, [node]);

  const handleSave = () => {
    onUpdate(editedNode);
    setHasChanges(false);
    toast.success('Node configuration saved');
  };

  const handleCancel = () => {
    setEditedNode(node);
    setHasChanges(false);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      onDelete(node.id);
    }
  };

  const updateNodeData = (updates: Partial<WorkflowNodeData>) => {
    setEditedNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        ...updates,
      },
    }));
    setHasChanges(true);
  };

  const updateNodeConfig = (configUpdates: Record<string, any>) => {
    updateNodeData({
      config: {
        ...(editedNode.data.config || {}),
        ...configUpdates,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Configure Node</h3>
            <Badge variant="outline">{editedNode.type}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} size="sm">
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <div>
                <Label htmlFor="node-label">Label</Label>
                <Input
                  id="node-label"
                  value={editedNode.data.label}
                  onChange={(e) => updateNodeData({ label: e.target.value })}
                  placeholder="Enter node label"
                />
              </div>

              {renderNodeSpecificGeneralConfig()}
            </TabsContent>

            {/* Configuration Tab */}
            <TabsContent value="config" className="space-y-4">
              {renderNodeSpecificConfig()}
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-4">
              {renderAdvancedConfig()}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          onClick={handleDelete}
          variant="destructive"
          size="sm"
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </Button>
      </div>
    </div>
  );

  function renderNodeSpecificGeneralConfig() {
    switch (editedNode.type) {
      case 'start':
        return (
          <div>
            <Label htmlFor="trigger-type">Trigger Type</Label>
            <Select
              value={editedNode.data.config?.triggerType || 'manual'}
              onValueChange={(value) => updateNodeConfig({ triggerType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trigger type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'task':
        return (
          <div>
            <Label htmlFor="task-type">Task Type</Label>
            <Select
              value={editedNode.data.config?.taskType || 'manual'}
              onValueChange={(value) => updateNodeConfig({ taskType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="automated">Automated</SelectItem>
                <SelectItem value="script">Script</SelectItem>
                <SelectItem value="api_call">API Call</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'approval':
        return (
          <div>
            <Label htmlFor="approval-type">Approval Type</Label>
            <Select
              value={editedNode.data.config?.approvalType || 'any'}
              onValueChange={(value) => updateNodeConfig({ approvalType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select approval type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any approver</SelectItem>
                <SelectItem value="all">All approvers</SelectItem>
                <SelectItem value="majority">Majority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'ai_agent':
        return (
          <div>
            <Label htmlFor="ai-task-type">AI Task Type</Label>
            <Select
              value={editedNode.data.config?.taskType || 'text_generation'}
              onValueChange={(value) => updateNodeConfig({ taskType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text_generation">Text Generation</SelectItem>
                <SelectItem value="data_analysis">Data Analysis</SelectItem>
                <SelectItem value="decision_making">Decision Making</SelectItem>
                <SelectItem value="content_review">Content Review</SelectItem>
                <SelectItem value="classification">Classification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  }

  function renderNodeSpecificConfig() {
    switch (editedNode.type) {
      case 'start':
        return renderStartNodeConfig();
      case 'end':
        return renderEndNodeConfig();
      case 'task':
        return renderTaskNodeConfig();
      case 'approval':
        return renderApprovalNodeConfig();
      case 'ai_agent':
        return renderAIAgentNodeConfig();
      case 'conditional':
        return renderConditionalNodeConfig();
      case 'parallel':
        return renderParallelNodeConfig();
      default:
        return <div>No configuration options available for this node type.</div>;
    }
  }

  function renderStartNodeConfig() {
    const config = editedNode.data.config || {};
    
    return (
      <div className="space-y-4">
        {config.triggerType === 'scheduled' && (
          <div>
            <Label htmlFor="cron">Schedule (Cron)</Label>
            <Input
              id="cron"
              value={config.scheduleConfig?.cron || ''}
              onChange={(e) => 
                updateNodeConfig({
                  scheduleConfig: {
                    ...config.scheduleConfig,
                    cron: e.target.value,
                  },
                })
              }
              placeholder="0 9 * * 1-5"
            />
          </div>
        )}

        {config.triggerType === 'webhook' && (
          <div>
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              value={config.webhookConfig?.url || ''}
              onChange={(e) =>
                updateNodeConfig({
                  webhookConfig: {
                    ...config.webhookConfig,
                    url: e.target.value,
                  },
                })
              }
              placeholder="https://api.example.com/webhook"
            />
          </div>
        )}
      </div>
    );
  }

  function renderEndNodeConfig() {
    const config = editedNode.data.config || {};
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="return-data"
            checked={config.returnData || false}
            onCheckedChange={(checked) => updateNodeConfig({ returnData: checked })}
          />
          <Label htmlFor="return-data">Return workflow data</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="notify-completion"
            checked={config.notifyOnCompletion || false}
            onCheckedChange={(checked) => updateNodeConfig({ notifyOnCompletion: checked })}
          />
          <Label htmlFor="notify-completion">Send completion notification</Label>
        </div>

        {config.notifyOnCompletion && (
          <div>
            <Label htmlFor="webhook-url">Notification Webhook URL</Label>
            <Input
              id="webhook-url"
              value={config.webhookUrl || ''}
              onChange={(e) => updateNodeConfig({ webhookUrl: e.target.value })}
              placeholder="https://api.example.com/notify"
            />
          </div>
        )}
      </div>
    );
  }

  function renderTaskNodeConfig() {
    const config = editedNode.data.config || {};
    
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="timeout">Timeout (minutes)</Label>
          <Input
            id="timeout"
            type="number"
            value={config.timeout || 30}
            onChange={(e) => updateNodeConfig({ timeout: parseInt(e.target.value) })}
          />
        </div>

        {config.taskType === 'api_call' && (
          <>
            <div>
              <Label htmlFor="api-method">HTTP Method</Label>
              <Select
                value={config.apiConfig?.method || 'GET'}
                onValueChange={(value) =>
                  updateNodeConfig({
                    apiConfig: { ...config.apiConfig, method: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="api-url">API URL</Label>
              <Input
                id="api-url"
                value={config.apiConfig?.url || ''}
                onChange={(e) =>
                  updateNodeConfig({
                    apiConfig: { ...config.apiConfig, url: e.target.value },
                  })
                }
                placeholder="https://api.example.com/endpoint"
              />
            </div>
          </>
        )}

        {config.taskType === 'script' && (
          <>
            <div>
              <Label htmlFor="script-language">Language</Label>
              <Select
                value={config.scriptConfig?.language || 'javascript'}
                onValueChange={(value) =>
                  updateNodeConfig({
                    scriptConfig: { ...config.scriptConfig, language: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="bash">Bash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="script-code">Code</Label>
              <Textarea
                id="script-code"
                value={config.scriptConfig?.code || ''}
                onChange={(e) =>
                  updateNodeConfig({
                    scriptConfig: { ...config.scriptConfig, code: e.target.value },
                  })
                }
                placeholder="Enter your script code here..."
                rows={6}
              />
            </div>
          </>
        )}
      </div>
    );
  }

  function renderApprovalNodeConfig() {
    const config = editedNode.data.config || {};
    
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="due-date">Due Date</Label>
          <Input
            id="due-date"
            type="datetime-local"
            value={config.dueDate || ''}
            onChange={(e) => updateNodeConfig({ dueDate: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="escalation-enabled"
            checked={config.escalation?.enabled || false}
            onCheckedChange={(checked) =>
              updateNodeConfig({
                escalation: { ...config.escalation, enabled: checked },
              })
            }
          />
          <Label htmlFor="escalation-enabled">Enable escalation</Label>
        </div>

        {config.escalation?.enabled && (
          <div>
            <Label htmlFor="escalate-after">Escalate after (hours)</Label>
            <Input
              id="escalate-after"
              type="number"
              value={config.escalation?.escalateAfter || 24}
              onChange={(e) =>
                updateNodeConfig({
                  escalation: {
                    ...config.escalation,
                    escalateAfter: parseInt(e.target.value),
                  },
                })
              }
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="auto-approve-enabled"
            checked={config.autoApprove?.enabled || false}
            onCheckedChange={(checked) =>
              updateNodeConfig({
                autoApprove: { ...config.autoApprove, enabled: checked },
              })
            }
          />
          <Label htmlFor="auto-approve-enabled">Enable auto-approval</Label>
        </div>
      </div>
    );
  }

  function renderAIAgentNodeConfig() {
    const config = editedNode.data.config || {};
    
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="ai-model">Model</Label>
          <Select
            value={config.model || 'gpt-4'}
            onValueChange={(value) => updateNodeConfig({ model: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="claude-3">Claude 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="temperature">Temperature</Label>
          <Input
            id="temperature"
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={config.temperature || 0.7}
            onChange={(e) => updateNodeConfig({ temperature: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="max-tokens">Max Tokens</Label>
          <Input
            id="max-tokens"
            type="number"
            value={config.maxTokens || 1000}
            onChange={(e) => updateNodeConfig({ maxTokens: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            value={config.prompt || ''}
            onChange={(e) => updateNodeConfig({ prompt: e.target.value })}
            placeholder="Enter your AI prompt here..."
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="system-prompt">System Prompt</Label>
          <Textarea
            id="system-prompt"
            value={config.systemPrompt || ''}
            onChange={(e) => updateNodeConfig({ systemPrompt: e.target.value })}
            placeholder="Enter system prompt (optional)..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="output-format">Output Format</Label>
          <Select
            value={config.outputFormat || 'text'}
            onValueChange={(value) => updateNodeConfig({ outputFormat: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="structured">Structured</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  function renderConditionalNodeConfig() {
    const config = editedNode.data.config || {};
    
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="condition">Condition</Label>
          <Textarea
            id="condition"
            value={config.condition || ''}
            onChange={(e) => updateNodeConfig({ condition: e.target.value })}
            placeholder="Enter condition expression (e.g., variables.status === 'approved')"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="condition-type">Condition Type</Label>
          <Select
            value={config.conditionType || 'simple'}
            onValueChange={(value) => updateNodeConfig({ conditionType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="script">Script</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="true-label">True Branch Label</Label>
          <Input
            id="true-label"
            value={config.trueBranch?.label || 'Yes'}
            onChange={(e) =>
              updateNodeConfig({
                trueBranch: { ...config.trueBranch, label: e.target.value },
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="false-label">False Branch Label</Label>
          <Input
            id="false-label"
            value={config.falseBranch?.label || 'No'}
            onChange={(e) =>
              updateNodeConfig({
                falseBranch: { ...config.falseBranch, label: e.target.value },
              })
            }
          />
        </div>
      </div>
    );
  }

  function renderParallelNodeConfig() {
    const config = editedNode.data.config || {};
    
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="execution-mode">Execution Mode</Label>
          <Select
            value={config.executionMode || 'all'}
            onValueChange={(value) => updateNodeConfig({ executionMode: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wait for all</SelectItem>
              <SelectItem value="any">Wait for any</SelectItem>
              <SelectItem value="first">Wait for first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="max-concurrency">Max Concurrency</Label>
          <Input
            id="max-concurrency"
            type="number"
            value={config.maxConcurrency || 5}
            onChange={(e) => updateNodeConfig({ maxConcurrency: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="failure-mode">Failure Mode</Label>
          <Select
            value={config.failureMode || 'fail_fast'}
            onValueChange={(value) => updateNodeConfig({ failureMode: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fail_fast">Fail Fast</SelectItem>
              <SelectItem value="continue">Continue</SelectItem>
              <SelectItem value="ignore">Ignore Failures</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timeout">Timeout (minutes)</Label>
          <Input
            id="timeout"
            type="number"
            value={config.timeout || 60}
            onChange={(e) => updateNodeConfig({ timeout: parseInt(e.target.value) })}
          />
        </div>
      </div>
    );
  }

  function renderAdvancedConfig() {
    return (
      <div className="space-y-4">
        <div>
          <Label>Node ID</Label>
          <Input value={editedNode.id} disabled />
        </div>

        <div>
          <Label>Node Type</Label>
          <Input value={editedNode.type} disabled />
        </div>

        <div>
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={Math.round(editedNode.position.x)}
              disabled
              placeholder="X"
            />
            <Input
              value={Math.round(editedNode.position.y)}
              disabled
              placeholder="Y"
            />
          </div>
        </div>

        <Separator />

        <div>
          <Label>Custom CSS Classes</Label>
          <Input
            value={editedNode.className || ''}
            onChange={(e) =>
              setEditedNode((prev) => ({ ...prev, className: e.target.value }))
            }
            placeholder="custom-class-name"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="draggable"
            checked={editedNode.draggable !== false}
            onCheckedChange={(checked) =>
              setEditedNode((prev) => ({ ...prev, draggable: checked as boolean }))
            }
          />
          <Label htmlFor="draggable">Draggable</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="selectable"
            checked={editedNode.selectable !== false}
            onCheckedChange={(checked) =>
              setEditedNode((prev) => ({ ...prev, selectable: checked as boolean }))
            }
          />
          <Label htmlFor="selectable">Selectable</Label>
        </div>
      </div>
    );
  }
};