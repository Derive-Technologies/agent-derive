import { Node, Edge } from 'reactflow';
import { WorkflowNodeData } from '@/src/components/workflow-designer';
import { CustomEdgeData } from '@/src/components/workflow-designer/edges';
import type { workflows } from '@/src/db/schema';

export type WorkflowDefinition = {
  nodes: Array<{
    id: string;
    type: 'start' | 'end' | 'task' | 'approval' | 'condition' | 'ai_agent' | 'human_task' | 'api_call' | 'webhook';
    position: { x: number; y: number };
    data: {
      label: string;
      config?: Record<string, any>;
      inputs?: Record<string, any>;
      outputs?: Record<string, any>;
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type?: string;
    conditions?: Record<string, any>;
  }>;
  variables?: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    default?: any;
    required?: boolean;
    description?: string;
  }>;
};

/**
 * Convert React Flow nodes and edges to workflow definition format
 */
export function convertToWorkflowDefinition(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge<CustomEdgeData>[]
): WorkflowDefinition {
  const workflowNodes = nodes.map((node) => ({
    id: node.id,
    type: mapNodeTypeToWorkflowType(node.type as string),
    position: node.position,
    data: {
      label: node.data.label,
      config: node.data.config || {},
      inputs: node.data.inputs || {},
      outputs: node.data.outputs || {},
    },
  }));

  const workflowEdges = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.type || 'default',
    conditions: edge.data?.condition ? { expression: edge.data.condition } : {},
    label: edge.data?.label,
  }));

  return {
    nodes: workflowNodes,
    edges: workflowEdges,
    variables: {},
  };
}

/**
 * Convert workflow definition to React Flow nodes and edges
 */
export function convertFromWorkflowDefinition(
  definition: WorkflowDefinition
): { nodes: Node<WorkflowNodeData>[]; edges: Edge<CustomEdgeData>[] } {
  const nodes: Node<WorkflowNodeData>[] = definition.nodes.map((node) => ({
    id: node.id,
    type: mapWorkflowTypeToNodeType(node.type),
    position: node.position,
    data: {
      label: node.data.label,
      config: node.data.config,
      inputs: node.data.inputs,
      outputs: node.data.outputs,
    },
  }));

  const edges: Edge<CustomEdgeData>[] = definition.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'custom',
    data: {
      label: edge.label,
      condition: edge.conditions?.expression,
      animated: false,
    },
  }));

  return { nodes, edges };
}

/**
 * Map React Flow node type to workflow definition node type
 */
function mapNodeTypeToWorkflowType(
  nodeType: string
): WorkflowDefinition['nodes'][0]['type'] {
  switch (nodeType) {
    case 'start':
      return 'start';
    case 'end':
      return 'end';
    case 'task':
      return 'task';
    case 'approval':
      return 'approval';
    case 'conditional':
      return 'condition';
    case 'ai_agent':
      return 'ai_agent';
    case 'parallel':
      return 'task'; // Map parallel to task with special config
    default:
      return 'task';
  }
}

/**
 * Map workflow definition node type to React Flow node type
 */
function mapWorkflowTypeToNodeType(
  workflowType: WorkflowDefinition['nodes'][0]['type']
): string {
  switch (workflowType) {
    case 'start':
      return 'start';
    case 'end':
      return 'end';
    case 'task':
      return 'task';
    case 'approval':
      return 'approval';
    case 'condition':
      return 'conditional';
    case 'ai_agent':
      return 'ai_agent';
    case 'human_task':
      return 'task';
    case 'api_call':
      return 'task';
    case 'webhook':
      return 'task';
    default:
      return 'task';
  }
}

/**
 * Validate workflow definition
 */
