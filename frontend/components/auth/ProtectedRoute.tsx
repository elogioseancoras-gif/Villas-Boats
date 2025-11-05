'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Protected Route Component
 *
 * Wraps content that requires authentication.
 * Redirects to login if user is not authenticated.
 * Optionally requires admin role.
 *
 * Usage:
 * <ProtectedRoute>
 *   <YourProtectedContent />
 * </ProtectedRoute>
 *
 * or for admin-only:
 * <ProtectedRoute requireAdmin>
 *   <AdminContent />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  requireAdmin = false,
  fallback = null
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to backoffice login
      if (!user) {
        const redirectUrl = encodeURIComponent(pathname);
        router.push(`/backoffice/login?redirect=${redirectUrl}`);
        return;
      }

      // Authenticated but not admin when admin required
      if (requireAdmin && !isAdmin) {
        router.push('/'); // Redirect to home or unauthorized page
      }
    }
  }, [loading, user, isAdmin, requireAdmin, router, pathname]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return fallback ? <>{fallback}</> : null;
  }

  // Authenticated but insufficient permissions
  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Authenticated and authorized
  return <>{children}</>;
}

/**
 * Higher-Order Component for Protected Routes
 *
 * Wraps a component to make it require authentication.
 *
 * Usage:
 * const ProtectedPage = withAuth(YourPage);
 *
 * or for admin-only:
 * const AdminPage = withAuth(YourPage, { requireAdmin: true });
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { requireAdmin?: boolean }
) {
  return function WithAuthComponent(props: P) {
    return (
      <ProtectedRoute requireAdmin={options?.requireAdmin}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Hook for programmatic auth checks
 *
 * Usage:
 * const { checkAuth, checkAdminAuth } = useProtectedRoute();
 *
 * if (!checkAuth()) {
 *   return; // Will redirect to login
 * }
 */
export function useProtectedRoute() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAdmin } = useAuth();

  const checkAuth = () => {
    if (loading) return false;

    if (!user) {
      const redirectUrl = encodeURIComponent(pathname);
      router.push(`/backoffice/login?redirect=${redirectUrl}`);
      return false;
    }

    return true;
  };

  const checkAdminAuth = () => {
    if (!checkAuth()) return false;

    if (!isAdmin) {
      router.push('/');
      return false;
    }

    return true;
  };

  return {
    checkAuth,
    checkAdminAuth,
    user,
    loading,
    isAdmin,
  };
}
