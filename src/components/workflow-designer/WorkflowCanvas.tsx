import React, { useCallback, useRef, useState, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import { nodeTypes, type WorkflowNodeData } from './nodes';
import { edgeTypes, type CustomEdgeData } from './edges';
import { NodePalette } from './NodePalette';
import { WorkflowToolbar } from './WorkflowToolbar';
import { NodeConfigPanel } from './NodeConfigPanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Play, Square, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

// Import React Flow styles
import 'reactflow/dist/style.css';

export interface WorkflowCanvasProps {
  workflowId?: string;
  initialNodes?: Node<WorkflowNodeData>[];
  initialEdges?: Edge<CustomEdgeData>[];
  onSave?: (nodes: Node<WorkflowNodeData>[], edges: Edge<CustomEdgeData>[]) => Promise<void>;
  onExecute?: (workflowId: string) => Promise<void>;
  readOnly?: boolean;
  className?: string;
}

const WorkflowCanvasInner: React.FC<WorkflowCanvasProps> = ({
  workflowId,
  initialNodes = [],
  initialEdges = [],
  onSave,
  onExecute,
  readOnly = false,
  className,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      if (readOnly) return;
      
      const newEdge: Edge<CustomEdgeData> = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        type: 'custom',
        data: {
          label: '',
          animated: false,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, readOnly]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      if (readOnly) return;
      
      event.preventDefault();
      
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow-label') || type;
      
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<WorkflowNodeData> = {
        id: `${type}-${Date.now()}`,
        type: type as keyof typeof nodeTypes,
        position,
        data: {
          label,
          config: getDefaultConfigForNodeType(type),
        },
      };

      setNodes((nds) => nds.concat(newNode));
      toast.success(`Added ${label} node`);
    },
    [screenToFlowPosition, setNodes, readOnly]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node<WorkflowNodeData>) => {
      if (readOnly) return;
      
      setSelectedNode(node);
      setIsConfigPanelOpen(true);
    },
    [readOnly]
  );

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node<WorkflowNodeData>) => {
      if (readOnly) return;
      
      setSelectedNode(node);
      setIsConfigPanelOpen(true);
    },
    [readOnly]
  );

  const handleUpdateNode = useCallback(
    (updatedNode: Node<WorkflowNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === updatedNode.id ? updatedNode : node
        )
      );
      toast.success('Node updated');
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      setIsConfigPanelOpen(false);
      setSelectedNode(null);
      toast.success('Node deleted');
    },
    [setNodes, setEdges]
  );

  const handleSave = useCallback(async () => {
    if (!onSave || isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave(nodes, edges);
      toast.success('Workflow saved successfully');
    } catch (error) {
      console.error('Failed to save workflow:', error);
      toast.error('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  }, [onSave, nodes, edges, isSaving]);

  const handleExecute = useCallback(async () => {
    if (!onExecute || !workflowId || isExecuting) return;
    
    // Basic validation
    const hasStartNode = nodes.some(node => node.type === 'start');
    const hasEndNode = nodes.some(node => node.type === 'end');
    
    if (!hasStartNode) {
      toast.error('Workflow must have a start node');
      return;
    }
    
    if (!hasEndNode) {
      toast.error('Workflow must have an end node');
      return;
    }
    
    setIsExecuting(true);
    try {
      await onExecute(workflowId);
      toast.success('Workflow execution started');
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      toast.error('Failed to execute workflow');
    } finally {
      setIsExecuting(false);
    }
  }, [onExecute, workflowId, nodes, isExecuting]);

  const handleReset = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setIsConfigPanelOpen(false);
    toast.success('Workflow cleared');
  }, [setNodes, setEdges]);

  const fitView = useCallback(() => {
    // This would be implemented to fit the view
  }, []);

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);

  return (
    <div className={`w-full h-full flex ${className}`}>
      {/* Node Palette */}
      {!readOnly && (
        <div className="w-64 border-r bg-white flex-shrink-0 overflow-y-auto">
          <NodePalette />
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 relative bg-gray-50">
        <div ref={reactFlowWrapper} className="w-full h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            nodeTypes={memoizedNodeTypes}
            edgeTypes={memoizedEdgeTypes}
            fitView
            attributionPosition="top-right"
            defaultEdgeOptions={{
              type: 'custom',
              animated: false,
            }}
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            
            {/* Toolbar Panel - Removed to avoid duplication with page header */}

            {/* Status Panel */}
            <Panel position="top-right">
              <Card className="p-2">
                <div className="text-xs text-gray-600">
                  Nodes: {nodes.length} | Edges: {edges.length}
                </div>
              </Card>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Node Configuration Panel */}
      {selectedNode && !readOnly && (
        <NodeConfigPanel
          node={selectedNode}
          isOpen={isConfigPanelOpen}
          onClose={() => {
            setIsConfigPanelOpen(false);
            setSelectedNode(null);
          }}
          onUpdate={handleUpdateNode}
          onDelete={handleDeleteNode}
        />
      )}
    </div>
  );
};

// Wrapper component with ReactFlowProvider
export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
};

// Helper function to get default configuration for node types
function getDefaultConfigForNodeType(type: string): any {
  switch (type) {
    case 'start':
      return {
        triggerType: 'manual',
      };
    case 'end':
      return {
        returnData: true,
        notifyOnCompletion: false,
      };
    case 'task':
      return {
        taskType: 'manual',
        timeout: 30,
        retryPolicy: {
          maxRetries: 3,
          retryDelay: 60,
          backoffMultiplier: 2,
        },
      };
    case 'approval':
      return {
        approvalType: 'any',
        approvers: [],
      };
    case 'ai_agent':
      return {
        taskType: 'text_generation',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000,
        outputFormat: 'text',
      };
    case 'conditional':
      return {
        conditionType: 'simple',
        condition: 'true',
        trueBranch: { label: 'Yes' },
        falseBranch: { label: 'No' },
      };
    case 'parallel':
      return {
        executionMode: 'all',
        maxConcurrency: 5,
        failureMode: 'fail_fast',
        branches: [],
      };
    default:
      return {};
  }
}