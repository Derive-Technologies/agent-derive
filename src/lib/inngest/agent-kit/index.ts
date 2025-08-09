/**
 * Inngest Agent Kit Integration
 * 
 * This module provides AI agent orchestration capabilities using Inngest Agent Kit.
 * It includes pre-configured agents, networks, tools, and functions for building
 * sophisticated AI-powered workflows.
 */

// Export configurations
export * from './config';

// Export agents
export * from './agents';

// Export networks
export * from './networks';

// Export functions
export * from './functions';

// Export examples
export * from './examples';

// Re-export commonly used types from Agent Kit
export {
  type Agent,
  type Network,
  type Tool,
  type Router,
  type AgentContext,
  type NetworkState,
  runAgent,
  runNetwork,
  createAgent,
  createNetwork,
  createTool,
  createRouter,
} from '@inngest/agent-kit';