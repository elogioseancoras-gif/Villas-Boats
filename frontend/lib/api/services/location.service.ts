import { apiClient } from '../client';
import type { LocationResponse, CreateLocationRequest, UpdateLocationRequest, PageResponse } from '@/types/api';

export class LocationService {
  /**
   * Get all locations (including inactive)
   */
  static async getAll(): Promise<LocationResponse[]> {
    const { data } = await apiClient.get<LocationResponse[]>('/locations');
    return data;
  }

  /**
   * Get locations with pagination
   */
  static async getPage(page: number = 0, size: number = 10): Promise<PageResponse<LocationResponse>> {
    const { data } = await apiClient.get<PageResponse<LocationResponse>>('/locations/page', {
      params: { page, size, sort: 'createdAt,desc' },
    });
    return data;
  }

  /**
   * Get only active locations
   */
  static async getActive(): Promise<LocationResponse[]> {
    const { data } = await apiClient.get<LocationResponse[]>('/locations/active');
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

  /**
   * Create a new location (admin only)
   */
  static async create(request: CreateLocationRequest): Promise<LocationResponse> {
    const { data } = await apiClient.post<LocationResponse>('/locations', request);
    return data;
  }

  /**
   * Update a location (admin only)
   */
  static async update(id: string, request: UpdateLocationRequest): Promise<LocationResponse> {
    const { data } = await apiClient.put<LocationResponse>(`/locations/${id}`, request);
    return data;
  }

  /**
   * Delete a location (admin only)
   */
  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/locations/${id}`);
  }
}
