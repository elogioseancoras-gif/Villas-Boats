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

// Sample featured boats data
const featuredBoats = [
  {
    id: '1',
    slug: 'luxury-catamaran-algarve',
    name: { en: 'Luxury Catamaran Algarve', 'pt-BR': 'Catamarã de Luxo Algarve', 'pt-PT': 'Catamarã de Luxo Algarve', es: 'Catamarán de Lujo Algarve' },
    description: { en: 'Experience luxury sailing in the beautiful Algarve coast', 'pt-BR': 'Experimente navegação de luxo na bela costa do Algarve', 'pt-PT': 'Experimente navegação de luxo na bela costa do Algarve', es: 'Experimenta la navegación de lujo en la hermosa costa del Algarve' },
    type: 'CATAMARAN' as const,
    capacity: 12,
    length: 15,
    priceUSD: 850,
    priceEUR: 780,
    priceGBP: 670,
    priceBRL: 4200,
    location: { city: 'Faro', country: 'Portugal', lat: 37.0194, lng: -7.9304 },
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80', alt: 'Luxury Catamaran', isPrimary: true }
    ],
    rating: 4.9,
    reviewCount: 127
  },
  {
    id: '2',
    slug: 'classic-sailboat-lisbon',
    name: { en: 'Classic Sailboat Lisbon', 'pt-BR': 'Veleiro Clássico Lisboa', 'pt-PT': 'Veleiro Clássico Lisboa', es: 'Velero Clásico Lisboa' },
    description: { en: 'Discover the Tagus River on a classic sailboat', 'pt-BR': 'Descubra o Rio Tejo num veleiro clássico', 'pt-PT': 'Descubra o Rio Tejo num veleiro clássico', es: 'Descubre el río Tajo en un velero clásico' },
    type: 'SAILBOAT' as const,
    capacity: 6,
    length: 12,
    priceUSD: 320,
    priceEUR: 300,
    priceGBP: 260,
    priceBRL: 1600,
    location: { city: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393 },
    images: [
      { id: '2', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', alt: 'Sailboat', isPrimary: true }
    ],
    rating: 4.8,
    reviewCount: 45
  },
  {
    id: '3',
    slug: 'speedboat-rio-janeiro',
    name: { en: 'Speedboat Rio de Janeiro', 'pt-BR': 'Lancha Rio de Janeiro', 'pt-PT': 'Lancha Rio de Janeiro', es: 'Lancha Río de Janeiro' },
    description: { en: 'Explore the stunning bays of Rio on a fast speedboat', 'pt-BR': 'Explore as baías deslumbrantes do Rio numa lancha rápida', 'pt-PT': 'Explore as baías deslumbrantes do Rio numa lancha rápida', es: 'Explora las impresionantes bahías de Río en una lancha rápida' },
    type: 'SPEEDBOAT' as const,
    capacity: 8,
    length: 10,
    priceUSD: 400,
    priceEUR: 370,
    priceGBP: 320,
    priceBRL: 2000,
    location: { city: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729 },
    images: [
      { id: '3', url: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80', alt: 'Speedboat', isPrimary: true }
    ],
    rating: 4.7,
    reviewCount: 38
  }
];

export default function HomePage() {
  const t = useTranslations('hero');
  const tHome = useTranslations('homepage');
  const tCommon = useTranslations('common');
  const params = useParams();
  const locale = params?.locale as string || 'en';

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
            {featuredBoats.map((boat) => (
              <BoatCard key={boat.id} boat={boat} variant="grid" locale={locale as 'en' | 'pt-BR' | 'pt-PT' | 'es'} />
            ))}
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
