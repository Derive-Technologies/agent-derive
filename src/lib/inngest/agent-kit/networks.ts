import { createNetwork, createRouter } from '@inngest/agent-kit';
import {
  dataAnalystAgent,
  taskExecutorAgent,
  decisionMakerAgent,
  contentGeneratorAgent,
  qaAgent,
  integrationAgent,
  monitoringAgent,
  approvalCoordinatorAgent,
  errorHandlerAgent,
  orchestratorAgent,
} from './agents';
import { models } from './config';

/**
 * Router for data processing workflows
 */
const dataProcessingRouter = createRouter({
  name: 'data_processing_router',
  description: 'Routes tasks in data processing workflows',
  model: models.openai.gpt35,
  agents: [dataAnalystAgent, taskExecutorAgent, integrationAgent, qaAgent],
  system: `You are a routing agent for data processing workflows.
Based on the current state and task requirements, route to:
- data_analyst: For data analysis and insights
- task_executor: For general task execution
- integration_specialist: For external data fetching
- quality_assurance: For data validation
Route to 'DONE' when the workflow is complete.`,
});

/**
 * Router for approval workflows
 */
const approvalRouter = createRouter({
  name: 'approval_router',
  description: 'Routes tasks in approval workflows',
  model: models.openai.gpt35,
  agents: [approvalCoordinatorAgent, decisionMakerAgent, taskExecutorAgent],
  system: `You are a routing agent for approval workflows.
Based on the current state, route to:
- approval_coordinator: For managing approval requests
- decision_maker: For automated decision making
- task_executor: For executing post-approval tasks
Route to 'DONE' when all approvals are complete.`,
});

/**
 * Router for error recovery workflows
 */
const errorRecoveryRouter = createRouter({
  name: 'error_recovery_router',
  description: 'Routes tasks for error recovery',
  model: models.openai.gpt35,
  agents: [errorHandlerAgent, monitoringAgent, taskExecutorAgent],
  system: `You are a routing agent for error recovery.
Based on the error type and severity, route to:
- error_handler: For error analysis and recovery
- monitoring: For system health checks
- task_executor: For retry attempts
Route to 'DONE' when the error is resolved or escalated.`,
});

/**
 * Data Processing Network
 * Handles complex data processing and analysis workflows
 */
export const dataProcessingNetwork = createNetwork({
  name: 'data_processing_network',
  description: 'Network for complex data processing and analysis',
  agents: [dataAnalystAgent, taskExecutorAgent, integrationAgent, qaAgent],
  router: dataProcessingRouter,
  defaultModel: models.openai.gpt4,
  maxIterations: 10,
  state: {
    processedData: [],
    insights: [],
    validationResults: {},
  },
  onStart: async ({ input, state }) => {
    console.log('[Data Processing Network] Starting with input:', input);
    return {
      ...state,
      startTime: Date.now(),
      inputData: input,
    };
  },
  onFinish: async ({ output, state }) => {
    const duration = Date.now() - (state.startTime || 0);
    console.log(`[Data Processing Network] Completed in ${duration}ms`);
    return {
      output,
      metrics: {
        duration,
        iterations: state.iterations || 0,
        dataProcessed: state.processedData?.length || 0,
      },
    };
  },
});

/**
 * Approval Workflow Network
 * Manages complex approval chains and decision workflows
 */
export const approvalWorkflowNetwork = createNetwork({
  name: 'approval_workflow_network',
  description: 'Network for managing approval workflows',
  agents: [approvalCoordinatorAgent, decisionMakerAgent, taskExecutorAgent],
  router: approvalRouter,
  defaultModel: models.anthropic.claude35,
  maxIterations: 5,
  state: {
    approvals: [],
    decisions: [],
    pendingApprovals: [],
  },
  timeout: 86400000, // 24 hours for approval workflows
  onApprovalReceived: async ({ approval, state }) => {
    return {
      ...state,
      approvals: [...(state.approvals || []), approval],
      pendingApprovals: state.pendingApprovals?.filter(
        (p: any) => p.id !== approval.id
      ),
    };
  },
});

/**
 * Integration Network
 * Handles complex multi-system integrations
 */
