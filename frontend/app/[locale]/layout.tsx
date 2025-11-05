import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Outfit } from 'next/font/google';
import { Layout } from '@/components/layout';
import { CurrencyProvider } from '@/app/contexts/CurrencyContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { locales } from '@/i18n/request';
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titles = {
    en: 'Villas Boats - Sail Towards Your Dreams',
    'pt-BR': 'Villas Boats - Navegue em Direção aos Seus Sonhos',
    'pt-PT': 'Villas Boats - Navegue em Direcção aos Seus Sonhos',
    es: 'Villas Boats - Navegue Hacia Sus Sueños',
  };

  const descriptions = {
    en: 'Premium boat rental platform in Portugal and Brazil. Discover luxury yachts, sailboats, and motorboats in Porto, Lisbon, Algarve, São Paulo, Rio de Janeiro, and Santa Catarina.',
    'pt-BR': 'Plataforma premium de aluguel de barcos em Portugal e Brasil. Descubra iates de luxo, veleiros e lanchas no Porto, Lisboa, Algarve, São Paulo, Rio de Janeiro e Santa Catarina.',
    'pt-PT': 'Plataforma premium de aluguer de barcos em Portugal e Brasil. Descubra iates de luxo, veleiros e lanchas no Porto, Lisboa, Algarve, São Paulo, Rio de Janeiro e Santa Catarina.',
    es: 'Plataforma premium de alquiler de barcos en Portugal y Brasil. Descubra yates de lujo, veleros y lanchas en Oporto, Lisboa, Algarve, São Paulo, Río de Janeiro y Santa Catarina.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    keywords: ['boat rental', 'yacht charter', 'Portugal', 'Brazil', 'luxury boats', 'sailing'],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // When using getRequestConfig, messages are automatically available
  // We still need to call getMessages to pass them to the client provider
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <CurrencyProvider>
                <Layout>{children}</Layout>
              </CurrencyProvider>
            </NextIntlClientProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
