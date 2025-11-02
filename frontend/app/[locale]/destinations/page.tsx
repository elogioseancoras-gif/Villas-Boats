'use client';

import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Destination {
  id: string;
  name: string;
  country: string;
  boatCount: number;
  imageUrl: string;
  description: string;
}

export default function DestinationsPage() {
  const t = useTranslations();
  const locale = useLocale();

  // Sample destinations data - in production, this would come from an API
  const destinations: Destination[] = [
    {
      id: 'porto',
      name: t('locations.porto'),
      country: t('locations.portugal'),
      boatCount: 12,
      imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
      description: 'Historic riverside city with stunning architecture',
    },
    {
      id: 'lisbon',
      name: t('locations.lisbon'),
      country: t('locations.portugal'),
      boatCount: 18,
      imageUrl: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop',
      description: 'Coastal capital with vibrant maritime culture',
    },
    {
      id: 'algarve',
      name: t('locations.algarve'),
      country: t('locations.portugal'),
      boatCount: 24,
      imageUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=600&fit=crop',
      description: 'Stunning beaches and golden cliffs',
    },
    {
      id: 'sao-paulo',
      name: t('locations.saoPaulo'),
      country: t('locations.brazil'),
      boatCount: 8,
      imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
      description: 'Coastal access from Brazil\'s largest city',
    },
    {
      id: 'rio-de-janeiro',
      name: t('locations.rioDeJaneiro'),
      country: t('locations.brazil'),
      boatCount: 15,
      imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
      description: 'Iconic beaches and stunning coastal views',
    },
    {
      id: 'santa-catarina',
      name: t('locations.santaCatarina'),
      country: t('locations.brazil'),
      boatCount: 10,
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      description: 'Paradise islands and crystal clear waters',
    },
  ];

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('destinations.title'),
    description: t('destinations.description'),
    numberOfItems: destinations.length,
    itemListElement: destinations.map((destination, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Place',
        name: destination.name,
        description: destination.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: destination.name,
          addressCountry: destination.country,
        },
        image: destination.imageUrl,
        url: `https://villasboats.com/${locale}/destinations/${destination.id}`,
        additionalProperty: {
          '@type': 'PropertyValue',
          name: 'Available Boats',
          value: destination.boatCount,
        },
      },
    })),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              {t('navigation.destinations')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t('destinations.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('destinations.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                      <Anchor className="h-3 w-3 mr-1" />
                      {destination.boatCount} {t('destinations.boatsAvailable')}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span>{destination.name}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {destination.country}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {destination.description}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button asChild className="flex-1">
                    <a href={`/${locale}/boats?location=${destination.id}`}>
                      {t('destinations.viewBoats')}
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a href={`/${locale}/destinations/${destination.id}`}>
                      {t('destinations.exploreDestination')}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              {t('homepage.ctaTitle')}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t('homepage.ctaDescription')}
            </p>
            <Button asChild size="lg">
              <a href={`/${locale}/boats`}>
                {t('homepage.ctaButton')}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
