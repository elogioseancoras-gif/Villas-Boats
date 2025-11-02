'use client';

import {
  Wifi,
  Wind,
  Utensils,
  Speaker,
  Snowflake,
  Waves,
  LifeBuoy,
  Navigation,
  Tv,
  Wine,
  Thermometer,
  Bluetooth,
  Droplet,
  Fish,
  Zap,
  Check
} from 'lucide-react';
import { Amenity } from '@/types';
import { cn } from '@/lib/utils';

interface BoatFeaturesProps {
  amenities: Amenity[];
  locale?: 'en' | 'pt-BR' | 'pt-PT' | 'es';
  className?: string;
}

// Map amenity names to icons
const getAmenityIcon = (amenityName: string) => {
  const lowerName = amenityName.toLowerCase();

  if (lowerName.includes('wifi') || lowerName.includes('internet')) return Wifi;
  if (lowerName.includes('air') || lowerName.includes('ac') || lowerName.includes('ar condicionado')) return Snowflake;
  if (lowerName.includes('kitchen') || lowerName.includes('cozinha') || lowerName.includes('cocina')) return Utensils;
  if (lowerName.includes('sound') || lowerName.includes('speaker') || lowerName.includes('som')) return Speaker;
  if (lowerName.includes('gps') || lowerName.includes('navigation')) return Navigation;
  if (lowerName.includes('tv') || lowerName.includes('television')) return Tv;
  if (lowerName.includes('bar') || lowerName.includes('wine')) return Wine;
  if (lowerName.includes('jacuzzi') || lowerName.includes('hot tub')) return Thermometer;
  if (lowerName.includes('bluetooth')) return Bluetooth;
  if (lowerName.includes('shower') || lowerName.includes('bathroom') || lowerName.includes('chuveiro')) return Droplet;
  if (lowerName.includes('fishing') || lowerName.includes('pesca')) return Fish;
  if (lowerName.includes('electric') || lowerName.includes('power') || lowerName.includes('elétrico')) return Zap;
  if (lowerName.includes('safety') || lowerName.includes('life') || lowerName.includes('segurança')) return LifeBuoy;
  if (lowerName.includes('sun') || lowerName.includes('deck') || lowerName.includes('solar')) return Wind;
  if (lowerName.includes('water') || lowerName.includes('snorkel') || lowerName.includes('ski')) return Waves;

  // Default icon
  return Check;
};

export function BoatFeatures({ amenities, locale = 'en', className }: BoatFeaturesProps) {
  if (!amenities || amenities.length === 0) {
    return (
      <div className={cn("rounded-lg border border-border bg-card p-6", className)}>
        <h2 className="mb-4 text-xl font-heading font-semibold text-foreground">
          Features & Amenities
        </h2>
        <p className="text-sm text-muted-foreground">
          No amenities information available for this boat.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-border bg-card p-6", className)}>
      <h2 className="mb-6 text-xl font-heading font-semibold text-foreground">
        Features & Amenities
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((amenity) => {
          const IconComponent = getAmenityIcon(amenity.name.en);
          const amenityName = amenity.name[locale] || amenity.name.en;

          return (
            <div
              key={amenity.id}
              className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <IconComponent className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {amenityName}
              </span>
            </div>
          );
        })}
      </div>

      {/* Feature Categories */}
      {amenities.length > 6 && (
        <div className="mt-6 border-t border-border pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">
                {amenities.filter(a =>
                  a.name.en.toLowerCase().includes('navigation') ||
                  a.name.en.toLowerCase().includes('gps') ||
                  a.name.en.toLowerCase().includes('safety')
                ).length}
              </span>
              <span className="text-xs text-muted-foreground">Safety Features</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">
                {amenities.filter(a =>
                  a.name.en.toLowerCase().includes('wifi') ||
                  a.name.en.toLowerCase().includes('tv') ||
                  a.name.en.toLowerCase().includes('bluetooth') ||
                  a.name.en.toLowerCase().includes('sound')
                ).length}
              </span>
              <span className="text-xs text-muted-foreground">Entertainment</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">
                {amenities.filter(a =>
                  a.name.en.toLowerCase().includes('kitchen') ||
                  a.name.en.toLowerCase().includes('bar') ||
                  a.name.en.toLowerCase().includes('bathroom') ||
                  a.name.en.toLowerCase().includes('shower')
                ).length}
              </span>
              <span className="text-xs text-muted-foreground">Comfort</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">
                {amenities.filter(a =>
                  a.name.en.toLowerCase().includes('water') ||
                  a.name.en.toLowerCase().includes('fishing') ||
                  a.name.en.toLowerCase().includes('snorkel') ||
                  a.name.en.toLowerCase().includes('ski')
                ).length}
              </span>
              <span className="text-xs text-muted-foreground">Water Sports</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
