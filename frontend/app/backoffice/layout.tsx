'use client';

import { Inter, Outfit } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import '../globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes('/login');

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
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
      </body>
    </html>
  );
}
