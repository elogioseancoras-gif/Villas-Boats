import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales
export const locales = ['en', 'pt-BR', 'pt-PT', 'es'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` corresponds to the `[locale]` segment and is a Promise
  const locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    return {
      locale: defaultLocale,
      messages: (await import('../messages/en.json')).default,
    };
  }

  // Use static imports for better compatibility with Turbopack
  const messages = {
    'en': (await import('../messages/en.json')).default,
    'pt-BR': (await import('../messages/pt-BR.json')).default,
    'pt-PT': (await import('../messages/pt-PT.json')).default,
    'es': (await import('../messages/es.json')).default,
  };

  return {
    locale,
    messages: messages[locale as Locale],
  };
});
