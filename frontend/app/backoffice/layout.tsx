import { Inter, Outfit } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/app/providers/QueryProvider';
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

export const metadata = {
  title: 'Admin Portal - Villas Boats',
  description: 'Backoffice administration portal',
};

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
