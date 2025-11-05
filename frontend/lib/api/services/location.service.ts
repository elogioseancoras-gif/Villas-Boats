import { apiClient } from '../client';
import type { LocationResponse } from '@/types/api';

export class LocationService {
  /**
   * Get all active locations
   */
  static async getAll(): Promise<LocationResponse[]> {
    const { data } = await apiClient.get<LocationResponse[]>('/locations');
    return data;
  }

  /**
   * Get a single location by ID
   */
  static async getById(id: string): Promise<LocationResponse> {
    const { data } = await apiClient.get<LocationResponse>(`/locations/${id}`);
    return data;
  }

  /**
   * Get locations by country
   */
  static async getByCountry(country: string): Promise<LocationResponse[]> {
    const { data } = await apiClient.get<LocationResponse[]>(`/locations/country/${country}`);
    return data;
  }

  /**
   * Search locations by query string
   */
  static async search(query: string): Promise<LocationResponse[]> {
    const { data } = await apiClient.get<LocationResponse[]>('/locations/search', {
      params: { query },
    });
    return data;
  }
}
