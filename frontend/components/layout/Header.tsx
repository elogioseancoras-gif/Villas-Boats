'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Menu, X, Anchor, Globe, DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Container } from './Container';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const locales = [
  { value: 'en', label: 'EN' },
  { value: 'pt-BR', label: 'PT-BR' },
  { value: 'pt-PT', label: 'PT-PT' },
  { value: 'es', label: 'ES' },
];

const currencies = [
  { value: 'USD', label: 'USD', symbol: '$' },
  { value: 'EUR', label: 'EUR', symbol: '€' },
  { value: 'GBP', label: 'GBP', symbol: '£' },
  { value: 'BRL', label: 'BRL', symbol: 'R$' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('navigation');

  const locale = params?.locale as string || 'en';

  const navigation = [
    { name: t('boats'), href: `/${locale}/boats` },
    { name: t('destinations'), href: `/${locale}/destinations` },
    { name: t('howItWorks'), href: `/${locale}/how-it-works` },
  ];

  const handleLocaleChange = (newLocale: string) => {
    // Remove the current locale from pathname and add the new one
    const pathWithoutLocale = pathname?.replace(`/${locale}`, '') || '';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <nav className="flex h-16 items-center justify-between" aria-label="Global">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href={`/${locale}`} className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:bg-primary-dark transition-colors">
                <Anchor className="h-6 w-6" />
              </div>
              <span className="text-xl font-heading font-semibold text-foreground">
                Villas Boats
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Language & Currency Selectors */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Language Selector */}
              <Select value={locale} onValueChange={handleLocaleChange}>
                <SelectTrigger size="sm" className="w-auto min-w-[85px]" aria-label={t('language')}>
                  <Globe className="h-4 w-4 mr-1.5 shrink-0 text-muted-foreground" />
                  <SelectValue className="text-sm" />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Currency Selector */}
              <Select value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'EUR' | 'GBP' | 'BRL')}>
                <SelectTrigger size="sm" className="w-auto min-w-[80px]" aria-label={t('currency')}>
                  <DollarSign className="h-4 w-4 mr-1.5 shrink-0 text-muted-foreground" />
                  <SelectValue className="text-sm" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Login Button - TODO: Implement auth */}
            <Button asChild className="hidden md:inline-flex" size="sm">
              <Link href={`/${locale}/admin`}>
                Admin
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden rounded-md p-2 text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Toggle menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href={`/${locale}/admin`}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>

              {/* Mobile Language & Currency Selectors */}
              <div className="px-3 py-2 space-y-3 border-t border-border mt-2 pt-4">
                {/* Language Selector */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {t('language')}
                  </label>
                  <Select
                    value={locale}
                    onValueChange={(value) => {
                      handleLocaleChange(value);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locales.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value}>
                          {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Currency Selector */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {t('currency')}
                  </label>
                  <Select
                    value={currency}
                    onValueChange={(value) => setCurrency(value as 'USD' | 'EUR' | 'GBP' | 'BRL')}
                  >
                    <SelectTrigger className="w-full">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
