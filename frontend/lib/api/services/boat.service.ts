import { apiClient } from '../client';
import type { BoatResponse, BoatSearchParams, PageResponse, CreateBoatRequest, UpdateBoatRequest } from '@/types/api';

export class BoatService {
  /**
   * Get all boats with optional filters
   */
  static async getAll(params?: BoatSearchParams): Promise<BoatResponse[]> {
    const { data } = await apiClient.get<BoatResponse[]>('/boats', { params });
    return data;
  }

  /**
   * Get boats with pagination
   */
  static async getPage(params?: BoatSearchParams): Promise<PageResponse<BoatResponse>> {
    const { data } = await apiClient.get<PageResponse<BoatResponse>>('/boats/page', { params });
    return data;
  }

  /**
   * Get a single boat by ID
   */
  static async getById(id: string): Promise<BoatResponse> {
    const { data } = await apiClient.get<BoatResponse>(`/boats/${id}`);
    return data;
  }

  /**
   * Get a single boat by slug
   */
  static async getBySlug(slug: string): Promise<BoatResponse> {
    const { data } = await apiClient.get<BoatResponse>(`/boats/slug/${slug}`);
    return data;
  }

  /**
   * Search boats by query string
   */
  static async search(query: string, params?: BoatSearchParams): Promise<BoatResponse[]> {
    const { data } = await apiClient.get<BoatResponse[]>('/boats/search', {
      params: { query, ...params },
    });
    return data;
  }

  /**
   * Get boats by location
   */
  static async getByLocation(locationId: string, params?: BoatSearchParams): Promise<BoatResponse[]> {
    const { data } = await apiClient.get<BoatResponse[]>(`/boats/location/${locationId}`, { params });
    return data;
  }

  /**
   * Get featured boats (popular boats)
   */
  static async getFeatured(): Promise<BoatResponse[]> {
    const { data } = await apiClient.get<BoatResponse[]>('/boats/popular');
    return data;
  }

  /**
   * Create a new boat
   */
  static async create(request: CreateBoatRequest): Promise<BoatResponse> {
    const { data } = await apiClient.post<BoatResponse>('/boats', request);
    return data;
  }

  /**
   * Update an existing boat
   */
  static async update(id: string, request: UpdateBoatRequest): Promise<BoatResponse> {
    const { data } = await apiClient.put<BoatResponse>(`/boats/${id}`, request);
    return data;
  }

  /**
   * Delete a boat
   */
  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/boats/${id}`);
  }
}
