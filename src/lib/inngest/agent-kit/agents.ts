import { createAgent } from '@inngest/agent-kit';
import { models, defaultTools } from './config';

/**
 * Data Analyst Agent
 * Specializes in analyzing workflow data and generating insights
 */
export const dataAnalystAgent = createAgent({
  name: 'data_analyst',
  description: 'Analyzes workflow execution data and provides insights',
  model: models.openai.gpt4,
  tools: defaultTools,
  system: `You are a data analyst agent specialized in workflow analytics.
Your responsibilities include:
- Analyzing workflow execution patterns
- Identifying bottlenecks and inefficiencies
- Generating performance reports
- Providing data-driven recommendations
- Monitoring key metrics and KPIs

Always provide clear, actionable insights based on data analysis.`,
  onStart: async ({ input, state }) => {
    console.log('[Data Analyst] Starting analysis:', input);
    return { ...state, startTime: Date.now() };
  },
  onFinish: async ({ output, state }) => {
    const duration = Date.now() - (state.startTime || 0);
    console.log(`[Data Analyst] Completed in ${duration}ms`);
    return output;
  },
});

/**
 * Task Executor Agent
 * Handles execution of various workflow tasks
 */
export const taskExecutorAgent = createAgent({
  name: 'task_executor',
  description: 'Executes workflow tasks and manages task lifecycle',
  model: models.openai.gpt35,
  tools: defaultTools,
  system: `You are a task execution agent responsible for managing workflow tasks.
Your responsibilities include:
- Executing assigned tasks efficiently
- Managing task dependencies
- Handling task failures and retries
- Updating task status and progress
- Coordinating with other agents when needed

Focus on reliable and efficient task execution.`,
  maxRetries: 3,
  onError: async ({ error, state, retryCount }) => {
    console.error(`[Task Executor] Error (attempt ${retryCount}):`, error);
    if (retryCount < 3) {
      return { retry: true, delay: 1000 * retryCount };
    }
    return { retry: false };
  },
});

/**
 * Decision Maker Agent
 * Makes intelligent decisions based on workflow context
 */
export const decisionMakerAgent = createAgent({
  name: 'decision_maker',
  description: 'Makes strategic decisions for workflow routing and optimization',
  model: models.anthropic.claude35,
  tools: defaultTools,
  system: `You are a decision-making agent that determines optimal workflow paths.
Your responsibilities include:
- Evaluating conditional logic in workflows
- Choosing optimal execution paths
- Making risk-based decisions
- Prioritizing tasks and resources
- Resolving conflicts and ambiguities

Make decisions based on data, context, and defined business rules.`,
  dynamicSystemPrompt: async ({ input, state }) => {
    const context = state.workflowContext || {};
    return `Current workflow context: ${JSON.stringify(context)}
Priority level: ${input.priority || 'normal'}
Make optimal decisions considering the current context and priority.`;
  },
});

/**
 * Content Generator Agent
 * Generates content and documents based on workflow data
 */
export const contentGeneratorAgent = createAgent({
  name: 'content_generator',
  description: 'Generates reports, documents, and content from workflow data',
  model: models.openai.gpt4,
  tools: defaultTools,
  system: `You are a content generation agent that creates documents and reports.
Your responsibilities include:
- Generating comprehensive reports
- Creating documentation
- Summarizing workflow outcomes
- Producing formatted output
- Ensuring content quality and accuracy

Generate clear, professional, and well-structured content.`,
  outputFormat: 'structured',
});

/**
 * Quality Assurance Agent
 * Validates and ensures quality of workflow executions
 */
export const qaAgent = createAgent({
  name: 'quality_assurance',
  description: 'Validates workflow outputs and ensures quality standards',
  model: models.anthropic.claude3,
  tools: defaultTools,
  system: `You are a quality assurance agent that validates workflow executions.
Your responsibilities include:
- Validating task outputs
- Checking for errors and inconsistencies
- Ensuring compliance with standards
- Performing data validation
- Generating quality reports

Maintain high standards of quality and accuracy in all validations.`,
  validateOutput: async ({ output }) => {
    // Custom validation logic
    if (!output || typeof output !== 'object') {
      throw new Error('Invalid output format');
    }
    return true;
  },
});

