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
import { Card, CardContent } from '@/components/ui/card';
import { useBoats } from '@/lib/api/hooks/useBoats';

export default function BoatsPage() {
  const params = useParams();
  const locale = params.locale as 'en' | 'pt-BR' | 'pt-PT' | 'es';
  const t = useTranslations('boats');
  const tLocations = useTranslations('locations');
  const tTypes = useTranslations('boatTypes');
  const tCommon = useTranslations('common');

  // Fetch all boats from API
  const { data: apiBoats, isLoading, error } = useBoats();

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
    if (!apiBoats) return [];
    return apiBoats.filter((boat) => {
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
  }, [apiBoats, searchQuery, selectedType, selectedLocation, selectedCapacity, selectedPriceRange, showFavoritesOnly, favorites, locale]);

  // Get unique locations for filter
  const locations = useMemo(() => {
    if (!apiBoats) return [];
    const uniqueLocations = new Set(apiBoats.map((boat) => boat.location.city));
    return Array.from(uniqueLocations);
  }, [apiBoats]);

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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
            </div>
          ) : error ? (
            <div className="rounded-lg border border-border bg-muted/50 p-12 text-center">
              <p className="text-destructive text-lg font-medium mb-4">Failed to load boats. Please try again later.</p>
              <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            </div>
          ) : viewMode === 'map' ? (
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
