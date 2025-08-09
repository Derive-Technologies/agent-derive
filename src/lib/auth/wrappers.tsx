'use client';

import { useAuth, usePermissions } from './hooks';
import type { ProtectedRouteProps } from './types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredPermissions = [],
  fallback = <div>Loading...</div>,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasAllPermissions } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, requireAuth, isAuthenticated, router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check permission requirements
  if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have sufficient permissions to access this resource.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {},
) => {
  const WrappedComponent = (props: P) => {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};