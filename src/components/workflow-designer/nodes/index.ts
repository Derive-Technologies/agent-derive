export { StartNode } from './StartNode';
export type { StartNodeData } from './StartNode';

export { EndNode } from './EndNode';
export type { EndNodeData } from './EndNode';

export { TaskNode } from './TaskNode';
export type { TaskNodeData } from './TaskNode';

export { ApprovalNode } from './ApprovalNode';
export type { ApprovalNodeData } from './ApprovalNode';

export { AIAgentNode } from './AIAgentNode';
export type { AIAgentNodeData } from './AIAgentNode';

export { ConditionalNode } from './ConditionalNode';
export type { ConditionalNodeData } from './ConditionalNode';

export { ParallelNode } from './ParallelNode';
export type { ParallelNodeData } from './ParallelNode';

// Node type mapping for React Flow
import { StartNode, EndNode, TaskNode, ApprovalNode, AIAgentNode, ConditionalNode, ParallelNode } from './';

export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  approval: ApprovalNode,
  ai_agent: AIAgentNode,
  conditional: ConditionalNode,
  parallel: ParallelNode,
};

// Union type for all node data types
export type WorkflowNodeData = 
  | StartNodeData
  | EndNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AIAgentNodeData
  | ConditionalNodeData
  | ParallelNodeData;