export function validateWorkflowDefinition(
  definition: WorkflowDefinition
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for start node
  const startNodes = definition.nodes.filter((node) => node.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Workflow must have at least one start node');
  } else if (startNodes.length > 1) {
    errors.push('Workflow can only have one start node');
  }

  // Check for end node
  const endNodes = definition.nodes.filter((node) => node.type === 'end');
  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one end node');
  }

  // Check for orphaned nodes
  const connectedNodeIds = new Set<string>();
  definition.edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const orphanedNodes = definition.nodes.filter(
    (node) => node.type !== 'start' && node.type !== 'end' && !connectedNodeIds.has(node.id)
  );

  if (orphanedNodes.length > 0) {
    errors.push(`Found orphaned nodes: ${orphanedNodes.map((n) => n.data.label).join(', ')}`);
  }

  // Check for circular dependencies
  if (hasCircularDependency(definition)) {
    errors.push('Workflow contains circular dependencies');
  }

  // Check for invalid edge connections
  definition.edges.forEach((edge) => {
    const sourceNode = definition.nodes.find((n) => n.id === edge.source);
    const targetNode = definition.nodes.find((n) => n.id === edge.target);

    if (!sourceNode) {
      errors.push(`Edge ${edge.id} references non-existent source node ${edge.source}`);
    }

    if (!targetNode) {
      errors.push(`Edge ${edge.id} references non-existent target node ${edge.target}`);
    }

    // Start nodes shouldn't have incoming edges
    if (targetNode && targetNode.type === 'start') {
      errors.push('Start nodes cannot have incoming connections');
    }

    // End nodes shouldn't have outgoing edges
    if (sourceNode && sourceNode.type === 'end') {
      errors.push('End nodes cannot have outgoing connections');
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check for circular dependencies in workflow
 */
function hasCircularDependency(definition: WorkflowDefinition): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  // Build adjacency list
  const adjacencyList: Record<string, string[]> = {};
  definition.nodes.forEach((node) => {
    adjacencyList[node.id] = [];
  });

  definition.edges.forEach((edge) => {
    if (adjacencyList[edge.source]) {
      adjacencyList[edge.source].push(edge.target);
    }
  });

  // DFS to detect cycles
  function hasCycleDFS(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) {
      return true; // Found a cycle
    }

    if (visited.has(nodeId)) {
      return false; // Already processed
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList[nodeId] || [];
    for (const neighbor of neighbors) {
      if (hasCycleDFS(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  // Check each node
  for (const node of definition.nodes) {
    if (!visited.has(node.id)) {
      if (hasCycleDFS(node.id)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Generate execution plan from workflow definition
 */
export function generateExecutionPlan(definition: WorkflowDefinition): {
  executionOrder: string[];
  dependencies: Record<string, string[]>;
  parallelGroups: string[][];
} {
  const dependencies: Record<string, string[]> = {};
  const incomingCount: Record<string, number> = {};

  // Initialize
  definition.nodes.forEach((node) => {
    dependencies[node.id] = [];
    incomingCount[node.id] = 0;
  });

  // Build dependencies
  definition.edges.forEach((edge) => {
    dependencies[edge.target].push(edge.source);
    incomingCount[edge.target]++;
  });

  // Topological sort to get execution order
  const executionOrder: string[] = [];
  const queue: string[] = [];
  const parallelGroups: string[][] = [];

  // Find start nodes (no incoming edges)
  definition.nodes.forEach((node) => {
    if (incomingCount[node.id] === 0) {
      queue.push(node.id);
    }
  });

  while (queue.length > 0) {
    const currentLevel = [...queue];
    parallelGroups.push(currentLevel);
    queue.length = 0;

    for (const nodeId of currentLevel) {
      executionOrder.push(nodeId);

      // Process outgoing edges
      definition.edges
        .filter((edge) => edge.source === nodeId)
        .forEach((edge) => {
          incomingCount[edge.target]--;
          if (incomingCount[edge.target] === 0) {
            queue.push(edge.target);
          }
        });
    }
  }

  return {
    executionOrder,
    dependencies,
    parallelGroups,
  };
}

/**
 * Calculate workflow metrics
 */
export function calculateWorkflowMetrics(definition: WorkflowDefinition): {
  totalNodes: number;
  totalEdges: number;
  complexity: number;
  estimatedDuration: number; // in minutes
  nodeTypes: Record<string, number>;
} {
  const nodeTypes: Record<string, number> = {};

  definition.nodes.forEach((node) => {
    nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
  });

  // Simple complexity calculation based on nodes, edges, and branching
  const branchingNodes = definition.nodes.filter((node) =>
    ['condition', 'approval'].includes(node.type)
  ).length;

  const complexity = definition.nodes.length + definition.edges.length + branchingNodes * 2;

  // Estimate duration based on node types (rough estimates)
  const nodeDurations: Record<string, number> = {
    start: 0,
    end: 0,
    task: 5,
    approval: 60, // 1 hour average for approvals
    condition: 0.1,
    ai_agent: 2,
    human_task: 15,
    api_call: 1,
    webhook: 0.5,
  };

  const estimatedDuration = definition.nodes.reduce((total, node) => {
    return total + (nodeDurations[node.type] || 5);
  }, 0);

  return {
    totalNodes: definition.nodes.length,
    totalEdges: definition.edges.length,
    complexity,
    estimatedDuration,
    nodeTypes,
  };
}