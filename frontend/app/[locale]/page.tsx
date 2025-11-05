'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Anchor, MapPin, Globe, Ship } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BoatCard } from '@/components/boats/BoatCard';
import { useFeaturedBoats } from '@/lib/api/hooks/useBoats';

export default function HomePage() {
  const t = useTranslations('hero');
  const tHome = useTranslations('homepage');
  const tCommon = useTranslations('common');
  const params = useParams();
  const locale = params?.locale as string || 'en';

  // Fetch featured boats from API
  const { data: featuredBoats, isLoading, error } = useFeaturedBoats();

  // JSON-LD structured data for SEO
  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Villas Boats',
    url: 'https://villasboats.com',
    logo: 'https://villasboats.com/logo.png',
    description: 'Premium boat rental service in Portugal and Brazil. Discover sailboats, catamarans, yachts, and speedboats in Porto, Lisbon, Algarve, Rio de Janeiro, and more.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PT',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Portugal',
      },
      {
        '@type': 'Country',
        name: 'Brazil',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Portuguese', 'Spanish'],
    },
    sameAs: [
      'https://facebook.com/villasboats',
      'https://instagram.com/villasboats',
      'https://twitter.com/villasboats',
    ],
    priceRange: '$$-$$$$',
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Villas Boats',
    url: 'https://villasboats.com',
    description: 'Premium boat rental service in Portugal and Brazil',
    inLanguage: ['en', 'pt-BR', 'pt-PT', 'es'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://villasboats.com/{locale}/boats?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />

    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1920&q=80"
            alt="Sailing yacht"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
        </div>

        {/* Hero Content */}
        <Container className="relative z-10 text-center">
          <Badge className="mb-6 bg-primary/90 backdrop-blur-sm text-primary-foreground">
            {t('badge')}
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-6 max-w-4xl mx-auto">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base">
              <Link href={`/${locale}/boats`}>
                <Ship className="h-5 w-5 mr-2" />
                {t('exploreBoats')}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <Link href={`/${locale}/how-it-works`}>
                {t('howItWorks')}
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <MapPin className="h-10 w-10 mx-auto mb-4 text-primary" />
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">6+</div>
                <div className="text-sm text-muted-foreground">{tHome('statsLocations')}</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Ship className="h-10 w-10 mx-auto mb-4 text-primary" />
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">50+</div>
                <div className="text-sm text-muted-foreground">{tHome('statsBoats')}</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Globe className="h-10 w-10 mx-auto mb-4 text-primary" />
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">4</div>
                <div className="text-sm text-muted-foreground">{tHome('statsLanguages')}</div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Featured Boats Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {tHome('destinationsTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {tHome('destinationsDescription')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="h-64 bg-muted animate-pulse" />
                      <div className="p-6 space-y-3">
                        <div className="h-6 bg-muted animate-pulse rounded" />
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                        <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
            {error && (
              <div className="col-span-full text-center py-12">
                <p className="text-destructive mb-4">Failed to load featured boats. Please try again later.</p>
                <Button asChild variant="outline">
                  <Link href={`/${locale}/boats`}>View All Boats</Link>
                </Button>
              </div>
            )}
            {!isLoading && !error && featuredBoats && featuredBoats.length > 0 && featuredBoats.map((boat) => (
              <BoatCard key={boat.id} boat={boat} variant="grid" locale={locale as 'en' | 'pt-BR' | 'pt-PT' | 'es'} />
            ))}
            {!isLoading && !error && (!featuredBoats || featuredBoats.length === 0) && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">No featured boats available at the moment.</p>
                <Button asChild variant="outline">
                  <Link href={`/${locale}/boats`}>View All Boats</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href={`/${locale}/boats`}>
                {tHome('ctaButton')}
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <Container className="text-center">
          <Anchor className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {tHome('ctaTitle')}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            {tHome('ctaDescription')}
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href={`/${locale}/boats`}>
              {tHome('ctaButton')}
            </Link>
          </Button>
        </Container>
      </section>
    </main>
    </>
  );
}
