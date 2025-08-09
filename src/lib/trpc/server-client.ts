import { cache } from 'react';
import { headers } from 'next/headers';
import { createCallerFactory } from '@trpc/server';

import { appRouter } from '@/src/server';
import { createTRPCContext } from '@/src/server/context';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set('x-trpc-source', 'rsc');

  return createTRPCContext({
    req: {
      headers: Object.fromEntries(heads.entries()),
      url: '',
    } as any,
    res: undefined as any,
  });
});

/**
 * Server-side caller factory for use in React Server Components
 * This allows you to call tRPC procedures directly on the server
 */
export const api = createCallerFactory(appRouter)(createContext);