'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout';
import { BoatGrid } from '@/components/boats';
import { Boat, BoatType } from '@/types';
import { LayoutGrid, List, Search, Heart, MapIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Mock data - will be replaced with API calls
const mockBoats: Boat[] = [
  {
    id: '1',
    slug: 'luxury-catamaran-algarve',
    name: {
      en: 'Luxury Catamaran Experience',
      'pt-BR': 'Experiência em Catamarã de Luxo',
      'pt-PT': 'Experiência em Catamarã de Luxo',
      es: 'Experiencia en Catamarán de Lujo',
    },
    description: {
      en: 'Experience the ultimate sailing adventure on this stunning 50ft catamaran. Perfect for families and groups, featuring spacious decks, modern amenities, and breathtaking ocean views.',
      'pt-BR': 'Experimente a aventura de navegação definitiva neste deslumbrante catamarã de 15m. Perfeito para famílias e grupos, com decks espaçosos, comodidades modernas e vistas deslumbrantes do oceano.',
      'pt-PT': 'Experimente a aventura de navegação definitiva neste deslumbrante catamarã de 15m. Perfeito para famílias e grupos, com decks espaçosos, comodidades modernas e vistas deslumbrantes do oceano.',
      es: 'Experimente la aventura de navegación definitiva en este impresionante catamarán de 15m. Perfecto para familias y grupos, con cubiertas espaciosas, comodidades modernas y vistas impresionantes del océano.',
    },
    type: BoatType.CATAMARAN,
    capacity: 12,
    length: 15,
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
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
        alt: 'Luxury catamaran sailing',
        isPrimary: true,
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        alt: 'Catamaran deck view',
        isPrimary: false,
      },
    ],
    amenities: [
      { id: '1', name: { en: 'WiFi', 'pt-BR': 'WiFi', 'pt-PT': 'WiFi', es: 'WiFi' } },
      { id: '2', name: { en: 'Air Conditioning', 'pt-BR': 'Ar Condicionado', 'pt-PT': 'Ar Condicionado', es: 'Aire Acondicionado' } },
      { id: '3', name: { en: 'Kitchen', 'pt-BR': 'Cozinha', 'pt-PT': 'Cozinha', es: 'Cocina' } },
      { id: '4', name: { en: 'Sound System', 'pt-BR': 'Sistema de Som', 'pt-PT': 'Sistema de Som', es: 'Sistema de Sonido' } },
    ],
    rating: 4.9,
    reviewCount: 127,
  },
  {
    id: '2',
    slug: 'classic-sailboat-lisbon',
    name: {
      en: 'Classic Sailboat Adventure',
      'pt-BR': 'Aventura em Veleiro Clássico',
      'pt-PT': 'Aventura em Veleiro Clássico',
      es: 'Aventura en Velero Clásico',
    },
    description: {
      en: 'Discover Lisbon\'s coastline aboard this beautiful 40ft classic sailboat. Ideal for romantic getaways and small group excursions with experienced crew.',
      'pt-BR': 'Descubra a costa de Lisboa a bordo deste belo veleiro clássico de 12m. Ideal para escapadas românticas e excursões em pequenos grupos com tripulação experiente.',
      'pt-PT': 'Descubra a costa de Lisboa a bordo deste belo veleiro clássico de 12m. Ideal para escapadas românticas e excursões em pequenos grupos com tripulação experiente.',
      es: 'Descubra la costa de Lisboa a bordo de este hermoso velero clásico de 12m. Ideal para escapadas románticas y excursiones en grupos pequeños con tripulación experimentada.',
    },
    type: BoatType.SAILBOAT,
    capacity: 8,
    length: 12,
    location: {
      id: '2',
      country: 'Portugal',
      city: 'Lisbon',
      region: 'Lisboa',
      coordinates: { latitude: 38.7223, longitude: -9.1393 },
    },
    priceUSD: 450,
    priceEUR: 420,
    priceGBP: 360,
    priceBRL: 2250,
    images: [
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
        alt: 'Classic sailboat',
        isPrimary: true,
      },
    ],
    amenities: [
      { id: '5', name: { en: 'GPS Navigation', 'pt-BR': 'Navegação GPS', 'pt-PT': 'Navegação GPS', es: 'Navegación GPS' } },
      { id: '6', name: { en: 'Safety Equipment', 'pt-BR': 'Equipamento de Segurança', 'pt-PT': 'Equipamento de Segurança', es: 'Equipo de Seguridad' } },
      { id: '7', name: { en: 'Snorkeling Gear', 'pt-BR': 'Equipamento de Snorkeling', 'pt-PT': 'Equipamento de Snorkeling', es: 'Equipo de Snorkeling' } },
    ],
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: '3',
    slug: 'speedboat-rio-janeiro',
    name: {
      en: 'Rio Speedboat Thrill',
      'pt-BR': 'Emoção na Lancha Rio',
      'pt-PT': 'Emoção na Lancha Rio',
      es: 'Emoción en Lancha Rápida Rio',
    },
    description: {
      en: 'Experience the thrill of Rio\'s waters on this powerful speedboat. Perfect for adventure seekers and water sports enthusiasts.',
      'pt-BR': 'Experimente a emoção das águas do Rio nesta poderosa lancha. Perfeita para aventureiros e entusiastas de esportes aquáticos.',
      'pt-PT': 'Experimente a emoção das águas do Rio nesta poderosa lancha. Perfeita para aventureiros e entusiastas de desportos aquáticos.',
      es: 'Experimente la emoción de las aguas de Río en esta potente lancha rápida. Perfecta para buscadores de aventuras y entusiastas de los deportes acuáticos.',
    },
    type: BoatType.MOTORBOAT,
    capacity: 6,
    length: 8,
    location: {
      id: '5',
      country: 'Brazil',
      city: 'Rio de Janeiro',
      region: 'Sudeste',
      coordinates: { latitude: -22.9068, longitude: -43.1729 },
    },
    priceUSD: 320,
    priceEUR: 290,
    priceGBP: 250,
    priceBRL: 1600,
    images: [
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80',
        alt: 'Speedboat on water',
        isPrimary: true,
      },
    ],
    amenities: [
      { id: '8', name: { en: 'Water Skis', 'pt-BR': 'Esqui Aquático', 'pt-PT': 'Esqui Aquático', es: 'Esquí Acuático' } },
      { id: '9', name: { en: 'Wakeboard', 'pt-BR': 'Wakeboard', 'pt-PT': 'Wakeboard', es: 'Wakeboard' } },
      { id: '10', name: { en: 'Cooler', 'pt-BR': 'Caixa Térmica', 'pt-PT': 'Caixa Térmica', es: 'Nevera' } },
    ],
    rating: 4.8,
    reviewCount: 54,
  },
  {
    id: '4',
    slug: 'luxury-yacht-porto',
    name: {
      en: 'Porto Luxury Yacht',
      'pt-BR': 'Iate de Luxo Porto',
      'pt-PT': 'Iate de Luxo Porto',
      es: 'Yate de Lujo Oporto',
    },
    description: {
      en: 'Indulge in luxury aboard this magnificent 60ft yacht. Features premium amenities, professional crew, and unforgettable views of Porto\'s coastline.',
      'pt-BR': 'Entregue-se ao luxo a bordo deste magnífico iate de 18m. Possui comodidades premium, tripulação profissional e vistas inesquecíveis da costa do Porto.',
      'pt-PT': 'Entregue-se ao luxo a bordo deste magnífico iate de 18m. Possui comodidades premium, tripulação profissional e vistas inesquecíveis da costa do Porto.',
      es: 'Disfrute del lujo a bordo de este magnífico yate de 18m. Cuenta con comodidades premium, tripulación profesional y vistas inolvidables de la costa de Oporto.',
    },
    type: BoatType.YACHT,
    capacity: 15,
    length: 18,
    location: {
      id: '3',
      country: 'Portugal',
      city: 'Porto',
      region: 'Norte',
      coordinates: { latitude: 41.1579, longitude: -8.6291 },
    },
    priceUSD: 1200,
    priceEUR: 1100,
    priceGBP: 950,
    priceBRL: 6000,
    images: [
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80',
        alt: 'Luxury yacht',
        isPrimary: true,
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80',
        alt: 'Yacht interior',
        isPrimary: false,
      },
    ],
    amenities: [
      { id: '11', name: { en: 'Jacuzzi', 'pt-BR': 'Jacuzzi', 'pt-PT': 'Jacuzzi', es: 'Jacuzzi' } },
      { id: '12', name: { en: 'Chef Service', 'pt-BR': 'Serviço de Chef', 'pt-PT': 'Serviço de Chef', es: 'Servicio de Chef' } },
      { id: '13', name: { en: 'Bar', 'pt-BR': 'Bar', 'pt-PT': 'Bar', es: 'Bar' } },
      { id: '14', name: { en: 'Satellite TV', 'pt-BR': 'TV por Satélite', 'pt-PT': 'TV por Satélite', es: 'TV Satélite' } },
      { id: '15', name: { en: 'Sun Deck', 'pt-BR': 'Deck Solar', 'pt-PT': 'Deck Solar', es: 'Terraza Solar' } },
    ],
    rating: 5.0,
    reviewCount: 203,
  },
  {
    id: '5',
    slug: 'fishing-boat-sao-paulo',
    name: {
      en: 'São Paulo Fishing Experience',
      'pt-BR': 'Experiência de Pesca São Paulo',
      'pt-PT': 'Experiência de Pesca São Paulo',
      es: 'Experiencia de Pesca São Paulo',
    },
    description: {
      en: 'Join us for an authentic fishing experience along São Paulo\'s coast. Equipped with professional fishing gear and guided by expert local fishermen.',
      'pt-BR': 'Junte-se a nós para uma experiência autêntica de pesca ao longo da costa de São Paulo. Equipado com equipamento de pesca profissional e guiado por pescadores locais experientes.',
      'pt-PT': 'Junte-se a nós para uma experiência autêntica de pesca ao longo da costa de São Paulo. Equipado com equipamento de pesca profissional e guiado por pescadores locais experientes.',
      es: 'Únase a nosotros para una experiencia auténtica de pesca a lo largo de la costa de São Paulo. Equipado con equipo de pesca profesional y guiado por pescadores locales expertos.',
    },
    type: BoatType.FISHING_BOAT,
    capacity: 10,
    length: 10,
    location: {
      id: '4',
      country: 'Brazil',
      city: 'São Paulo',
      region: 'Sudeste',
      coordinates: { latitude: -23.5505, longitude: -46.6333 },
    },
    priceUSD: 380,
    priceEUR: 350,
    priceGBP: 300,
    priceBRL: 1900,
    images: [
      {
        id: '7',
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
        alt: 'Fishing boat',
        isPrimary: true,
      },
    ],
    amenities: [
      { id: '16', name: { en: 'Fishing Rods', 'pt-BR': 'Varas de Pesca', 'pt-PT': 'Varas de Pesca', es: 'Cañas de Pescar' } },
      { id: '17', name: { en: 'Bait & Tackle', 'pt-BR': 'Isca e Equipamento', 'pt-PT': 'Isca e Equipamento', es: 'Cebo y Equipo' } },
      { id: '18', name: { en: 'Fish Finder', 'pt-BR': 'Sonda de Pesca', 'pt-PT': 'Sonda de Pesca', es: 'Detector de Peces' } },
      { id: '19', name: { en: 'Ice Box', 'pt-BR': 'Caixa de Gelo', 'pt-PT': 'Caixa de Gelo', es: 'Caja de Hielo' } },
    ],
    rating: 4.6,
    reviewCount: 76,
  },
  {
    id: '6',
    slug: 'jet-ski-santa-catarina',
    name: {
      en: 'Santa Catarina Jet Ski',
      'pt-BR': 'Jet Ski Santa Catarina',
      'pt-PT': 'Jet Ski Santa Catarina',
      es: 'Moto de Agua Santa Catarina',
    },
    description: {
      en: 'Feel the adrenaline rush with our high-performance jet ski. Explore Santa Catarina\'s beautiful beaches at your own pace.',
      'pt-BR': 'Sinta a adrenalina com nosso jet ski de alta performance. Explore as belas praias de Santa Catarina no seu próprio ritmo.',
      'pt-PT': 'Sinta a adrenalina com o nosso jet ski de alta performance. Explore as belas praias de Santa Catarina no seu próprio ritmo.',
      es: 'Sienta la adrenalina con nuestra moto de agua de alto rendimiento. Explore las hermosas playas de Santa Catarina a su propio ritmo.',
    },
    type: BoatType.JETSKI,
    capacity: 2,
    length: 3,
    location: {
      id: '6',
      country: 'Brazil',
      city: 'Santa Catarina',
      region: 'Sul',
      coordinates: { latitude: -27.5954, longitude: -48.5480 },
    },
    priceUSD: 150,
    priceEUR: 140,
    priceGBP: 120,
    priceBRL: 750,
    images: [
      {
        id: '8',
        url: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80',
        alt: 'Jet ski on water',
        isPrimary: true,
      },
    ],
    amenities: [
      { id: '20', name: { en: 'Life Jackets', 'pt-BR': 'Coletes Salva-vidas', 'pt-PT': 'Coletes Salva-vidas', es: 'Chalecos Salvavidas' } },
      { id: '21', name: { en: 'Waterproof Storage', 'pt-BR': 'Compartimento Impermeável', 'pt-PT': 'Compartimento Impermeável', es: 'Almacenamiento Impermeable' } },
    ],
    rating: 4.5,
    reviewCount: 42,
  },
];

