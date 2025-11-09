'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users, Ruler, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Boat } from '@/types';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BoatCardProps {
  boat: Boat;
  variant?: 'grid' | 'list';
  locale?: 'en' | 'pt-BR' | 'pt-PT' | 'es';
  isFavorite?: boolean;
  onToggleFavorite?: (boatId: string) => void;
}

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  BRL: 'R$',
};

export function BoatCard({
  boat,
  variant = 'grid',
  locale = 'en',
  isFavorite = false,
  onToggleFavorite
}: BoatCardProps) {
  const { currency } = useCurrency();
  const t = useTranslations('boats');
  const tCommon = useTranslations('common');
  const tBoatTypes = useTranslations('boatTypes');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const price = boat[`price${currency}`] || boat.priceUSD;
  const currencySymbol = currencySymbols[currency];
  const name = boat.name[locale] || boat.name.en;
  const description = boat.description[locale] || boat.description.en;

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) =>
      prev === 0 ? boat.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) =>
      prev === boat.images.length - 1 ? 0 : prev + 1
    );
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFavorite?.(boat.id);
  };

  if (variant === 'list') {
    return (
      <Link href={`/boats/${boat.slug}`} className="group">
        <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 p-0 flex flex-col sm:flex-row">
          {/* Image Section */}
          <div className="relative h-64 sm:h-auto sm:w-80 flex-shrink-0 overflow-hidden">
            <Image
              src={boat.images[currentImageIndex]?.url || '/placeholder-boat.jpg'}
              alt={boat.images[currentImageIndex]?.alt?.[locale] || boat.images[currentImageIndex]?.alt?.en || name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 320px"
            />

            {/* Image Navigation */}
            {boat.images.length > 1 && (
              <>
                <Button
                  onClick={handlePreviousImage}
                  size="icon-sm"
                  variant="ghost"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                  aria-label={t('previousImage')}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
                <Button
                  onClick={handleNextImage}
                  size="icon-sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                  aria-label={t('nextImage')}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </>
            )}

            {/* Favorite Button */}
            <Button
              onClick={toggleFavorite}
              size="icon-sm"
              variant="ghost"
              className="absolute right-3 top-3 rounded-full bg-white/90 transition-all hover:bg-white hover:scale-110"
              aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            >
              <Heart className={cn("h-5 w-5", isFavorite ? "fill-primary text-primary" : "text-muted-foreground")} />
            </Button>

            {/* Boat Type Badge */}
            <Badge className="absolute left-3 top-3 bg-primary/90 backdrop-blur-sm">
              {tBoatTypes(boat.type)}
            </Badge>
          </div>

          {/* Content Section */}
          <CardContent className="flex flex-1 flex-col p-6">
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="mb-1 text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{boat.location.city}, {boat.location.country}</span>
                </div>
              </div>

              {boat.rating && (
                <div className="flex items-center gap-1 rounded-full bg-secondary/20 px-2 py-1">
                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                  <span className="text-sm font-medium">{boat.rating.toFixed(1)}</span>
                  {boat.reviewCount && (
                    <span className="text-xs text-muted-foreground">({boat.reviewCount})</span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>

            {/* Specifications */}
            <div className="mb-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{boat.capacity}</span>
                <span className="text-muted-foreground">{tCommon('guests')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{boat.length}m</span>
              </div>
            </div>

            {/* Amenities */}
            {boat.amenities && boat.amenities.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {boat.amenities.slice(0, 4).map((amenity) => (
                  <Badge
                    key={amenity.id}
                    variant="secondary"
                    className="bg-muted"
                  >
                    {amenity.name[locale] || amenity.name.en}
                  </Badge>
                ))}
                {boat.amenities.length > 4 && (
                  <Badge variant="secondary" className="bg-muted">
                    +{boat.amenities.length - 4} {t('more')}
                  </Badge>
                )}
              </div>
            )}

            {/* Footer */}
            <CardFooter className="mt-auto p-0 pt-4 border-t border-border">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">{tCommon('from')}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">
                    {currencySymbol}{price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">{tCommon('perDay')}</span>
                </div>
              </div>
              <div className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors group-hover:bg-primary-dark ml-auto">
                {t('viewDetails')}
              </div>
            </CardFooter>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Grid variant (default)
  return (
    <Link href={`/boats/${boat.slug}`} className="group">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 p-0">
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={boat.images[currentImageIndex]?.url || '/placeholder-boat.jpg'}
            alt={boat.images[currentImageIndex]?.alt?.[locale] || boat.images[currentImageIndex]?.alt?.en || name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Image Navigation */}
          {boat.images.length > 1 && (
            <>
              <Button
                onClick={handlePreviousImage}
                size="icon-sm"
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                aria-label={t('previousImage')}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <Button
                onClick={handleNextImage}
                size="icon-sm"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                aria-label={t('nextImage')}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>

              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {boat.images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-all",
                      index === currentImageIndex
                        ? "bg-white w-4"
                        : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Favorite Button */}
          <Button
            onClick={toggleFavorite}
            size="icon-sm"
            variant="ghost"
            className="absolute right-3 top-3 rounded-full bg-white/90 transition-all hover:bg-white hover:scale-110"
            aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
          >
            <Heart className={cn("h-4 w-4", isFavorite ? "fill-primary text-primary" : "text-muted-foreground")} />
          </Button>

          {/* Boat Type Badge */}
          <Badge className="absolute left-3 top-3 bg-primary/90 backdrop-blur-sm">
            {tBoatTypes(boat.type)}
          </Badge>
        </div>

        <CardContent className="p-4">
          {/* Header */}
          <div className="mb-2">
            <h3 className="mb-1 text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{boat.location.city}, {boat.location.country}</span>
            </div>
          </div>

          {/* Specifications */}
          <div className="mb-3 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{boat.capacity}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{boat.length}m</span>
            </div>
            {boat.rating && (
              <div className="flex items-center gap-1.5 ml-auto">
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                <span className="font-medium">{boat.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-3 border-t border-border">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{tCommon('from')}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-foreground">
                {currencySymbol}{price.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">{tCommon('perDay')}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
