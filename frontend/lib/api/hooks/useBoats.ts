import { useQuery } from '@tanstack/react-query';
import { BoatService } from '../services/boat.service';
import { adaptBoats } from '../adapters/boat.adapter';

/**
 * Hook to fetch featured boats
 */
export function useFeaturedBoats() {
  return useQuery({
    queryKey: ['boats', 'featured'],
    queryFn: async () => {
      const response = await BoatService.getFeatured();
      return adaptBoats(response);
    },
  });
}

/**
 * Hook to fetch all boats with optional filters
 */
export function useBoats(params?: any) {
  return useQuery({
    queryKey: ['boats', 'all', params],
    queryFn: async () => {
      const response = await BoatService.getAll(params);
      return adaptBoats(response);
    },
  });
}

/**
 * Hook to fetch a single boat by slug
 */
export function useBoat(slug: string) {
  return useQuery({
    queryKey: ['boats', slug],
    queryFn: async () => {
      const response = await BoatService.getBySlug(slug);
      return adaptBoats([response])[0];
    },
    enabled: !!slug,
  });
}
