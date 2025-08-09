import { useState, useCallback, useMemo } from 'react';
import { Node, Edge } from 'reactflow';
import { trpc } from '@/src/lib/trpc';
import { WorkflowNodeData } from '@/src/components/workflow-designer';
import { CustomEdgeData } from '@/src/components/workflow-designer/edges';
import {
  convertToWorkflowDefinition,
  convertFromWorkflowDefinition,
  validateWorkflowDefinition,
  calculateWorkflowMetrics,
} from './utils';
import { toast } from 'sonner';

/**
 * Hook for managing workflow save/load operations
 */
export function useWorkflowSaveLoad(workflowId?: string) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const utils = trpc.useUtils();
  const updateWorkflowMutation = trpc.workflow.update.useMutation();
  const createWorkflowMutation = trpc.workflow.create.useMutation();

  const saveWorkflow = useCallback(
    async (
      nodes: Node<WorkflowNodeData>[],
      edges: Edge<CustomEdgeData>[],
      metadata?: {
        name?: string;
        description?: string;
        category?: string;
      }
    ) => {
      if (isSaving) return;

      setIsSaving(true);
      try {
        const definition = convertToWorkflowDefinition(nodes, edges);
        const validation = validateWorkflowDefinition(definition);

        if (!validation.isValid) {
          toast.error(`Workflow validation failed: ${validation.errors.join(', ')}`);
          return;
        }

        if (workflowId) {
          // Update existing workflow
          await updateWorkflowMutation.mutateAsync({
            id: workflowId,
            definition: definition as any,
            ...(metadata?.name && { name: metadata.name }),
            ...(metadata?.description && { description: metadata.description }),
            ...(metadata?.category && { category: metadata.category }),
          });
        } else {
          // Create new workflow
          const newWorkflow = await createWorkflowMutation.mutateAsync({
            name: metadata?.name || 'Untitled Workflow',
            description: metadata?.description || '',
            category: metadata?.category,
            definition: definition as any,
          });
          
          // You might want to update the URL or redirect to the new workflow
          return newWorkflow;
        }

        // Invalidate queries to refresh the UI
        utils.workflow.list.invalidate();
        if (workflowId) {
          utils.workflow.getById.invalidate({ id: workflowId });
        }

        toast.success('Workflow saved successfully');
      } catch (error) {
        console.error('Failed to save workflow:', error);
        toast.error('Failed to save workflow');
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [workflowId, isSaving, updateWorkflowMutation, createWorkflowMutation, utils]
  );

  const loadWorkflow = useCallback(
    async (id: string): Promise<{
      nodes: Node<WorkflowNodeData>[];
      edges: Edge<CustomEdgeData>[];
      metadata: any;
    }> => {
      setIsLoading(true);
      try {
        const workflow = await utils.workflow.getById.fetch({ id });
        
        if (!workflow.definition) {
          throw new Error('Workflow has no definition');
        }

        const { nodes, edges } = convertFromWorkflowDefinition(workflow.definition as any);

        return {
          nodes,
          edges,
          metadata: {
            name: workflow.name,
            description: workflow.description,
            category: workflow.category,
            status: workflow.status,
            version: workflow.version,
            createdAt: workflow.createdAt,
            updatedAt: workflow.updatedAt,
          },
        };
      } catch (error) {
        console.error('Failed to load workflow:', error);
        toast.error('Failed to load workflow');
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [utils]
  );

  return {
    saveWorkflow,
    loadWorkflow,
    isSaving,
    isLoading,
  };
}

/**
 * Hook for workflow validation
 */
export function useWorkflowValidation() {
  const validateNodes = useCallback(
    (nodes: Node<WorkflowNodeData>[], edges: Edge<CustomEdgeData>[]) => {
      const definition = convertToWorkflowDefinition(nodes, edges);
      return validateWorkflowDefinition(definition);
    },
    []
  );

  const calculateMetrics = useCallback(
    (nodes: Node<WorkflowNodeData>[], edges: Edge<CustomEdgeData>[]) => {
      const definition = convertToWorkflowDefinition(nodes, edges);
      return calculateWorkflowMetrics(definition);
    },
    []
  );

  return {
    validateNodes,
    calculateMetrics,
  };
}

/**
 * Hook for workflow execution
 */
export function useWorkflowExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const executeWorkflowMutation = trpc.workflow.execute.useMutation();

  const executeWorkflow = useCallback(
    async (
      workflowId: string,
      inputs?: Record<string, any>,
      priority?: 'low' | 'normal' | 'high' | 'urgent'
    ) => {
      if (isExecuting) return;

      setIsExecuting(true);
      try {
        const execution = await executeWorkflowMutation.mutateAsync({
          workflowId,
          inputs: inputs || {},
          priority: priority || 'normal',
        });

        toast.success('Workflow execution started');
        return execution;
      } catch (error) {
        console.error('Failed to execute workflow:', error);
        toast.error('Failed to execute workflow');
        throw error;
      } finally {
        setIsExecuting(false);
      }
    },
    [isExecuting, executeWorkflowMutation]
  );

  return {
    executeWorkflow,
    isExecuting,
  };
}

/**
 * Hook for managing workflow state in the designer
 */
export function useWorkflowDesigner(initialWorkflowId?: string) {
  const [workflowId, setWorkflowId] = useState(initialWorkflowId);
  const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge<CustomEdgeData>[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [metadata, setMetadata] = useState<any>({});

  const { saveWorkflow, loadWorkflow, isSaving, isLoading } = useWorkflowSaveLoad(workflowId);
  const { validateNodes, calculateMetrics } = useWorkflowValidation();
  const { executeWorkflow, isExecuting } = useWorkflowExecution();

  // Validation and metrics
  const validation = useMemo(
    () => validateNodes(nodes, edges),
    [nodes, edges, validateNodes]
  );

  const metrics = useMemo(
    () => calculateMetrics(nodes, edges),
    [nodes, edges, calculateMetrics]
  );

  // Load workflow when workflowId changes
  const handleLoadWorkflow = useCallback(
    async (id: string) => {
      try {
        const result = await loadWorkflow(id);
        setNodes(result.nodes);
        setEdges(result.edges);
        setMetadata(result.metadata);
        setWorkflowId(id);
        setIsDirty(false);
      } catch (error) {
        // Error already handled in loadWorkflow
      }
    },
    [loadWorkflow]
  );

  // Save workflow
  const handleSaveWorkflow = useCallback(
    async (saveMetadata?: { name?: string; description?: string; category?: string }) => {
      try {
        const result = await saveWorkflow(nodes, edges, saveMetadata || metadata);
        if (result && !workflowId) {
          // New workflow created, update the ID
          setWorkflowId(result.id);
        }
        setIsDirty(false);
        return result;
      } catch (error) {
        // Error already handled in saveWorkflow
      }
    },
    [saveWorkflow, nodes, edges, metadata, workflowId]
  );

  // Execute workflow
  const handleExecuteWorkflow = useCallback(
    async (inputs?: Record<string, any>, priority?: 'low' | 'normal' | 'high' | 'urgent') => {
      if (!workflowId) {
        toast.error('Cannot execute workflow: No workflow ID');
        return;
      }

      if (!validation.isValid) {
        toast.error('Cannot execute workflow: Validation errors exist');
        return;
      }

      try {
        return await executeWorkflow(workflowId, inputs, priority);
      } catch (error) {
        // Error already handled in executeWorkflow
      }
    },
    [workflowId, validation.isValid, executeWorkflow]
  );

  // Update nodes and mark as dirty
  const updateNodes = useCallback((newNodes: Node<WorkflowNodeData>[]) => {
    setNodes(newNodes);
    setIsDirty(true);
  }, []);

  // Update edges and mark as dirty
  const updateEdges = useCallback((newEdges: Edge<CustomEdgeData>[]) => {
    setEdges(newEdges);
    setIsDirty(true);
  }, []);

  // Reset workflow
  const resetWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setMetadata({});
    setWorkflowId(undefined);
    setIsDirty(false);
  }, []);

  return {
    // State
    workflowId,
    nodes,
    edges,
    metadata,
    isDirty,
    
    // Validation and metrics
    validation,
    metrics,
    
    // Loading states
    isSaving,
    isLoading,
    isExecuting,
    
    // Actions
    loadWorkflow: handleLoadWorkflow,
    saveWorkflow: handleSaveWorkflow,
    executeWorkflow: handleExecuteWorkflow,
    updateNodes,
    updateEdges,
    resetWorkflow,
    setMetadata,
  };
}