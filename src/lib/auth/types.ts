import type { User } from '@auth0/nextjs-auth0';

export interface ExtendedUser extends User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phoneNumber?: string;
  title?: string;
  department?: string;
  authProvider: string;
  authId: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    timezone?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      workflowUpdates?: boolean;
      approvalRequests?: boolean;
    };
    dashboard?: {
      layout?: string;
      widgets?: string[];
    };
  };
  lastLoginAt?: Date;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  userRole: string;
  permissions: string[];
}

export interface AuthContext {
  user: ExtendedUser | null;
  tenant: TenantContext | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}