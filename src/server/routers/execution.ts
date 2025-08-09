import { z } from 'zod';
import { router, tenantProtectedProcedure, createPermissionProcedure } from '../trpc';
import { workflowExecutions, workflows, users } from '@/db/schema';
import { eq, and, desc, count } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { inngest } from '@/lib/inngest';

const executionReadProcedure = createPermissionProcedure('execution:read');
const executionCancelProcedure = createPermissionProcedure('execution:cancel');

export const executionRouter = router({
  /**
   * List workflow executions
   */
  list: executionReadProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        workflowId: z.string().uuid().optional(),
        status: z
          .enum([
            'pending',
            'running',
            'completed',
            'failed',
            'cancelled',
            'waiting_approval',
          ])
          .optional(),
        priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let whereClause = and(
        eq(workflows.tenantId, ctx.tenant.tenantId)
      );

      if (input.workflowId) {
        whereClause = and(
          whereClause,
          eq(workflowExecutions.workflowId, input.workflowId)
        );
      }

      if (input.status) {
        whereClause = and(
          whereClause,
          eq(workflowExecutions.status, input.status)
        );
      }

      if (input.priority) {
        whereClause = and(
          whereClause,
          eq(workflowExecutions.priority, input.priority)
        );
      }

      const executions = await ctx.db
        .select({
          id: workflowExecutions.id,
          status: workflowExecutions.status,
          priority: workflowExecutions.priority,
          inputs: workflowExecutions.inputs,
          outputs: workflowExecutions.outputs,
          error: workflowExecutions.error,
          createdAt: workflowExecutions.createdAt,
          startedAt: workflowExecutions.startedAt,
          completedAt: workflowExecutions.completedAt,
          workflow: {
            id: workflows.id,
            name: workflows.name,
            category: workflows.category,
          },
          createdBy: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(workflowExecutions)
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .leftJoin(users, eq(workflowExecutions.createdBy, users.id))
        .where(whereClause)
        .orderBy(desc(workflowExecutions.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return executions;
    }),

  /**
   * Get execution by ID
   */
  getById: executionReadProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const execution = await ctx.db
        .select({
          id: workflowExecutions.id,
          workflowId: workflowExecutions.workflowId,
          status: workflowExecutions.status,
          priority: workflowExecutions.priority,
          inputs: workflowExecutions.inputs,
          outputs: workflowExecutions.outputs,
          error: workflowExecutions.error,
          createdAt: workflowExecutions.createdAt,
          startedAt: workflowExecutions.startedAt,
          completedAt: workflowExecutions.completedAt,
          cancelledAt: workflowExecutions.cancelledAt,
          workflow: {
            id: workflows.id,
            name: workflows.name,
            description: workflows.description,
            category: workflows.category,
            definition: workflows.definition,
          },
          createdBy: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(workflowExecutions)
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .leftJoin(users, eq(workflowExecutions.createdBy, users.id))
        .where(
          and(
            eq(workflowExecutions.id, input.id),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!execution) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Execution not found',
        });
      }

      return execution;
    }),

  /**
   * Cancel execution
   */
  cancel: executionCancelProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        reason: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if execution exists and can be cancelled
      const execution = await ctx.db
        .select({
          id: workflowExecutions.id,
          status: workflowExecutions.status,
          workflowId: workflowExecutions.workflowId,
        })
        .from(workflowExecutions)
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .where(
          and(
            eq(workflowExecutions.id, input.id),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!execution) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Execution not found',
        });
      }

      // Check if execution can be cancelled
      const cancellableStates = ['pending', 'running', 'waiting_approval'];
      if (!cancellableStates.includes(execution.status)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot cancel execution in ${execution.status} state`,
        });
      }

      // Update execution status
      const [cancelledExecution] = await ctx.db
        .update(workflowExecutions)
        .set({
          status: 'cancelled',
          cancelledAt: new Date(),
          cancelledBy: ctx.session.user.id,
          error: input.reason ? `Cancelled: ${input.reason}` : 'Cancelled by user',
        })
        .where(eq(workflowExecutions.id, input.id))
        .returning();

      // TODO: Signal workflow engine to cancel the execution

      return cancelledExecution;
    }),

  /**
   * Retry failed execution
   */
  retry: executionCancelProcedure // Using same permission as cancel for now
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Get the failed execution
      const execution = await ctx.db
        .select()
        .from(workflowExecutions)
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .where(
          and(
            eq(workflowExecutions.id, input.id),
            eq(workflows.tenantId, ctx.tenant.tenantId),
            eq(workflowExecutions.status, 'failed')
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!execution) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Failed execution not found',
        });
      }

      // Create new execution with same parameters
      const [newExecution] = await ctx.db
        .insert(workflowExecutions)
        .values({
          workflowId: execution.workflow_executions.workflowId,
          createdBy: ctx.session.user.id,
          status: 'pending',
          triggerType: 'manual',
          triggerData: {
            userId: ctx.session.user.id,
            retryOf: execution.workflow_executions.id,
          },
          input: execution.workflow_executions.input,
          output: {},
          variables: execution.workflow_executions.variables,
          priority: execution.workflow_executions.priority,
        })
        .returning();

      // Queue the execution with Inngest
      try {
        await inngest.send({
          name: 'workflow/execute',
          data: {
            executionId: newExecution.id,
            workflowId: execution.workflow_executions.workflowId,
            tenantId: ctx.tenant.tenantId,
            userId: ctx.session.user.id,
            inputs: execution.workflow_executions.input || {},
            priority: getPriorityString(execution.workflow_executions.priority),
          },
        });
      } catch (error) {
        console.error('Failed to queue workflow retry:', error);
        
        // Update execution status to failed
        await ctx.db
          .update(workflowExecutions)
          .set({
            status: 'failed',
            error: 'Failed to queue retry execution',
          })
          .where(eq(workflowExecutions.id, newExecution.id));

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to queue retry execution',
        });
      }

      return newExecution;
    }),

  /**
   * Get execution logs/events
   */
  getLogs: executionReadProcedure
    .input(
      z.object({
        executionId: z.string().uuid(),
        limit: z.number().min(1).max(1000).default(100),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
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
          message: 'Execution not found',
        });
      }

      // TODO: Return actual execution logs from logging system
      // For now, return mock data
      return [
        {
          id: '1',
          timestamp: new Date(),
          level: 'info',
          message: 'Execution started',
          data: {},
        },
      ];
    }),

  /**
   * Get execution statistics
   */
  getStats: executionReadProcedure
    .input(
      z.object({
        workflowId: z.string().uuid().optional(),
        days: z.number().min(1).max(365).default(30),
      }),
    )
    .query(async ({ ctx, input }) => {
      let baseQuery = ctx.db
        .select({
          status: workflowExecutions.status,
          count: count(workflowExecutions.id),
        })
        .from(workflowExecutions)
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .where(eq(workflows.tenantId, ctx.tenant.tenantId))
        .groupBy(workflowExecutions.status);

      if (input.workflowId) {
        baseQuery = baseQuery.where(
          and(
            eq(workflows.tenantId, ctx.tenant.tenantId),
            eq(workflowExecutions.workflowId, input.workflowId)
          )
        );
      }

      // Add date filter for last N days
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);
      
      const stats = await baseQuery;

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
});

// Helper function to convert priority number to string
function getPriorityString(priority: number): 'low' | 'normal' | 'high' | 'urgent' {
  switch (priority) {
    case 1:
      return 'low';
    case 2:
      return 'normal';
    case 3:
      return 'high';
    case 4:
      return 'urgent';
    default:
      return 'normal';
  }
}