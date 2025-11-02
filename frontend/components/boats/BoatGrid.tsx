'use client';

import { useTranslations } from 'next-intl';
import { Boat } from '@/types';
import { BoatCard } from './BoatCard';
import { cn } from '@/lib/utils';

interface BoatGridProps {
  boats: Boat[];
  variant?: 'grid' | 'list';
  locale?: 'en' | 'pt-BR' | 'pt-PT' | 'es';
  className?: string;
  emptyStateMessage?: string;
  favorites?: Set<string>;
  onToggleFavorite?: (boatId: string) => void;
}

export function BoatGrid({
  boats,
  variant = 'grid',
  locale = 'en',
  className,
  emptyStateMessage,
  favorites,
  onToggleFavorite
}: BoatGridProps) {
  const t = useTranslations('boats');

  if (boats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-6">
          <svg
            className="h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-heading font-semibold text-foreground">
          {t('noBoats')}
        </h3>
        <p className="max-w-md text-sm text-muted-foreground">
          {emptyStateMessage || t('noBoatsDescription')}
        </p>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {boats.map((boat) => (
          <BoatCard
            key={boat.id}
            boat={boat}
            variant="list"
            locale={locale}
            isFavorite={favorites?.has(boat.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
      className
    )}>
      {boats.map((boat) => (
        <BoatCard
          key={boat.id}
          boat={boat}
          variant="grid"
          locale={locale}
          isFavorite={favorites?.has(boat.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
