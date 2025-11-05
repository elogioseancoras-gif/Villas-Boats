import { apiClient } from '../client';
import type {
  BookingResponse,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingSearchParams,
  PageResponse,
} from '@/types/api';

export class BookingService {
  /**
   * Get all bookings (admin only)
   */
  static async getAll(): Promise<BookingResponse[]> {
    const { data } = await apiClient.get<BookingResponse[]>('/bookings');
    return data;
  }

  /**
   * Get bookings with pagination (admin only)
   */
  static async getPage(params?: BookingSearchParams): Promise<PageResponse<BookingResponse>> {
    const { data } = await apiClient.get<PageResponse<BookingResponse>>('/bookings/page', { params });
    return data;
  }

  /**
   * Get current user's bookings
   */
  static async getMyBookings(page?: number, size?: number): Promise<PageResponse<BookingResponse>> {
    const { data } = await apiClient.get<PageResponse<BookingResponse>>('/bookings/my-bookings', {
      params: { page, size },
    });
    return data;
  }

  /**
   * Get bookings for a specific customer (admin only)
   */
  static async getCustomerBookings(
    customerId: string,
    page?: number,
    size?: number
  ): Promise<PageResponse<BookingResponse>> {
    const { data } = await apiClient.get<PageResponse<BookingResponse>>(`/bookings/customer/${customerId}`, {
      params: { page, size },
    });
    return data;
  }

  /**
   * Get bookings for a specific boat (admin only)
   */
  static async getBoatBookings(
    boatId: string,
    page?: number,
    size?: number
  ): Promise<PageResponse<BookingResponse>> {
    const { data } = await apiClient.get<PageResponse<BookingResponse>>(`/bookings/boat/${boatId}`, {
      params: { page, size },
    });
    return data;
  }

  /**
   * Get a single booking by ID
   */
  static async getById(id: string): Promise<BookingResponse> {
    const { data } = await apiClient.get<BookingResponse>(`/bookings/${id}`);
    return data;
  }

  /**
   * Get a booking by reference number
   */
  static async getByReference(bookingReference: string): Promise<BookingResponse> {
    const { data } = await apiClient.get<BookingResponse>(`/bookings/reference/${bookingReference}`);
    return data;
  }

  /**
   * Create a new booking
   */
  static async create(request: CreateBookingRequest): Promise<BookingResponse> {
    const { data } = await apiClient.post<BookingResponse>('/bookings', request);
    return data;
  }

  /**
   * Update a booking (admin only)
   */
  static async update(id: string, request: UpdateBookingRequest): Promise<BookingResponse> {
    const { data } = await apiClient.put<BookingResponse>(`/bookings/${id}`, request);
    return data;
  }

  /**
   * Confirm a booking (admin only)
   */
  static async confirm(id: string): Promise<BookingResponse> {
    const { data } = await apiClient.post<BookingResponse>(`/bookings/${id}/confirm`);
    return data;
  }

  /**
   * Cancel a booking
   */
  static async cancel(id: string, reason?: string): Promise<BookingResponse> {
    const { data } = await apiClient.post<BookingResponse>(`/bookings/${id}/cancel`, null, {
      params: { reason },
    });
    return data;
  }

  /**
   * Delete a booking (admin only)
   */
  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/bookings/${id}`);
  }
}
