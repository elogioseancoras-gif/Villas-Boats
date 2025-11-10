'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function BackofficePage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      // Not logged in - redirect to login
      router.push('/backoffice/login');
    } else if (isAdmin) {
      // Admin user - redirect to dashboard
      router.push('/backoffice/dashboard');
    } else {
      // Logged in but not admin - redirect to login with error
      router.push('/backoffice/login?error=admin_required');
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // Show loading state while checking authentication
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