export default function BoatsPage() {
  const params = useParams();
  const locale = params.locale as 'en' | 'pt-BR' | 'pt-PT' | 'es';
  const t = useTranslations('boats');
  const tLocations = useTranslations('locations');
  const tTypes = useTranslations('boatTypes');
  const tCommon = useTranslations('common');

  // View and filter state
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('boat-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('boat-favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = (boatId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(boatId)) {
        newFavorites.delete(boatId);
      } else {
        newFavorites.add(boatId);
      }
      return newFavorites;
    });
  };

  // Filter boats based on all criteria
  const filteredBoats = useMemo(() => {
    return mockBoats.filter((boat) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const nameMatch = boat.name[locale].toLowerCase().includes(searchLower);
        const locationMatch = boat.location.city.toLowerCase().includes(searchLower);
        const descriptionMatch = boat.description[locale].toLowerCase().includes(searchLower);
        if (!nameMatch && !locationMatch && !descriptionMatch) return false;
      }

      // Type filter
      if (selectedType !== 'all' && boat.type !== selectedType) return false;

      // Location filter
      if (selectedLocation !== 'all' && boat.location.city.toLowerCase() !== selectedLocation.toLowerCase()) return false;

      // Capacity filter
      if (selectedCapacity !== 'all') {
        const capacity = boat.capacity;
        if (selectedCapacity === 'small' && capacity > 6) return false;
        if (selectedCapacity === 'medium' && (capacity < 7 || capacity > 12)) return false;
        if (selectedCapacity === 'large' && capacity < 13) return false;
      }

      // Price range filter (using USD)
      if (selectedPriceRange !== 'all') {
        const price = boat.priceUSD;
        if (selectedPriceRange === 'budget' && price > 300) return false;
        if (selectedPriceRange === 'mid' && (price < 301 || price > 700)) return false;
        if (selectedPriceRange === 'luxury' && price < 701) return false;
      }

      // Favorites filter
      if (showFavoritesOnly && !favorites.has(boat.id)) return false;

      return true;
    });
  }, [searchQuery, selectedType, selectedLocation, selectedCapacity, selectedPriceRange, showFavoritesOnly, favorites, locale]);

  // Get unique locations for filter
  const locations = useMemo(() => {
    const uniqueLocations = new Set(mockBoats.map((boat) => boat.location.city));
    return Array.from(uniqueLocations);
  }, []);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedLocation('all');
    setSelectedCapacity('all');
    setSelectedPriceRange('all');
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedType !== 'all' || selectedLocation !== 'all' ||
    selectedCapacity !== 'all' || selectedPriceRange !== 'all' || showFavoritesOnly;

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('title'),
    description: t('description'),
    numberOfItems: filteredBoats.length,
    itemListElement: filteredBoats.slice(0, 10).map((boat, index) => {
      const boatName = boat.name[locale as 'en' | 'pt-BR' | 'pt-PT' | 'es'] || boat.name.en;
      const boatDescription = boat.description[locale as 'en' | 'pt-BR' | 'pt-PT' | 'es'] || boat.description.en;

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: boatName,
          description: boatDescription,
          image: boat.images[0]?.url,
          offers: {
            '@type': 'Offer',
            price: boat.priceUSD,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `https://villasboats.com/${locale}/boats/${boat.slug}`,
          },
          aggregateRating: boat.rating && boat.reviewCount ? {
            '@type': 'AggregateRating',
            ratingValue: boat.rating,
            reviewCount: boat.reviewCount,
            bestRating: 5,
            worstRating: 1,
          } : undefined,
        },
      };
    }),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {t('title')}
            </h1>
            <p className="text-lg text-white/90">
              {t('description')}
            </p>
          </div>
        </Container>
      </section>

      {/* Filters and View Controls */}
      <section className="border-b border-border bg-background">
        <Container className="py-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`${tCommon('search')}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder={t('type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allTypes')}</SelectItem>
                <SelectItem value={BoatType.SAILBOAT}>{tTypes('SAILBOAT')}</SelectItem>
                <SelectItem value={BoatType.MOTORBOAT}>{tTypes('MOTORBOAT')}</SelectItem>
                <SelectItem value={BoatType.CATAMARAN}>{tTypes('CATAMARAN')}</SelectItem>
                <SelectItem value={BoatType.YACHT}>{tTypes('YACHT')}</SelectItem>
                <SelectItem value={BoatType.JETSKI}>{tTypes('JETSKI')}</SelectItem>
                <SelectItem value={BoatType.SPEEDBOAT}>{tTypes('SPEEDBOAT')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder={t('location')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allLocations')}</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCapacity} onValueChange={setSelectedCapacity}>
              <SelectTrigger>
                <SelectValue placeholder={t('capacity')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allSizes')}</SelectItem>
                <SelectItem value="small">{t('smallCapacity')}</SelectItem>
                <SelectItem value="medium">{t('mediumCapacity')}</SelectItem>
                <SelectItem value="large">{t('largeCapacity')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder={t('price')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allPrices')}</SelectItem>
                <SelectItem value="budget">{t('budgetPrice')}</SelectItem>
                <SelectItem value="mid">{t('midPrice')}</SelectItem>
                <SelectItem value="luxury">{t('luxuryPrice')}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showFavoritesOnly ? 'default' : 'outline'}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              {t('favorites')}
            </Button>
          </div>

          {/* Results count and controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {filteredBoats.length} {t('available')}
              </span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 gap-1 text-xs"
                >
                  <X className="h-3 w-3" />
                  {t('clearFilters')}
                </Button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border p-1">
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                aria-label={t('gridView')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                aria-label={t('listView')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setViewMode('map')}
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                aria-label={t('mapView')}
              >
                <MapIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Boats Grid/List/Map */}
      <section className="py-12">
        <Container>
          {viewMode === 'map' ? (
            <div className="rounded-lg border border-border bg-muted/50 p-12 text-center">
              <MapIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                {t('mapViewComingSoon')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('mapViewDescription')}
              </p>
            </div>
          ) : filteredBoats.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/50 p-12 text-center">
              <p className="text-lg font-medium">{t('noBoats')}</p>
              <p className="text-sm text-muted-foreground">{t('noBoatsDescription')}</p>
              <Button onClick={clearFilters} className="mt-4">
                {t('clearFilters')}
              </Button>
            </div>
          ) : (
            <BoatGrid
              boats={filteredBoats}
              variant={viewMode as 'grid' | 'list'}
              locale={locale}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </Container>
      </section>
    </div>
    </>
  );
}