/**
 * Integration Agent
 * Handles external system integrations
 */
export const integrationAgent = createAgent({
  name: 'integration_specialist',
  description: 'Manages integrations with external systems and APIs',
  model: models.openai.gpt35,
  tools: defaultTools,
  system: `You are an integration agent that connects with external systems.
Your responsibilities include:
- Making API calls to external services
- Transforming data between formats
- Handling authentication and authorization
- Managing webhooks and callbacks
- Ensuring reliable data synchronization

Focus on reliable and secure integrations.`,
  timeout: 30000, // 30 second timeout for external calls
});

/**
 * Monitoring Agent
 * Monitors workflow health and performance
 */
export const monitoringAgent = createAgent({
  name: 'monitoring',
  description: 'Monitors workflow health, performance, and alerts',
  model: models.openai.gpt35,
  tools: defaultTools,
  system: `You are a monitoring agent that tracks workflow health and performance.
Your responsibilities include:
- Monitoring execution metrics
- Detecting anomalies and issues
- Sending alerts and notifications
- Tracking SLAs and performance
- Generating health reports

Proactively identify and report issues before they become critical.`,
  schedule: '*/5 * * * *', // Run every 5 minutes
});

/**
 * Approval Coordinator Agent
 * Manages approval workflows and decision tracking
 */
export const approvalCoordinatorAgent = createAgent({
  name: 'approval_coordinator',
  description: 'Coordinates approval requests and tracks decisions',
  model: models.anthropic.claude35,
  tools: defaultTools,
  system: `You are an approval coordination agent that manages approval workflows.
Your responsibilities include:
- Creating and routing approval requests
- Tracking approval status and deadlines
- Escalating overdue approvals
- Documenting approval decisions
- Ensuring compliance with approval policies

Maintain clear audit trails and ensure timely decision-making.`,
  onApprovalReceived: async ({ approval, state }) => {
    console.log('[Approval Coordinator] Approval received:', approval);
    return { ...state, lastApproval: approval };
  },
});

/**
 * Error Handler Agent
 * Specializes in error recovery and fault tolerance
 */
export const errorHandlerAgent = createAgent({
  name: 'error_handler',
  description: 'Handles errors, implements recovery strategies, and ensures resilience',
  model: models.openai.gpt4,
  tools: defaultTools,
  system: `You are an error handling agent that manages failures and recovery.
Your responsibilities include:
- Analyzing error patterns and root causes
- Implementing recovery strategies
- Determining retry policies
- Escalating critical issues
- Documenting error resolutions

Focus on system resilience and quick recovery from failures.`,
  errorStrategy: 'exponential_backoff',
  maxRetries: 5,
});

/**
 * Orchestrator Agent
 * Main coordinator for complex multi-agent workflows
 */
export const orchestratorAgent = createAgent({
  name: 'orchestrator',
  description: 'Orchestrates complex multi-agent workflows',
  model: models.anthropic.claude35,
  tools: defaultTools,
  system: `You are the main orchestrator agent that coordinates multi-agent workflows.
Your responsibilities include:
- Planning workflow execution strategies
- Coordinating multiple agents
- Managing agent dependencies
- Optimizing resource allocation
- Ensuring workflow completion

Think strategically about workflow optimization and agent coordination.`,
  agents: [
    dataAnalystAgent,
    taskExecutorAgent,
    decisionMakerAgent,
    contentGeneratorAgent,
    qaAgent,
    integrationAgent,
    monitoringAgent,
    approvalCoordinatorAgent,
    errorHandlerAgent,
  ],
  routingStrategy: 'dynamic',
});