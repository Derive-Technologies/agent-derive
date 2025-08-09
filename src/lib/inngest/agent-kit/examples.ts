import { inngest } from '../index';
import { runAgent, runNetwork } from '@inngest/agent-kit';
import {
  dataAnalystAgent,
  taskExecutorAgent,
  contentGeneratorAgent,
  approvalCoordinatorAgent,
} from './agents';
import { dataProcessingNetwork, masterOrchestrationNetwork } from './networks';

/**
 * Example 1: Simple Data Analysis Task
 * Demonstrates basic agent usage for data analysis
 */
export const exampleDataAnalysis = inngest.createFunction(
  {
    id: 'example-data-analysis',
    name: 'Example: Simple Data Analysis',
  },
  { event: 'example/data.analysis' },
  async ({ event, step }) => {
    const { data } = event.data;

    // Run data analyst agent
    const analysis = await step.run('analyze', async () => {
      return await runAgent({
        agent: dataAnalystAgent,
        input: {
          task: 'analyze_sales_data',
          data,
          requirements: [
            'Identify top performing products',
            'Calculate growth trends',
            'Find seasonal patterns',
            'Generate insights and recommendations',
          ],
        },
      });
    });

    return analysis;
  }
);

/**
 * Example 2: Document Generation Workflow
 * Demonstrates content generation from data
 */
export const exampleDocumentGeneration = inngest.createFunction(
  {
    id: 'example-document-generation',
    name: 'Example: Document Generation',
  },
  { event: 'example/document.generate' },
  async ({ event, step }) => {
    const { templateType, data, format } = event.data;

    // Step 1: Analyze data
    const analysis = await step.run('analyze-data', async () => {
      return await runAgent({
        agent: dataAnalystAgent,
        input: {
          task: 'prepare_data_for_report',
          data,
          outputFormat: 'structured',
        },
      });
    });

    // Step 2: Generate document
    const document = await step.run('generate-document', async () => {
      return await runAgent({
        agent: contentGeneratorAgent,
        input: {
          template: templateType,
          data: analysis,
          format: format || 'markdown',
          sections: [
            'Executive Summary',
            'Key Findings',
            'Detailed Analysis',
            'Recommendations',
            'Appendix',
          ],
        },
      });
    });

    return {
      analysis,
      document,
    };
  }
);

/**
 * Example 3: Multi-Step Approval Workflow
 * Demonstrates approval coordination with multiple agents
 */
export const exampleApprovalWorkflow = inngest.createFunction(
  {
    id: 'example-approval-workflow',
    name: 'Example: Multi-Step Approval',
  },
  { event: 'example/approval.request' },
  async ({ event, step }) => {
    const { request, approvers } = event.data;

    // Step 1: Validate request
    const validation = await step.run('validate-request', async () => {
      return await runAgent({
        agent: taskExecutorAgent,
        input: {
          task: 'validate_approval_request',
          request,
          checks: ['completeness', 'compliance', 'budget'],
        },
      });
    });

    if (!validation.valid) {
      return { status: 'rejected', reason: validation.issues };
    }

    // Step 2: Coordinate approvals
    const approvalResult = await step.run('coordinate-approvals', async () => {
      return await runAgent({
        agent: approvalCoordinatorAgent,
        input: {
          request,
          approvers,
          escalationRules: {
            timeout: '48h',
            escalateTo: 'manager',
          },
        },
      });
    });

    // Step 3: Generate approval report
    const report = await step.run('generate-report', async () => {
      return await runAgent({
        agent: contentGeneratorAgent,
        input: {
          type: 'approval_summary',
          request,
          approvals: approvalResult,
          includeAuditTrail: true,
        },
      });
    });

    return {
      validation,
      approvals: approvalResult,
      report,
    };
  }
);

/**
 * Example 4: Complex Data Processing Pipeline
 * Demonstrates network usage for multi-agent collaboration
 */
export const exampleDataPipeline = inngest.createFunction(
  {
    id: 'example-data-pipeline',
    name: 'Example: Complex Data Pipeline',
  },
  { event: 'example/pipeline.start' },
  async ({ event, step }) => {
    const { source, transformations, destination } = event.data;

    // Run data processing network
    const result = await step.run('process-pipeline', async () => {
      return await runNetwork({
        network: dataProcessingNetwork,
        input: {
          source,
          transformations,
          destination,
          steps: [
            { type: 'extract', config: source },
            { type: 'transform', config: transformations },
            { type: 'validate', config: { strict: true } },
            { type: 'load', config: destination },
          ],
        },
        state: {
          pipelineId: event.data.pipelineId,
          startTime: Date.now(),
        },
      });
    });

    return result;
  }
);

/**
 * Example 5: Customer Support Automation
 * Demonstrates AI-powered customer support workflow
 */
