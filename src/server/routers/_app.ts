import { router } from '../trpc';
import { authRouter } from './auth';
import { tenantRouter } from './tenant';
import { workflowRouter } from './workflow';
import { executionRouter } from './execution';
import { approvalRouter } from './approval';
import { aiRouter } from './ai';

/**
 * Main application router
 * 
 * All routers should be added here
 */
export const appRouter = router({
  auth: authRouter,
  tenant: tenantRouter,
  workflow: workflowRouter,
  execution: executionRouter,
  approval: approvalRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;