export const integrationNetwork = createNetwork({
  name: 'integration_network',
  description: 'Network for multi-system integrations',
  agents: [integrationAgent, dataAnalystAgent, qaAgent, errorHandlerAgent],
  router: createRouter({
    name: 'integration_router',
    model: models.openai.gpt35,
    agents: [integrationAgent, dataAnalystAgent, qaAgent, errorHandlerAgent],
    system: `Route integration tasks based on the current operation:
- integration_specialist: For API calls and data sync
- data_analyst: For data transformation and mapping
- quality_assurance: For validation
- error_handler: For error recovery
Route to 'DONE' when integration is complete.`,
  }),
  defaultModel: models.openai.gpt35,
  maxIterations: 15,
  retryPolicy: {
    maxRetries: 3,
    backoffMultiplier: 2,
    initialDelay: 1000,
  },
});

/**
 * Content Generation Network
 * Creates reports, documents, and content from workflow data
 */
export const contentGenerationNetwork = createNetwork({
  name: 'content_generation_network',
  description: 'Network for generating content and reports',
  agents: [contentGeneratorAgent, dataAnalystAgent, qaAgent],
  router: createRouter({
    name: 'content_router',
    model: models.openai.gpt35,
    agents: [contentGeneratorAgent, dataAnalystAgent, qaAgent],
    system: `Route content generation tasks:
- content_generator: For creating documents and reports
- data_analyst: For data preparation and analysis
- quality_assurance: For content validation
Route to 'DONE' when content is complete and validated.`,
  }),
  defaultModel: models.openai.gpt4,
  maxIterations: 5,
  outputFormat: 'markdown',
});

/**
 * Error Recovery Network
 * Specialized network for handling errors and recovery
 */
export const errorRecoveryNetwork = createNetwork({
  name: 'error_recovery_network',
  description: 'Network for error handling and recovery',
  agents: [errorHandlerAgent, monitoringAgent, taskExecutorAgent],
  router: errorRecoveryRouter,
  defaultModel: models.openai.gpt4,
  maxIterations: 5,
  state: {
    errors: [],
    recoveryAttempts: 0,
    resolved: false,
  },
  onError: async ({ error, state }) => {
    return {
      ...state,
      errors: [...(state.errors || []), error],
      recoveryAttempts: (state.recoveryAttempts || 0) + 1,
    };
  },
});

/**
 * Master Orchestration Network
 * The main network that orchestrates all other networks
 */
export const masterOrchestrationNetwork = createNetwork({
  name: 'master_orchestration_network',
  description: 'Master network for orchestrating complex multi-network workflows',
  agents: [orchestratorAgent],
  networks: [
    dataProcessingNetwork,
    approvalWorkflowNetwork,
    integrationNetwork,
    contentGenerationNetwork,
    errorRecoveryNetwork,
  ],
  router: createRouter({
    name: 'master_router',
    model: models.anthropic.claude35,
    agents: [orchestratorAgent],
    networks: [
      dataProcessingNetwork,
      approvalWorkflowNetwork,
      integrationNetwork,
      contentGenerationNetwork,
      errorRecoveryNetwork,
    ],
    system: `You are the master router orchestrating complex workflows.
Route to appropriate networks based on the task:
- data_processing_network: For data analysis and processing
- approval_workflow_network: For approval workflows
- integration_network: For external integrations
- content_generation_network: For report generation
- error_recovery_network: For error handling
- orchestrator: For high-level coordination
Route to 'DONE' when the entire workflow is complete.`,
  }),
  defaultModel: models.anthropic.claude35,
  maxIterations: 20,
  state: {
    workflowId: null,
    executionId: null,
    completedNetworks: [],
    results: {},
  },
  parallel: true, // Enable parallel network execution where possible
  onNetworkComplete: async ({ network, output, state }) => {
    console.log(`[Master] Network ${network} completed`);
    return {
      ...state,
      completedNetworks: [...(state.completedNetworks || []), network],
      results: {
        ...state.results,
        [network]: output,
      },
    };
  },
});

/**
 * Monitoring Network
 * Continuous monitoring and alerting network
 */
export const monitoringNetwork = createNetwork({
  name: 'monitoring_network',
  description: 'Network for continuous monitoring and alerting',
  agents: [monitoringAgent, dataAnalystAgent, errorHandlerAgent],
  router: createRouter({
    name: 'monitoring_router',
    model: models.openai.gpt35,
    agents: [monitoringAgent, dataAnalystAgent, errorHandlerAgent],
    system: `Route monitoring tasks:
- monitoring: For health checks and metrics
- data_analyst: For trend analysis
- error_handler: For issue resolution
Route to 'DONE' after monitoring cycle completes.`,
  }),
  defaultModel: models.openai.gpt35,
  maxIterations: 100, // Long-running monitoring
  schedule: '*/5 * * * *', // Run every 5 minutes
  state: {
    metrics: [],
    alerts: [],
    healthStatus: 'healthy',
  },
});