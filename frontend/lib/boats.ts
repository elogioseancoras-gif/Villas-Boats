/**
 * Stub file for metadata generation
 * This provides compile-time support for metadata.ts files
 * Actual data fetching happens via API services at runtime
 */

import { Language } from '@/types';

interface BoatLocation {
  city: string;
  country: string;
}

interface BoatImage {
  url: string;
  alt?: string;
}

interface Boat {
  slug: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  type: string;
  location: BoatLocation;
  images: BoatImage[];
}

/**
 * Returns null for metadata generation
 * Actual boat data is fetched via API services at runtime
 */
export function getBoatBySlug(slug: string): Boat | null {
  return null;
}
