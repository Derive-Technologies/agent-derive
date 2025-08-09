# Auth0 Authentication & tRPC API Setup

This document outlines the complete Auth0 authentication and tRPC API implementation for the Agent Derive platform.

## Overview

The implementation provides:
- **Auth0 Integration**: Complete authentication with Next.js App Router
- **tRPC API Layer**: Type-safe API with robust routing and validation
- **Tenant Isolation**: Multi-tenant support with proper data isolation
- **Permission System**: Role-based access control (RBAC)
- **Middleware Integration**: Authentication, tenant, and rate limiting middleware

## Architecture

### Authentication Layer (`src/lib/auth/`)
- **Provider**: Auth0 React provider integration
- **Hooks**: React hooks for authentication state management
- **Middleware**: Route protection and authentication checks
- **Sync**: Database user synchronization with Auth0
- **Wrappers**: Higher-order components for route protection
- **Types**: TypeScript type definitions for auth context

### tRPC Server (`src/server/`)
- **Context**: Request context with user and tenant information
- **Routers**: Modular API route definitions
- **Procedures**: Protected and public procedure definitions
- **Middleware**: Permission-based access control

### tRPC Client (`src/lib/trpc/`)
- **Client**: React Query integration for frontend
- **Provider**: React context provider for tRPC
- **Server Client**: Server-side API calling utilities

## API Routes

### Auth Router (`/api/trpc/auth.*`)
- `getSession` - Get current user session
- `getProfile` - Get user profile information
- `updateProfile` - Update user profile data
- `getTenants` - List user's accessible tenants
- `switchTenant` - Switch active tenant context
- `logout` - Sign out user (redirects to Auth0)

### Tenant Router (`/api/trpc/tenant.*`)
- `getCurrent` - Get current tenant information
- `update` - Update tenant settings (admin+)
- `getUsers` - List tenant users
- `inviteUser` - Invite user to tenant (admin+)
- `updateUserRole` - Change user role (admin+)
- `removeUser` - Remove user from tenant (admin+)
- `delete` - Delete tenant (owner only)

### Workflow Router (`/api/trpc/workflow.*`)
- `list` - List workflows with filtering
- `getById` - Get specific workflow
- `create` - Create new workflow
- `update` - Update workflow definition
- `delete` - Delete workflow (archive if has executions)
- `execute` - Start workflow execution
- `duplicate` - Copy existing workflow

### Execution Router (`/api/trpc/execution.*`)
- `list` - List workflow executions
- `getById` - Get execution details
- `cancel` - Cancel running execution
- `retry` - Retry failed execution
- `getLogs` - Get execution logs
- `getStats` - Get execution statistics

### Approval Router (`/api/trpc/approval.*`)
- `list` - List approval requests
- `getById` - Get approval details
- `approve` - Approve pending request
- `reject` - Reject pending request
- `getStats` - Get approval statistics
- `getPendingCount` - Count pending approvals

### AI Router (`/api/trpc/ai.*`)
- `list` - List AI agent tasks
- `getById` - Get AI task details
- `create` - Create new AI task
- `cancel` - Cancel AI task
- `getCapabilities` - Get available AI capabilities
- `getStats` - Get AI task statistics
- `getResults` - Get AI task outputs

## Permissions System

The platform implements a role-based permission system:

### Roles
- **Owner**: Full tenant control, can delete tenant
- **Admin**: Manage users, workflows, and settings
- **Editor**: Create and edit workflows, manage executions
- **Viewer**: Read-only access to workflows and executions

### Permissions
- `tenant:read`, `tenant:write`, `tenant:delete`
- `workflow:read`, `workflow:write`, `workflow:delete`, `workflow:execute`
- `execution:read`, `execution:cancel`
- `approval:read`, `approval:write`
- `ai:read`, `ai:write`
- `user:read`, `user:write`

## Authentication Flow

