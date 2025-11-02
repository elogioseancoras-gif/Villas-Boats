'use client';

import { Users, Ruler, Anchor, Gauge, Fuel, Bed, Waves } from 'lucide-react';
import { Boat } from '@/types';
import { cn } from '@/lib/utils';

interface BoatSpecsProps {
  boat: Boat;
  className?: string;
}

export function BoatSpecs({ boat, className }: BoatSpecsProps) {
  const specs = [
    {
      icon: Users,
      label: 'Capacity',
      value: `${boat.capacity} guests`,
    },
    {
      icon: Ruler,
      label: 'Length',
      value: `${boat.length}m`,
    },
    {
      icon: Anchor,
      label: 'Type',
      value: boat.type.replace('_', ' '),
    },
  ];

  // Add optional specs if they exist
  if (boat.cabins) {
    specs.push({
      icon: Bed,
      label: 'Cabins',
      value: `${boat.cabins}`,
    });
  }

  if (boat.bathrooms) {
    specs.push({
      icon: Waves,
      label: 'Bathrooms',
      value: `${boat.bathrooms}`,
    });
  }

  if (boat.enginePower) {
    specs.push({
      icon: Gauge,
      label: 'Engine Power',
      value: `${boat.enginePower} HP`,
    });
  }

  if (boat.fuelType) {
    specs.push({
      icon: Fuel,
      label: 'Fuel Type',
      value: boat.fuelType,
    });
  }

  return (
    <div className={cn("rounded-lg border border-border bg-card p-6", className)}>
      <h2 className="mb-6 text-xl font-heading font-semibold text-foreground">
        Specifications
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <spec.icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">{spec.label}</span>
              <span className="font-medium text-foreground">{spec.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Details */}
      {(boat.yearBuilt || boat.manufacturer || boat.model) && (
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Additional Details
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {boat.yearBuilt && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Year Built</span>
                <span className="font-medium text-foreground">{boat.yearBuilt}</span>
              </div>
            )}
            {boat.manufacturer && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Manufacturer</span>
                <span className="font-medium text-foreground">{boat.manufacturer}</span>
              </div>
            )}
            {boat.model && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Model</span>
                <span className="font-medium text-foreground">{boat.model}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
