'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthContext, ExtendedUser, TenantContext } from './types';

export const useAuth = (): AuthContext => {
  const { user: auth0User, isLoading: auth0Loading, error } = useUser();
  const [tenant, setTenant] = useState<TenantContext | null>(null);
  const [extendedUser, setExtendedUser] = useState<ExtendedUser | null>(null);
  const [isLoadingExtended, setIsLoadingExtended] = useState(false);

  // Fetch extended user data and tenant context when auth0 user is available
  useEffect(() => {
    const fetchExtendedUserData = async () => {
      if (!auth0User) {
        setExtendedUser(null);
        setTenant(null);
        return;
      }

      setIsLoadingExtended(true);
      try {
        // Fetch user profile from our API
        const userResponse = await fetch('/api/auth/me');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setExtendedUser(userData.user);
          setTenant(userData.tenant);
        }
      } catch (error) {
        console.error('Failed to fetch extended user data:', error);
      } finally {
        setIsLoadingExtended(false);
      }
    };

    fetchExtendedUserData();
  }, [auth0User]);

  return useMemo(
    () => ({
      user: extendedUser,
      tenant,
      isLoading: auth0Loading || isLoadingExtended,
      isAuthenticated: !!auth0User && !!extendedUser,
    }),
    [extendedUser, tenant, auth0Loading, isLoadingExtended, auth0User],
  );
};

export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
};

export const usePermissions = () => {
  const { tenant } = useAuth();

  const hasPermission = useCallback(
    (permission: string): boolean => {
      return tenant?.permissions?.includes(permission) ?? false;
    },
    [tenant?.permissions],
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      return permissions.some((permission) => hasPermission(permission));
    },
    [hasPermission],
  );

  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      return permissions.every((permission) => hasPermission(permission));
    },
    [hasPermission],
  );

  return {
    permissions: tenant?.permissions ?? [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};

export const useTenant = () => {
  const { tenant } = useAuth();
  const router = useRouter();

  const switchTenant = useCallback(
    async (tenantId: string) => {
      try {
        const response = await fetch('/api/auth/switch-tenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tenantId }),
        });

        if (response.ok) {
          // Refresh the page to update the tenant context
          router.refresh();
        } else {
          throw new Error('Failed to switch tenant');
        }
      } catch (error) {
        console.error('Error switching tenant:', error);
        throw error;
      }
    },
    [router],
  );

  return {
    tenant,
    switchTenant,
  };
};