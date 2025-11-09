import type { BoatResponse, LocationResponse } from '@/types/api';
import type { Boat, Location, Image, BoatType as FrontendBoatType, BoatStatus as FrontendBoatStatus, TranslatableString } from '@/types';

/**
 * Converts backend LocationResponse to frontend Location type
 */
export function adaptLocation(location: LocationResponse): Location {
  return {
    id: location.id,
    country: location.country as 'Portugal' | 'Brazil',
    city: location.city,
    region: location.region || undefined,
    coordinates: location.latitude && location.longitude
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
        }
      : undefined,
    description: location.descriptionI18n as TranslatableString,
    image: location.imageUrl || undefined,
  };
}

/**
 * Converts backend BoatResponse to frontend Boat type
 */
export function adaptBoat(boat: BoatResponse): Boat {
  // Create images array from primaryImageUrl
  const images: Image[] = boat.primaryImageUrl
    ? [
        {
          id: `${boat.id}-primary`,
          url: boat.primaryImageUrl,
          alt: boat.nameI18n as TranslatableString,
          isPrimary: true,
        },
      ]
    : [];

  return {
    id: boat.id,
    slug: boat.slug,
    name: boat.nameI18n as TranslatableString,
    description: boat.descriptionI18n as TranslatableString,
    shortDescription: boat.shortDescriptionI18n as TranslatableString,
    type: boat.type as FrontendBoatType,
    status: boat.status as FrontendBoatStatus,

    // Specifications
    make: boat.make || undefined,
    model: boat.model || undefined,
    year: boat.year || undefined,
    length: boat.lengthFeet || 0,
    capacity: boat.capacity,
    cabins: boat.cabins || undefined,
    bathrooms: boat.bathrooms || undefined,

    // Location
    location: adaptLocation(boat.location),

    // Pricing - backend uses pricePerDay*, frontend expects price*
    priceUSD: boat.pricePerDayUsd,
    priceEUR: boat.pricePerDayEur,
    priceGBP: boat.pricePerDayGbp,
    priceBRL: boat.pricePerDayBrl,

    // Media
    images,

    // Amenities - empty for now since backend doesn't return amenities in basic boat response
    amenities: [],

    // Ratings
    rating: boat.averageRating || undefined,
    reviewCount: boat.reviewCount || undefined,

    // Metadata
    createdAt: new Date(boat.createdAt),
    updatedAt: new Date(boat.updatedAt),
  };
}

/**
 * Converts an array of backend BoatResponse to frontend Boat types
 */
export function adaptBoats(boats: BoatResponse[]): Boat[] {
  return boats.map(adaptBoat);
}