export const exampleCustomerSupport = inngest.createFunction(
  {
    id: 'example-customer-support',
    name: 'Example: Customer Support Automation',
  },
  { event: 'example/support.ticket' },
  async ({ event, step }) => {
    const { ticket, customer, history } = event.data;

    // Step 1: Analyze ticket
    const analysis = await step.run('analyze-ticket', async () => {
      return await runAgent({
        agent: dataAnalystAgent,
        input: {
          task: 'analyze_support_ticket',
          ticket,
          customerHistory: history,
          classify: ['priority', 'category', 'sentiment'],
        },
      });
    });

    // Step 2: Generate response
    const response = await step.run('generate-response', async () => {
      return await runAgent({
        agent: contentGeneratorAgent,
        input: {
          task: 'draft_support_response',
          ticket,
          analysis,
          tone: 'professional_friendly',
          includeNextSteps: true,
        },
      });
    });

    // Step 3: Route if needed
    if (analysis.priority === 'high' || analysis.requiresHuman) {
      await step.run('escalate-to-human', async () => {
        return await runAgent({
          agent: taskExecutorAgent,
          input: {
            task: 'escalate_ticket',
            ticket,
            analysis,
            assignTo: 'support_team',
          },
        });
      });
    }

    return {
      analysis,
      response,
      routed: analysis.requiresHuman || false,
    };
  }
);

/**
 * Example 6: End-to-End Business Process
 * Demonstrates master orchestration for complex business workflows
 */
export const exampleBusinessProcess = inngest.createFunction(
  {
    id: 'example-business-process',
    name: 'Example: End-to-End Business Process',
  },
  { event: 'example/business.process' },
  async ({ event, step }) => {
    const { processType, inputs, config } = event.data;

    // Define the business process workflow
    const workflowDefinition = {
      id: `business-${processType}`,
      name: `Business Process: ${processType}`,
      steps: [
        {
          id: 'validation',
          type: 'validation',
          config: { strict: true },
        },
        {
          id: 'enrichment',
          type: 'data_enrichment',
          dependencies: ['validation'],
        },
        {
          id: 'approval',
          type: 'approval',
          dependencies: ['enrichment'],
          config: { levels: 2 },
        },
        {
          id: 'processing',
          type: 'core_processing',
          dependencies: ['approval'],
        },
        {
          id: 'notification',
          type: 'notification',
          dependencies: ['processing'],
        },
        {
          id: 'reporting',
          type: 'reporting',
          dependencies: ['processing'],
        },
      ],
    };

    // Run master orchestration
    const result = await step.run('orchestrate-process', async () => {
      return await runNetwork({
        network: masterOrchestrationNetwork,
        input: {
          workflowDefinition,
          inputs,
          config: {
            ...config,
            parallel: true,
            errorHandling: 'intelligent',
            monitoring: true,
          },
        },
      });
    });

    return result;
  }
);

/**
 * Example 7: Real-time Data Monitoring
 * Demonstrates continuous monitoring with alerts
 */
export const exampleRealtimeMonitoring = inngest.createFunction(
  {
    id: 'example-realtime-monitoring',
    name: 'Example: Real-time Monitoring',
  },
  { event: 'example/monitoring.check' },
  async ({ event, step }) => {
    const { metrics, thresholds, alertConfig } = event.data;

    // Analyze metrics
    const analysis = await step.run('analyze-metrics', async () => {
      return await runAgent({
        agent: dataAnalystAgent,
        input: {
          task: 'analyze_metrics',
          metrics,
          thresholds,
          detectAnomalies: true,
          timeWindow: '5m',
        },
      });
    });

    // Check for alerts
    if (analysis.anomalies?.length > 0 || analysis.thresholdViolations?.length > 0) {
      await step.run('send-alerts', async () => {
        return await runAgent({
          agent: taskExecutorAgent,
          input: {
            task: 'send_alerts',
            alerts: [
              ...analysis.anomalies.map((a: any) => ({
                type: 'anomaly',
                severity: a.severity,
                details: a,
              })),
              ...analysis.thresholdViolations.map((v: any) => ({
                type: 'threshold',
                severity: 'high',
                details: v,
              })),
            ],
            config: alertConfig,
          },
        });
      });
    }

    return {
      metrics: analysis.processedMetrics,
      health: analysis.healthScore,
      alerts: analysis.anomalies?.length + analysis.thresholdViolations?.length || 0,
    };
  }
);

/**
 * Example 8: Intelligent Task Routing
 * Demonstrates dynamic task routing based on context
 */
export const exampleIntelligentRouting = inngest.createFunction(
  {
    id: 'example-intelligent-routing',
    name: 'Example: Intelligent Task Routing',
  },
  { event: 'example/task.route' },
  async ({ event, step }) => {
    const { task, context, availableAgents } = event.data;

    // Determine best agent for the task
    const routing = await step.run('determine-routing', async () => {
      return await runAgent({
        agent: taskExecutorAgent,
        input: {
          task: 'determine_optimal_routing',
          taskDetails: task,
          context,
          availableAgents,
          criteria: ['expertise', 'availability', 'performance', 'cost'],
        },
      });
    });

    // Execute with selected agent
    const result = await step.run('execute-task', async () => {
      const selectedAgent = routing.selectedAgent;
      return await runAgent({
        agent: selectedAgent === 'analyst' ? dataAnalystAgent : 
               selectedAgent === 'generator' ? contentGeneratorAgent :
               taskExecutorAgent,
        input: task,
      });
    });

    return {
      routing,
      result,
      performance: {
        duration: Date.now() - event.ts,
        agentUsed: routing.selectedAgent,
      },
    };
  }
);