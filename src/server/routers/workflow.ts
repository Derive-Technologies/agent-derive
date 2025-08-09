import { z } from 'zod';
import { router, tenantProtectedProcedure, createPermissionProcedure } from '../trpc';
import { workflows, workflowExecutions, users } from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { inngest } from '@/lib/inngest';

const workflowReadProcedure = createPermissionProcedure('workflow:read');
const workflowWriteProcedure = createPermissionProcedure('workflow:write');
const workflowExecuteProcedure = createPermissionProcedure('workflow:execute');
const workflowDeleteProcedure = createPermissionProcedure('workflow:delete');

export const workflowRouter = router({
  /**
   * List workflows
   */
  list: workflowReadProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z.enum(['draft', 'active', 'inactive', 'archived']).optional(),
        category: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .select({
          id: workflows.id,
          name: workflows.name,
          description: workflows.description,
          status: workflows.status,
          category: workflows.category,
          version: workflows.version,
          isTemplate: workflows.isTemplate,
          createdAt: workflows.createdAt,
          updatedAt: workflows.updatedAt,
          createdBy: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(workflows)
        .leftJoin(users, eq(workflows.createdBy, users.id))
        .where(eq(workflows.tenantId, ctx.tenant.tenantId))
        .orderBy(desc(workflows.updatedAt))
        .limit(input.limit)
        .offset(input.offset);

      if (input.status) {
        query = query.where(
          and(
            eq(workflows.tenantId, ctx.tenant.tenantId),
            eq(workflows.status, input.status)
          )
        );
      }

      if (input.category) {
        query = query.where(
          and(
            eq(workflows.tenantId, ctx.tenant.tenantId),
            eq(workflows.category, input.category)
          )
        );
      }

      const results = await query;
      return results;
    }),

  /**
   * Get workflow by ID
   */
  getById: workflowReadProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const workflow = await ctx.db
        .select()
        .from(workflows)
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!workflow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Workflow not found',
        });
      }

      return workflow;
    }),

  /**
   * Create workflow
   */
  create: workflowWriteProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.string().optional(),
        definition: z.record(z.any()),
        isTemplate: z.boolean().default(false),
        templateId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [workflow] = await ctx.db
        .insert(workflows)
        .values({
          ...input,
          tenantId: ctx.tenant.tenantId,
          createdBy: ctx.session.user.id,
          updatedBy: ctx.session.user.id,
          status: 'draft',
          version: 1,
        })
        .returning();

      return workflow;
    }),

  /**
   * Update workflow
   */
  update: workflowWriteProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        definition: z.record(z.any()).optional(),
        status: z.enum(['draft', 'active', 'inactive', 'archived']).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Check if workflow exists and user has access
      const existingWorkflow = await ctx.db
        .select()
        .from(workflows)
        .where(
          and(
            eq(workflows.id, id),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!existingWorkflow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Workflow not found',
        });
      }

      const [updatedWorkflow] = await ctx.db
        .update(workflows)
        .set({
          ...updateData,
          updatedBy: ctx.session.user.id,
          updatedAt: new Date(),
        })
        .where(eq(workflows.id, id))
        .returning();

      return updatedWorkflow;
    }),

  /**
   * Delete workflow
   */
  delete: workflowDeleteProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Check if workflow exists and user has access
      const existingWorkflow = await ctx.db
        .select()
        .from(workflows)
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!existingWorkflow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Workflow not found',
        });
      }

      // Check if there are any executions
      const executions = await ctx.db
        .select()
        .from(workflowExecutions)
        .where(eq(workflowExecutions.workflowId, input.id))
        .limit(1);

      if (executions.length > 0) {
        // Soft delete by archiving instead of hard delete
        const [archivedWorkflow] = await ctx.db
          .update(workflows)
          .set({
            status: 'archived',
            updatedAt: new Date(),
          })
          .where(eq(workflows.id, input.id))
          .returning();

        return { success: true, archived: true, workflow: archivedWorkflow };
      }

      // Hard delete if no executions
      const [deletedWorkflow] = await ctx.db
        .delete(workflows)
        .where(eq(workflows.id, input.id))
        .returning();

      return { success: true, archived: false, workflow: deletedWorkflow };
    }),

  /**
   * Execute workflow
   */
  execute: workflowExecuteProcedure
    .input(
      z.object({
        workflowId: z.string().uuid(),
        inputs: z.record(z.any()).optional().default({}),
        priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if workflow exists and is active
      const workflow = await ctx.db
        .select()
        .from(workflows)
        .where(
          and(
            eq(workflows.id, input.workflowId),
            eq(workflows.tenantId, ctx.tenant.tenantId),
            eq(workflows.status, 'active')
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!workflow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Active workflow not found',
        });
      }

      // Create execution record
      const [execution] = await ctx.db
        .insert(workflowExecutions)
        .values({
          workflowId: input.workflowId,
          createdBy: ctx.session.user.id,
          status: 'pending',
          triggerType: 'manual',
          triggerData: {
            userId: ctx.session.user.id,
          },
          input: input.inputs,
          output: {},
          variables: input.inputs,
          priority: getPriorityValue(input.priority),
        })
        .returning();

      // Queue the execution with Inngest
      try {
        await inngest.send({
          name: 'workflow/execute',
          data: {
            executionId: execution.id,
            workflowId: input.workflowId,
            tenantId: ctx.tenant.tenantId,
            userId: ctx.session.user.id,
            inputs: input.inputs,
            priority: input.priority,
          },
        });
      } catch (error) {
        console.error('Failed to queue workflow execution:', error);
        
        // Update execution status to failed
        await ctx.db
          .update(workflowExecutions)
          .set({
            status: 'failed',
            error: 'Failed to queue execution',
          })
          .where(eq(workflowExecutions.id, execution.id));

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to queue workflow execution',
        });
      }

      return execution;
    }),

  /**
   * Duplicate workflow
   */
  duplicate: workflowWriteProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get source workflow
      const sourceWorkflow = await ctx.db
        .select()
        .from(workflows)
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!sourceWorkflow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Source workflow not found',
        });
      }

      // Create duplicate
      const [duplicatedWorkflow] = await ctx.db
        .insert(workflows)
        .values({
          name: input.name,
          description: sourceWorkflow.description,
          category: sourceWorkflow.category,
          definition: sourceWorkflow.definition,
          tenantId: ctx.tenant.tenantId,
          createdBy: ctx.session.user.id,
          updatedBy: ctx.session.user.id,
          status: 'draft',
          version: 1,
          isTemplate: false,
          templateId: sourceWorkflow.isTemplate ? sourceWorkflow.id : sourceWorkflow.templateId,
        })
        .returning();

      return duplicatedWorkflow;
    }),
});

// Helper function to convert priority string to number
function getPriorityValue(priority: 'low' | 'normal' | 'high' | 'urgent'): number {
  switch (priority) {
    case 'low':
      return 1;
    case 'normal':
      return 2;
    case 'high':
      return 3;
    case 'urgent':
      return 4;
    default:
      return 2;
  }
}