import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest';
import { functions } from '@/lib/inngest/functions';
import { agentKitFunctions } from '@/lib/inngest/agent-kit/functions';

// Create the Inngest API route handler
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    ...functions,
    ...agentKitFunctions,
  ],
});