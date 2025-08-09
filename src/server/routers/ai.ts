import { z } from 'zod';
import { router, tenantProtectedProcedure, createPermissionProcedure } from '../trpc';
import { aiAgentTasks, workflowExecutions, workflows, users } from '@/db/schema';
import { eq, and, desc, count } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

const aiReadProcedure = createPermissionProcedure('ai:read');
const aiWriteProcedure = createPermissionProcedure('ai:write');

export const aiRouter = router({
  /**
   * List AI agent tasks
   */
  list: aiReadProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z
          .enum(['pending', 'running', 'completed', 'failed', 'cancelled'])
          .optional(),
        taskType: z.string().optional(),
        executionId: z.string().uuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let whereClause = and(
        eq(workflows.tenantId, ctx.tenant.tenantId)
      );

      if (input.status) {
        whereClause = and(
          whereClause,
          eq(aiAgentTasks.status, input.status)
        );
      }

      if (input.taskType) {
        whereClause = and(
          whereClause,
          eq(aiAgentTasks.taskType, input.taskType)
        );
      }

      if (input.executionId) {
        whereClause = and(
          whereClause,
          eq(aiAgentTasks.executionId, input.executionId)
        );
      }

      const tasks = await ctx.db
        .select({
          id: aiAgentTasks.id,
          taskType: aiAgentTasks.taskType,
          status: aiAgentTasks.status,
          title: aiAgentTasks.title,
          description: aiAgentTasks.description,
          priority: aiAgentTasks.priority,
          progress: aiAgentTasks.progress,
          createdAt: aiAgentTasks.createdAt,
          startedAt: aiAgentTasks.startedAt,
          completedAt: aiAgentTasks.completedAt,
          execution: {
            id: workflowExecutions.id,
            status: workflowExecutions.status,
          },
          workflow: {
            id: workflows.id,
            name: workflows.name,
            category: workflows.category,
          },
          requestedBy: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(aiAgentTasks)
        .innerJoin(workflowExecutions, eq(aiAgentTasks.executionId, workflowExecutions.id))
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .leftJoin(users, eq(aiAgentTasks.requestedBy, users.id))
        .where(whereClause)
        .orderBy(desc(aiAgentTasks.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return tasks;
    }),

  /**
   * Get AI task by ID
   */
  getById: aiReadProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.db
        .select({
          id: aiAgentTasks.id,
          taskType: aiAgentTasks.taskType,
          status: aiAgentTasks.status,
          title: aiAgentTasks.title,
          description: aiAgentTasks.description,
          priority: aiAgentTasks.priority,
          inputs: aiAgentTasks.inputs,
          outputs: aiAgentTasks.outputs,
          error: aiAgentTasks.error,
          progress: aiAgentTasks.progress,
          metadata: aiAgentTasks.metadata,
          createdAt: aiAgentTasks.createdAt,
          startedAt: aiAgentTasks.startedAt,
          completedAt: aiAgentTasks.completedAt,
          execution: {
            id: workflowExecutions.id,
            status: workflowExecutions.status,
            inputs: workflowExecutions.inputs,
          },
          workflow: {
            id: workflows.id,
            name: workflows.name,
            description: workflows.description,
            category: workflows.category,
          },
          requestedBy: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(aiAgentTasks)
        .innerJoin(workflowExecutions, eq(aiAgentTasks.executionId, workflowExecutions.id))
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .leftJoin(users, eq(aiAgentTasks.requestedBy, users.id))
        .where(
          and(
            eq(aiAgentTasks.id, input.id),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'AI task not found',
        });
      }

      return task;
    }),

  /**
   * Create AI agent task
   */
  create: aiWriteProcedure
    .input(
      z.object({
        executionId: z.string().uuid(),
        taskType: z.string(),
        title: z.string(),
        description: z.string().optional(),
        priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
        inputs: z.record(z.any()).default({}),
        metadata: z.record(z.any()).default({}),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify execution exists and user has access
      const execution = await ctx.db
        .select({ id: workflowExecutions.id })
        .from(workflowExecutions)
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .where(
          and(
            eq(workflowExecutions.id, input.executionId),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!execution) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Workflow execution not found',
        });
      }

      // Create AI task
      const [task] = await ctx.db
        .insert(aiAgentTasks)
        .values({
          ...input,
          requestedBy: ctx.session.user.id,
          status: 'pending',
          progress: 0,
          outputs: {},
          error: null,
        })
        .returning();

      // TODO: Queue the AI task for processing

      return task;
    }),

  /**
   * Cancel AI task
   */
  cancel: aiWriteProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        reason: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if task exists and can be cancelled
      const task = await ctx.db
        .select({
          id: aiAgentTasks.id,
          status: aiAgentTasks.status,
        })
        .from(aiAgentTasks)
        .innerJoin(workflowExecutions, eq(aiAgentTasks.executionId, workflowExecutions.id))
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .where(
          and(
            eq(aiAgentTasks.id, input.id),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'AI task not found',
        });
      }

      // Check if task can be cancelled
      const cancellableStates = ['pending', 'running'];
      if (!cancellableStates.includes(task.status)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot cancel task in ${task.status} state`,
        });
      }

      // Update task status
      const [cancelledTask] = await ctx.db
        .update(aiAgentTasks)
        .set({
          status: 'cancelled',
          completedAt: new Date(),
          error: input.reason ? `Cancelled: ${input.reason}` : 'Cancelled by user',
        })
        .where(eq(aiAgentTasks.id, input.id))
        .returning();

      // TODO: Signal AI processing system to cancel the task

      return cancelledTask;
    }),

  /**
   * Get AI task types and capabilities
   */
  getCapabilities: aiReadProcedure.query(async () => {
    // Return available AI task types and their capabilities
    return {
      taskTypes: [
        {
          type: 'text_analysis',
          name: 'Text Analysis',
          description: 'Analyze and extract insights from text content',
          capabilities: ['sentiment', 'entities', 'keywords', 'classification'],
        },
        {
          type: 'content_generation',
          name: 'Content Generation',
          description: 'Generate text content based on prompts and templates',
          capabilities: ['articles', 'summaries', 'emails', 'reports'],
        },
        {
          type: 'data_processing',
          name: 'Data Processing',
          description: 'Process and transform data using AI models',
          capabilities: ['cleanup', 'enrichment', 'categorization', 'validation'],
        },
        {
          type: 'image_analysis',
          name: 'Image Analysis',
          description: 'Analyze and extract information from images',
          capabilities: ['ocr', 'object_detection', 'classification', 'description'],
        },
        {
          type: 'workflow_optimization',
          name: 'Workflow Optimization',
          description: 'Analyze and suggest workflow improvements',
          capabilities: ['bottleneck_detection', 'efficiency_analysis', 'recommendations'],
        },
      ],
      models: [
        {
          provider: 'openai',
          models: ['gpt-4', 'gpt-3.5-turbo', 'text-davinci-003'],
        },
        {
          provider: 'anthropic',
          models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
        },
        {
          provider: 'huggingface',
          models: ['bert-base-uncased', 'distilbert-base-uncased'],
        },
      ],
    };
  }),

  /**
   * Get AI task statistics
   */
  getStats: aiReadProcedure
    .input(
      z.object({
        days: z.number().min(1).max(365).default(30),
        taskType: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let whereClause = and(
        eq(workflows.tenantId, ctx.tenant.tenantId)
      );

      if (input.taskType) {
        whereClause = and(
          whereClause,
          eq(aiAgentTasks.taskType, input.taskType)
        );
      }

      // Add date filter for last N days
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const stats = await ctx.db
        .select({
          status: aiAgentTasks.status,
          count: count(aiAgentTasks.id),
        })
        .from(aiAgentTasks)
        .innerJoin(workflowExecutions, eq(aiAgentTasks.executionId, workflowExecutions.id))
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .where(whereClause)
        .groupBy(aiAgentTasks.status);

      // Calculate totals
      const total = stats.reduce((sum, stat) => sum + Number(stat.count), 0);
      const completed = stats.find(s => s.status === 'completed')?.count || 0;
      const failed = stats.find(s => s.status === 'failed')?.count || 0;
      const running = stats.find(s => s.status === 'running')?.count || 0;
      const pending = stats.find(s => s.status === 'pending')?.count || 0;

      return {
        total: Number(total),
        completed: Number(completed),
        failed: Number(failed),
        running: Number(running),
        pending: Number(pending),
        successRate: total > 0 ? Number(completed) / Number(total) : 0,
        byStatus: stats.map(s => ({
          status: s.status,
          count: Number(s.count),
        })),
      };
    }),

  /**
   * Get task output/results
   */
  getResults: aiReadProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.db
        .select({
          id: aiAgentTasks.id,
          status: aiAgentTasks.status,
          outputs: aiAgentTasks.outputs,
          error: aiAgentTasks.error,
        })
        .from(aiAgentTasks)
        .innerJoin(workflowExecutions, eq(aiAgentTasks.executionId, workflowExecutions.id))
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .where(
          and(
            eq(aiAgentTasks.id, input.id),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'AI task not found',
        });
      }

      return {
        id: task.id,
        status: task.status,
        outputs: task.outputs,
        error: task.error,
      };
    }),
});