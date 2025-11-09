'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout';
import {
  BoatGallery,
  BoatSpecs,
  BoatFeatures,
} from '@/components/boats';
import { Boat, BoatType, BoatStatus } from '@/types';
import { MapPin, Star, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookingWidget } from '@/components/booking/BookingWidget';

// Mock data - will be replaced with API calls
const mockBoats: Boat[] = [
  {
    id: '850e8400-e29b-41d4-a716-446655440001', // Real UUID from database
    slug: 'luxury-catamaran-algarve',
    name: {
      en: 'Luxury Catamaran Experience',
      'pt-BR': 'Experiência em Catamarã de Luxo',
      'pt-PT': 'Experiência em Catamarã de Luxo',
      es: 'Experiencia en Catamarán de Lujo',
    },
    description: {
      en: 'Experience the ultimate sailing adventure on this stunning 50ft catamaran. Perfect for families and groups, featuring spacious decks, modern amenities, and breathtaking ocean views. Our experienced crew ensures a safe and memorable journey along the Algarve coastline.',
      'pt-BR': 'Experimente a aventura de navegação definitiva neste deslumbrante catamarã de 15m. Perfeito para famílias e grupos, com decks espaçosos, comodidades modernas e vistas deslumbrantes do oceano. Nossa tripulação experiente garante uma viagem segura e memorável ao longo da costa do Algarve.',
      'pt-PT': 'Experimente a aventura de navegação definitiva neste deslumbrante catamarã de 15m. Perfeito para famílias e grupos, com decks espaçosos, comodidades modernas e vistas deslumbrantes do oceano. Nossa tripulação experiente garante uma viagem segura e memorável ao longo da costa do Algarve.',
      es: 'Experimente la aventura de navegación definitiva en este impresionante catamarán de 15m. Perfecto para familias y grupos, con cubiertas espaciosas, comodidades modernas y vistas impresionantes del océano. Nuestra tripulación experimentada garantiza un viaje seguro y memorable a lo largo de la costa del Algarve.',
    },
    type: BoatType.CATAMARAN,
    status: BoatStatus.ACTIVE,
    capacity: 12,
    length: 15,
    cabins: 4,
    bathrooms: 3,
    year: 2020,
    make: 'Lagoon',
    model: '50',
    location: {
      id: '1',
      country: 'Portugal',
      city: 'Algarve',
      region: 'Algarve',
      coordinates: { latitude: 37.0179, longitude: -7.9304 },
    },
    priceUSD: 850,
    priceEUR: 780,
    priceGBP: 670,
    priceBRL: 4200,
    captainPricePerDayUsd: 200,
    captainPricePerDayEur: 185,
    captainPricePerDayGbp: 160,
    captainPricePerDayBrl: 1000,
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=80',
        alt: { en: 'Luxury catamaran sailing', 'pt-BR': 'Catamarã de luxo navegando', 'pt-PT': 'Catamarã de luxo à vela', es: 'Catamarán de lujo navegando' },
        isPrimary: true,
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
        alt: { en: 'Catamaran deck view', 'pt-BR': 'Vista do deck do catamarã', 'pt-PT': 'Vista do convés do catamarã', es: 'Vista de la cubierta del catamarán' },
        isPrimary: false,
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80',
        alt: { en: 'Catamaran interior cabin', 'pt-BR': 'Cabine interior do catamarã', 'pt-PT': 'Cabina interior do catamarã', es: 'Cabina interior del catamarán' },
        isPrimary: false,
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1200&q=80',
        alt: { en: 'Sunset sailing', 'pt-BR': 'Navegação ao pôr do sol', 'pt-PT': 'Velejar ao pôr do sol', es: 'Navegando al atardecer' },
        isPrimary: false,
      },
    ],
    amenities: [
      { id: '1', name: { en: 'WiFi', 'pt-BR': 'WiFi', 'pt-PT': 'WiFi', es: 'WiFi' } },
      { id: '2', name: { en: 'Air Conditioning', 'pt-BR': 'Ar Condicionado', 'pt-PT': 'Ar Condicionado', es: 'Aire Acondicionado' } },
      { id: '3', name: { en: 'Kitchen', 'pt-BR': 'Cozinha', 'pt-PT': 'Cozinha', es: 'Cocina' } },
      { id: '4', name: { en: 'Sound System', 'pt-BR': 'Sistema de Som', 'pt-PT': 'Sistema de Som', es: 'Sistema de Sonido' } },
      { id: '5', name: { en: 'GPS Navigation', 'pt-BR': 'Navegação GPS', 'pt-PT': 'Navegação GPS', es: 'Navegación GPS' } },
      { id: '6', name: { en: 'Safety Equipment', 'pt-BR': 'Equipamento de Segurança', 'pt-PT': 'Equipamento de Segurança', es: 'Equipo de Seguridad' } },
      { id: '7', name: { en: 'Snorkeling Gear', 'pt-BR': 'Equipamento de Snorkeling', 'pt-PT': 'Equipamento de Snorkeling', es: 'Equipo de Snorkeling' } },
      { id: '8', name: { en: 'Sun Deck', 'pt-BR': 'Deck Solar', 'pt-PT': 'Deck Solar', es: 'Terraza Solar' } },
      { id: '9', name: { en: 'Shower', 'pt-BR': 'Chuveiro', 'pt-PT': 'Chuveiro', es: 'Ducha' } },
      { id: '10', name: { en: 'Bluetooth Speaker', 'pt-BR': 'Alto-falante Bluetooth', 'pt-PT': 'Altifalante Bluetooth', es: 'Altavoz Bluetooth' } },
    ],
    rating: 4.9,
    reviewCount: 127,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '850e8400-e29b-41d4-a716-446655440002', // Real UUID from database
    slug: 'classic-sailboat-lisbon',
    name: {
      en: 'Classic Sailboat Lisbon',
      'pt-BR': 'Veleiro Clássico Lisboa',
      'pt-PT': 'Veleiro Clássico Lisboa',
      es: 'Velero Clásico Lisboa',
    },
    description: {
      en: 'Discover the Tagus River on a classic sailboat with experienced crew. Perfect for romantic evenings or family adventures along the beautiful Lisbon coastline.',
      'pt-BR': 'Descubra o Rio Tejo num veleiro clássico com tripulação experiente. Perfeito para noites românticas ou aventuras em família ao longo da bela costa de Lisboa.',
      'pt-PT': 'Descubra o Rio Tejo num veleiro clássico com tripulação experiente. Perfeito para noites românticas ou aventuras em família ao longo da bela costa de Lisboa.',
      es: 'Descubre el río Tajo en un velero clásico con tripulación experimentada. Perfecto para noches románticas o aventuras familiares a lo largo de la hermosa costa de Lisboa.',
    },
    type: BoatType.SAILBOAT,
    status: BoatStatus.ACTIVE,
    capacity: 6,
    length: 12,
    cabins: 2,
    bathrooms: 1,
    year: 2018,
    make: 'Bavaria',
    model: '40',
    location: {
      id: '2',
      country: 'Portugal',
      city: 'Lisbon',
      region: 'Lisboa',
      coordinates: { latitude: 38.7223, longitude: -9.1393 },
    },
    priceUSD: 320,
    priceEUR: 300,
    priceGBP: 260,
    priceBRL: 1600,
    captainPricePerDayUsd: 150,
    captainPricePerDayEur: 140,
    captainPricePerDayGbp: 120,
    captainPricePerDayBrl: 750,
    images: [
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
        alt: { en: 'Classic sailboat', 'pt-BR': 'Veleiro clássico', 'pt-PT': 'Veleiro clássico', es: 'Velero clásico' },
        isPrimary: true,
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=80',
        alt: { en: 'Sailboat deck', 'pt-BR': 'Deck do veleiro', 'pt-PT': 'Convés do veleiro', es: 'Cubierta del velero' },
        isPrimary: false,
      },
    ],
    amenities: [
      { id: '1', name: { en: 'WiFi', 'pt-BR': 'WiFi', 'pt-PT': 'WiFi', es: 'WiFi' } },
      { id: '3', name: { en: 'Kitchen', 'pt-BR': 'Cozinha', 'pt-PT': 'Cozinha', es: 'Cocina' } },
      { id: '5', name: { en: 'GPS Navigation', 'pt-BR': 'Navegação GPS', 'pt-PT': 'Navegação GPS', es: 'Navegación GPS' } },
      { id: '6', name: { en: 'Safety Equipment', 'pt-BR': 'Equipamento de Segurança', 'pt-PT': 'Equipamento de Segurança', es: 'Equipo de Seguridad' } },
      { id: '9', name: { en: 'Shower', 'pt-BR': 'Chuveiro', 'pt-PT': 'Chuveiro', es: 'Ducha' } },
    ],
    rating: 4.8,
    reviewCount: 45,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '850e8400-e29b-41d4-a716-446655440003', // Real UUID from database
    slug: 'speedboat-rio-janeiro',
    name: {
      en: 'Speedboat Rio de Janeiro',
      'pt-BR': 'Lancha Rio de Janeiro',
      'pt-PT': 'Lancha Rio de Janeiro',
      es: 'Lancha Río de Janeiro',
    },
    description: {
      en: 'Explore the stunning bays of Rio on a fast speedboat. Experience the thrill of speed while enjoying the breathtaking views of Christ the Redeemer and Sugarloaf Mountain.',
      'pt-BR': 'Explore as baías deslumbrantes do Rio numa lancha rápida. Experimente a emoção da velocidade enquanto aprecia as vistas deslumbrantes do Cristo Redentor e Pão de Açúcar.',
      'pt-PT': 'Explore as baías deslumbrantes do Rio numa lancha rápida. Experimente a emoção da velocidade enquanto aprecia as vistas deslumbrantes do Cristo Redentor e Pão de Açúcar.',
      es: 'Explora las impresionantes bahías de Río en una lancha rápida. Experimenta la emoción de la velocidad mientras disfrutas de las impresionantes vistas del Cristo Redentor y el Pan de Azúcar.',
    },
    type: BoatType.SPEEDBOAT,
    status: BoatStatus.ACTIVE,
    capacity: 8,
    length: 10,
    cabins: 1,
    bathrooms: 1,
    year: 2021,
    make: 'Quicksilver',
    model: 'Activ 855',
    location: {
      id: '3',
      country: 'Brazil',
      city: 'Rio de Janeiro',
      region: 'Rio de Janeiro',
      coordinates: { latitude: -22.9068, longitude: -43.1729 },
    },
    priceUSD: 400,
    priceEUR: 370,
    priceGBP: 320,
    priceBRL: 2000,
    captainPricePerDayUsd: 180,
    captainPricePerDayEur: 165,
    captainPricePerDayGbp: 145,
    captainPricePerDayBrl: 900,
    images: [
      {
        id: '7',
        url: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1200&q=80',
        alt: { en: 'Speedboat on water', 'pt-BR': 'Lancha na água', 'pt-PT': 'Lancha na água', es: 'Lancha en el agua' },
        isPrimary: true,
      },
      {
        id: '8',
        url: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1200&q=80',
        alt: { en: 'Speedboat view', 'pt-BR': 'Vista da lancha', 'pt-PT': 'Vista da lancha', es: 'Vista de la lancha' },
        isPrimary: false,
      },
    ],
    amenities: [
      { id: '1', name: { en: 'WiFi', 'pt-BR': 'WiFi', 'pt-PT': 'WiFi', es: 'WiFi' } },
      { id: '4', name: { en: 'Sound System', 'pt-BR': 'Sistema de Som', 'pt-PT': 'Sistema de Som', es: 'Sistema de Sonido' } },
      { id: '5', name: { en: 'GPS Navigation', 'pt-BR': 'Navegação GPS', 'pt-PT': 'Navegação GPS', es: 'Navegación GPS' } },
      { id: '6', name: { en: 'Safety Equipment', 'pt-BR': 'Equipamento de Segurança', 'pt-PT': 'Equipamento de Segurança', es: 'Equipo de Seguridad' } },
      { id: '8', name: { en: 'Sun Deck', 'pt-BR': 'Deck Solar', 'pt-PT': 'Deck Solar', es: 'Terraza Solar' } },
    ],
    rating: 4.7,
    reviewCount: 38,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-12-01'),
  },
];

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  BRL: 'R$',
};

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default function BoatDetailsPage({ params }: PageProps) {
  const { locale, slug } = use(params);
  const localeTyped = locale as 'en' | 'pt-BR' | 'pt-PT' | 'es';
  const router = useRouter();
  const { currency } = useCurrency();
  const t = useTranslations('boats');
  const tCommon = useTranslations('common');

  // Find boat by slug - will be replaced with API call
  const boat = mockBoats.find((b) => b.slug === slug);

  if (!boat) {
    notFound();
  }

  const name = boat.name[localeTyped] || boat.name.en;
  const description = boat.description[localeTyped] || boat.description.en;
  const price = boat[`price${currency}`] || boat.priceUSD;
  const currencySymbol = currencySymbols[currency];

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
    image: boat.images.map((img) => img.url),
    brand: {
      '@type': 'Brand',
      name: boat.make || 'Villas Boats',
    },
    model: boat.model,
    offers: {
      '@type': 'Offer',
      price: boat.priceUSD,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://villasboats.com/${locale}/boats/${slug}`,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    },
    aggregateRating: boat.rating && boat.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: boat.rating,
      reviewCount: boat.reviewCount,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    category: boat.type,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Capacity',
        value: boat.capacity,
      },
      {
        '@type': 'PropertyValue',
        name: 'Length',
        value: `${boat.length} feet`,
      },
      boat.cabins ? {
        '@type': 'PropertyValue',
        name: 'Cabins',
        value: boat.cabins,
      } : undefined,
      boat.bathrooms ? {
        '@type': 'PropertyValue',
        name: 'Bathrooms',
        value: boat.bathrooms,
      } : undefined,
      boat.year ? {
        '@type': 'PropertyValue',
        name: 'Year Built',
        value: boat.year,
      } : undefined,
    ].filter(Boolean),
    geo: boat.location.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: boat.location.coordinates.latitude,
      longitude: boat.location.coordinates.longitude,
    } : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: boat.location.city,
      addressCountry: boat.location.country,
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen pb-16">
      {/* Back Button */}
      <div className="border-b border-border bg-background">
        <Container className="py-4">
          <Link
            href={`/${locale}/boats`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToBoats')}
          </Link>
        </Container>
      </div>

      {/* Gallery Section */}
      <section className="py-8">
        <Container>
          <BoatGallery images={boat.images} boatName={name} />
        </Container>
      </section>

      {/* Main Content */}
      <section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="mb-2 text-3xl font-heading font-bold text-foreground lg:text-4xl">
                      {name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {boat.location.city}, {boat.location.country}
                        </span>
                      </div>
                      {boat.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-secondary text-secondary" />
                          <span className="font-medium">{boat.rating.toFixed(1)}</span>
                          {boat.reviewCount && (
                            <span className="text-sm text-muted-foreground">
                              ({boat.reviewCount} {boat.reviewCount === 1 ? t('review') : t('reviews')})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      aria-label={t('addToFavorites')}
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      aria-label={t('share')}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-slate max-w-none">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              {/* Specifications */}
              <BoatSpecs boat={boat} />

              {/* Features & Amenities */}
              <BoatFeatures amenities={boat.amenities} locale={localeTyped} />

              {/* Reviews Section Placeholder */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 text-xl font-heading font-semibold text-foreground">
                    {t('guestReviews')}
                  </h2>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-muted p-6">
                      <Star className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-heading font-semibold text-foreground">
                      {t('reviewsComingSoon')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('beFirstToReview')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingWidget
                  boat={{
                    id: boat.id,
                    name: boat.name as unknown as Record<string, string>,
                    slug: boat.slug,
                    pricePerDayUsd: boat.priceUSD,
                    pricePerDayEur: boat.priceEUR,
                    pricePerDayGbp: boat.priceGBP,
                    pricePerDayBrl: boat.priceBRL,
                    captainPricePerDayUsd: boat.captainPricePerDayUsd,
                    captainPricePerDayEur: boat.captainPricePerDayEur,
                    captainPricePerDayGbp: boat.captainPricePerDayGbp,
                    captainPricePerDayBrl: boat.captainPricePerDayBrl,
                    capacity: boat.capacity,
                  }}
                  locale={localeTyped}
                  onSuccess={(bookingReference) => {
                    // Navigate to confirmation page
                    router.push(`/${locale}/booking/confirmation/${bookingReference}`);
                  }}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
    </>
  );
}
