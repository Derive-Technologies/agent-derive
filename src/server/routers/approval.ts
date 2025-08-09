import { z } from 'zod';
import { router, tenantProtectedProcedure, createPermissionProcedure } from '../trpc';
import { approvalRequests, workflowExecutions, workflows, users } from '@/db/schema';
import { eq, and, desc, or, count } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

const approvalReadProcedure = createPermissionProcedure('approval:read');
const approvalWriteProcedure = createPermissionProcedure('approval:write');

export const approvalRouter = router({
  /**
   * List approval requests
   */
  list: approvalReadProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
        assignedToMe: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      let whereClause = and(
        eq(workflows.tenantId, ctx.tenant.tenantId)
      );

      if (input.status) {
        whereClause = and(
          whereClause,
          eq(approvalRequests.status, input.status)
        );
      }

      if (input.assignedToMe) {
        whereClause = and(
          whereClause,
          or(
            eq(approvalRequests.requestedBy, ctx.session.user.id),
            eq(approvalRequests.approvedBy, ctx.session.user.id)
          )
        );
      }

      const approvals = await ctx.db
        .select({
          id: approvalRequests.id,
          type: approvalRequests.type,
          status: approvalRequests.status,
          title: approvalRequests.title,
          description: approvalRequests.description,
          data: approvalRequests.data,
          createdAt: approvalRequests.createdAt,
          approvedAt: approvalRequests.approvedAt,
          expiresAt: approvalRequests.expiresAt,
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
        .from(approvalRequests)
        .innerJoin(workflowExecutions, eq(approvalRequests.executionId, workflowExecutions.id))
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .leftJoin(users, eq(approvalRequests.requestedBy, users.id))
        .where(whereClause)
        .orderBy(desc(approvalRequests.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return approvals;
    }),

  /**
   * Get approval request by ID
   */
  getById: approvalReadProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const approval = await ctx.db
        .select({
          id: approvalRequests.id,
          type: approvalRequests.type,
          status: approvalRequests.status,
          title: approvalRequests.title,
          description: approvalRequests.description,
          data: approvalRequests.data,
          comments: approvalRequests.comments,
          createdAt: approvalRequests.createdAt,
          approvedAt: approvalRequests.approvedAt,
          expiresAt: approvalRequests.expiresAt,
          execution: {
            id: workflowExecutions.id,
            status: workflowExecutions.status,
            inputs: workflowExecutions.inputs,
            outputs: workflowExecutions.outputs,
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
          approvedBy: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
          },
        })
        .from(approvalRequests)
        .innerJoin(workflowExecutions, eq(approvalRequests.executionId, workflowExecutions.id))
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .leftJoin(users, eq(approvalRequests.requestedBy, users.id))
        .where(
          and(
            eq(approvalRequests.id, input.id),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!approval) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Approval request not found',
        });
      }

      return approval;
    }),

  /**
   * Approve request
   */
  approve: approvalWriteProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        comments: z.string().optional(),
        data: z.record(z.any()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if approval exists and is pending
      const approval = await ctx.db
        .select({
          id: approvalRequests.id,
          status: approvalRequests.status,
          executionId: approvalRequests.executionId,
        })
        .from(approvalRequests)
        .innerJoin(workflowExecutions, eq(approvalRequests.executionId, workflowExecutions.id))
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .where(
          and(
            eq(approvalRequests.id, input.id),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!approval) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Approval request not found',
        });
      }

      if (approval.status !== 'pending') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Approval request is not pending',
        });
      }

      // Check if approval has expired
      const now = new Date();
      const approvalWithExpiry = await ctx.db
        .select({ expiresAt: approvalRequests.expiresAt })
        .from(approvalRequests)
        .where(eq(approvalRequests.id, input.id))
        .limit(1)
        .then(result => result[0]);

      if (approvalWithExpiry?.expiresAt && approvalWithExpiry.expiresAt < now) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Approval request has expired',
        });
      }

      // Update approval status
      const [approvedRequest] = await ctx.db
        .update(approvalRequests)
        .set({
          status: 'approved',
          approvedBy: ctx.session.user.id,
          approvedAt: new Date(),
          comments: input.comments,
          data: input.data ? { ...approval.data, ...input.data } : approval.data,
        })
        .where(eq(approvalRequests.id, input.id))
        .returning();

      // TODO: Signal workflow engine to continue execution

      return approvedRequest;
    }),

  /**
   * Reject request
   */
  reject: approvalWriteProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        comments: z.string().min(1, 'Rejection reason is required'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if approval exists and is pending
      const approval = await ctx.db
        .select({
          id: approvalRequests.id,
          status: approvalRequests.status,
          executionId: approvalRequests.executionId,
        })
        .from(approvalRequests)
        .innerJoin(workflowExecutions, eq(approvalRequests.executionId, workflowExecutions.id))
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .where(
          and(
            eq(approvalRequests.id, input.id),
            eq(workflows.tenantId, ctx.tenant.tenantId)
          )
        )
        .limit(1)
        .then(result => result[0]);

      if (!approval) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Approval request not found',
        });
      }

      if (approval.status !== 'pending') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Approval request is not pending',
        });
      }

      // Update approval status
      const [rejectedRequest] = await ctx.db
        .update(approvalRequests)
        .set({
          status: 'rejected',
          approvedBy: ctx.session.user.id,
          approvedAt: new Date(),
          comments: input.comments,
        })
        .where(eq(approvalRequests.id, input.id))
        .returning();

      // TODO: Signal workflow engine to handle rejection

      return rejectedRequest;
    }),

  /**
   * Get approval statistics
   */
  getStats: approvalReadProcedure
    .input(
      z.object({
        days: z.number().min(1).max(365).default(30),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Add date filter for last N days
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const stats = await ctx.db
        .select({
          status: approvalRequests.status,
          count: count(approvalRequests.id),
        })
        .from(approvalRequests)
        .innerJoin(workflowExecutions, eq(approvalRequests.executionId, workflowExecutions.id))
        .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
        .where(eq(workflows.tenantId, ctx.tenant.tenantId))
        .groupBy(approvalRequests.status);

      // Calculate totals
      const total = stats.reduce((sum, stat) => sum + Number(stat.count), 0);
      const pending = stats.find(s => s.status === 'pending')?.count || 0;
      const approved = stats.find(s => s.status === 'approved')?.count || 0;
      const rejected = stats.find(s => s.status === 'rejected')?.count || 0;

      return {
        total: Number(total),
        pending: Number(pending),
        approved: Number(approved),
        rejected: Number(rejected),
        approvalRate: total > 0 ? Number(approved) / Number(total) : 0,
        byStatus: stats.map(s => ({
          status: s.status,
          count: Number(s.count),
        })),
      };
    }),

  /**
   * Get pending approvals count for current user
   */
  getPendingCount: approvalReadProcedure.query(async ({ ctx }) => {
    const countResult = await ctx.db
      .select({
        count: count(approvalRequests.id),
      })
      .from(approvalRequests)
      .innerJoin(workflowExecutions, eq(approvalRequests.executionId, workflowExecutions.id))
      .innerJoin(workflows, eq(workflowExecutions.workflowId, workflows.id))
      .where(
        and(
          eq(workflows.tenantId, ctx.tenant.tenantId),
          eq(approvalRequests.status, 'pending')
        )
      )
      .then(result => result[0]?.count || 0);

    return Number(countResult);
  }),
});