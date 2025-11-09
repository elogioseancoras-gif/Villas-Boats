'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export function BackofficeLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes('/login');

  return (
    <QueryProvider>
      <AuthProvider>
        <div className="flex h-screen overflow-hidden bg-gray-50">
          {!isLoginPage && <AdminSidebar />}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </AuthProvider>
    </QueryProvider>
  );
}