1. User visits protected route
2. Middleware checks authentication status
3. If not authenticated, redirect to `/api/auth/login`
4. Auth0 handles login and returns to `/api/auth/callback`
5. Callback handler syncs user with database
6. User session includes database user info and tenant context
7. tRPC context provides user and tenant info to all procedures

## Tenant Isolation

Tenant isolation is enforced at multiple levels:

1. **Middleware**: Extracts tenant context from subdomain/path/cookie
2. **tRPC Context**: Provides tenant info to all procedures
3. **Database Queries**: All queries filtered by tenant ID
4. **Permission Checks**: Role permissions scoped to tenant

## Usage Examples

### Frontend Hook Usage
```tsx
import { useAuth, ProtectedRoute } from '@/src/lib/auth';
import { api } from '@/src/lib/trpc/client';

function MyComponent() {
  const { user, tenant, isAuthenticated } = useAuth();
  const { data: workflows } = api.workflow.list.useQuery();
  const updateMutation = api.auth.updateProfile.useMutation();

  return (
    <ProtectedRoute requiredPermissions={['workflow:read']}>
      <div>{/* Your component */}</div>
    </ProtectedRoute>
  );
}
```

### Server-Side API Calls
```tsx
import { api } from '@/src/lib/trpc/server-client';

async function ServerComponent() {
  const session = await api.auth.getSession();
  const workflows = await api.workflow.list({ limit: 10 });

  return <div>{/* Server component */}</div>;
}
```

## Environment Variables Required

```env
# Auth0 Configuration
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=your-api-identifier

# Database
DATABASE_URL=your-database-url

# tRPC (optional)
TRPC_SECRET=your-trpc-secret
```

## File Structure

```
src/
├── lib/
│   ├── auth/
│   │   ├── index.ts          # Main exports
│   │   ├── provider.ts       # Auth0 provider configuration
│   │   ├── hooks.ts          # React hooks for auth state
│   │   ├── middleware.ts     # Auth/tenant/rate limit middleware
│   │   ├── sync.ts           # Database user synchronization
│   │   ├── types.ts          # TypeScript type definitions
│   │   └── wrappers.tsx      # Protected route components
│   └── trpc/
│       ├── index.ts          # Main exports
│       ├── client.ts         # React Query tRPC client
│       ├── provider.tsx      # React context provider
│       └── server-client.ts  # Server-side API client
└── server/
    ├── index.ts              # Server exports
    ├── trpc.ts               # tRPC instance and procedures
    ├── context.ts            # Request context creation
    └── routers/
        ├── _app.ts           # Main app router
        ├── auth.ts           # Authentication routes
        ├── tenant.ts         # Tenant management routes
        ├── workflow.ts       # Workflow CRUD routes
        ├── execution.ts      # Execution management routes
        ├── approval.ts       # Approval workflow routes
        └── ai.ts             # AI agent task routes

app/
├── api/
│   ├── auth/
│   │   ├── [auth0]/route.ts  # Auth0 callback handlers
│   │   ├── me/route.ts       # User profile endpoint
│   │   └── switch-tenant/route.ts # Tenant switching
│   └── trpc/
│       └── [trpc]/route.ts   # tRPC API handler
├── layout.tsx                # Root layout with providers
└── middleware.ts             # Global middleware configuration
```

## Security Features

1. **Authentication**: Auth0 integration with secure session management
2. **Authorization**: Role-based permissions with tenant isolation
3. **Rate Limiting**: Request throttling to prevent abuse
4. **Input Validation**: Zod schema validation on all inputs
5. **Error Handling**: Structured error responses with appropriate HTTP codes
6. **CSRF Protection**: Built-in Next.js and Auth0 CSRF protection

## Next Steps

1. Set up Auth0 tenant and configure application
2. Configure environment variables
3. Run database migrations: `pnpm db:migrate`
4. Seed initial data: `pnpm db:seed`
5. Test authentication flow at `/example`
6. Build your application pages using the provided hooks and API

The system is now ready for development and provides a robust foundation for building the Agent Derive platform with secure authentication, tenant isolation, and type-safe API interactions.