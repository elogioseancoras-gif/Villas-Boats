import { Inter, Outfit } from 'next/font/google';
import { Metadata } from 'next';
import { BackofficeLayoutClient } from './BackofficeLayoutClient';
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

export const metadata: Metadata = {
  title: {
    template: '%s | Villas Boats Admin',
    default: 'Admin Portal | Villas Boats',
  },
  description: 'Administrative portal for managing Villas Boats fleet, bookings, and customers',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <BackofficeLayoutClient>{children}</BackofficeLayoutClient>
      </body>
    </html>
  );
}
