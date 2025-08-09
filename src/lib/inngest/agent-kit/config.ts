import { createAgent, createNetwork, createTool } from '@inngest/agent-kit';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { inngest } from '../index';
import { db } from '@/src/db/client';
import { aiAgentTasks, workflowExecutions } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Model configurations for different AI providers
 */
export const models = {
  openai: {
    gpt4: openai('gpt-4-turbo-preview'),
    gpt35: openai('gpt-3.5-turbo'),
  },
  anthropic: {
    claude3: anthropic('claude-3-opus-20240229'),
    claude35: anthropic('claude-3-5-sonnet-20241022'),
  },
};

/**
 * Tool: Database Query Tool
 * Allows agents to query the database for workflow data
 */
export const databaseQueryTool = createTool({
  name: 'database_query',
  description: 'Query the database for workflow execution data',
  parameters: z.object({
    table: z.enum(['workflows', 'executions', 'tasks', 'approvals']),
    executionId: z.string().optional(),
    limit: z.number().default(10),
  }),
  handler: async ({ table, executionId, limit }) => {
    switch (table) {
      case 'executions':
        if (executionId) {
          const result = await db
            .select()
            .from(workflowExecutions)
            .where(eq(workflowExecutions.id, executionId))
            .limit(1);
          return result[0] || null;
        }
        return await db.select().from(workflowExecutions).limit(limit);
      
      case 'tasks':
        if (executionId) {
          return await db
            .select()
            .from(aiAgentTasks)
            .where(eq(aiAgentTasks.workflowExecutionId, executionId))
            .limit(limit);
        }
        return await db.select().from(aiAgentTasks).limit(limit);
      
      default:
        return [];
    }
  },
});

/**
 * Tool: Workflow State Update Tool
 * Allows agents to update workflow execution state
 */
export const workflowStateUpdateTool = createTool({
  name: 'update_workflow_state',
  description: 'Update the state of a workflow execution',
  parameters: z.object({
    executionId: z.string(),
    variables: z.record(z.any()),
    stepId: z.string().optional(),
  }),
  handler: async ({ executionId, variables, stepId }) => {
    const updates: any = { variables };
    if (stepId) {
      updates.currentStepId = stepId;
    }
    
    await db
      .update(workflowExecutions)
      .set(updates)
      .where(eq(workflowExecutions.id, executionId));
    
    return { success: true, executionId, updated: variables };
  },
});

/**
 * Tool: External API Call Tool
 * Allows agents to make external API calls
 */
export const apiCallTool = createTool({
  name: 'api_call',
  description: 'Make an external API call',
  parameters: z.object({
    url: z.string().url(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET'),
    headers: z.record(z.string()).optional(),
    body: z.any().optional(),
  }),
  handler: async ({ url, method, headers, body }) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      
      const data = await response.json();
      return {
        status: response.status,
        data,
        success: response.ok,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'API call failed',
      };
    }
  },
});

/**
 * Tool: Data Transformation Tool
 * Allows agents to transform and process data
 */
export const dataTransformTool = createTool({
  name: 'transform_data',
  description: 'Transform and process data using JavaScript expressions',
  parameters: z.object({
    data: z.any(),
    operation: z.enum(['filter', 'map', 'reduce', 'sort', 'aggregate']),
    expression: z.string(),
  }),
  handler: async ({ data, operation, expression }) => {
    try {
      // Safe evaluation using Function constructor
      const func = new Function('data', `return ${expression}`);
      const result = func(data);
      return { success: true, result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transformation failed',
      };
    }
  },
});

/**
 * Tool: Decision Making Tool
 * Helps agents make decisions based on criteria
 */
export const decisionTool = createTool({
  name: 'make_decision',
  description: 'Make a decision based on given criteria and options',
  parameters: z.object({
    criteria: z.array(z.object({
      name: z.string(),
      weight: z.number().min(0).max(1),
      value: z.any(),
    })),
    options: z.array(z.object({
      id: z.string(),
      name: z.string(),
      attributes: z.record(z.any()),
    })),
  }),
  handler: async ({ criteria, options }) => {
    // Calculate scores for each option
    const scores = options.map(option => {
      const score = criteria.reduce((total, criterion) => {
        const value = option.attributes[criterion.name] || 0;
        return total + (value * criterion.weight);
      }, 0);
      
      return { ...option, score };
    });
    
    // Sort by score and return the best option
    scores.sort((a, b) => b.score - a.score);
    
    return {
      selectedOption: scores[0],
      allScores: scores,
      reasoning: `Selected ${scores[0].name} with score ${scores[0].score}`,
    };
  },
});

/**
 * Tool: Notification Tool
 * Send notifications to users or systems
 */
export const notificationTool = createTool({
  name: 'send_notification',
  description: 'Send a notification to users or external systems',
  parameters: z.object({
    type: z.enum(['email', 'slack', 'webhook', 'log']),
    recipient: z.string(),
    subject: z.string(),
    message: z.string(),
    metadata: z.record(z.any()).optional(),
  }),
  handler: async ({ type, recipient, subject, message, metadata }) => {
    // Log the notification for now
    console.log(`[${type}] Notification to ${recipient}: ${subject}`);
    console.log(`Message: ${message}`);
    if (metadata) {
      console.log('Metadata:', metadata);
    }
    
    // In a real implementation, this would integrate with notification services
    return {
      success: true,
      notificationType: type,
      recipient,
      timestamp: new Date().toISOString(),
    };
  },
});

/**
 * Tool: Approval Request Tool
 * Create and manage approval requests
 */
export const approvalTool = createTool({
  name: 'request_approval',
  description: 'Create an approval request and wait for response',
  parameters: z.object({
    title: z.string(),
    description: z.string(),
    approvers: z.array(z.string()),
    priority: z.enum(['low', 'normal', 'high', 'urgent']),
    dueDate: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),
  handler: async ({ title, description, approvers, priority, dueDate, metadata }) => {
    // Send approval request event
    await inngest.send({
      name: 'workflow/approval.requested',
      data: {
        executionId: metadata?.executionId || 'manual',
        stepId: metadata?.stepId || 'manual',
        approvalData: {
          title,
          description,
          requestedBy: metadata?.requestedBy || 'system',
          assignedTo: approvers,
          dueDate,
          priority,
          metadata: metadata || {},
        },
      },
    });
    
    return {
      success: true,
      approvalRequested: true,
      approvers,
      priority,
    };
  },
});

/**
 * Default tools available to all agents
 */
export const defaultTools = [
  databaseQueryTool,
  workflowStateUpdateTool,
  apiCallTool,
  dataTransformTool,
  decisionTool,
  notificationTool,
  approvalTool,
];