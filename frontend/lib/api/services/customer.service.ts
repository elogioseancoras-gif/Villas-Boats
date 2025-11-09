import { apiClient } from '../client';
import type { CustomerWithStatsResponse, CustomerSearchParams, PageResponse, BookingResponse } from '@/types/api';

export class CustomerService {
  /**
   * Get customers with statistics and pagination
   * @param params Search and pagination parameters
   * @returns Paginated list of customers with booking statistics
   */
  static async getCustomers(params?: CustomerSearchParams): Promise<PageResponse<CustomerWithStatsResponse>> {
    const { data } = await apiClient.get<PageResponse<CustomerWithStatsResponse>>('/admin/customers', {
      params: {
        search: params?.search,
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        sortBy: params?.sortBy ?? 'createdAt',
        direction: params?.direction ?? 'DESC',
      },
    });
    return data;
  }

  /**
   * Get a single customer by ID with statistics
   * @param customerId Customer UUID
   * @returns Customer details with booking statistics
   */
  static async getCustomerById(customerId: string): Promise<CustomerWithStatsResponse> {
    const { data } = await apiClient.get<CustomerWithStatsResponse>(`/admin/customers/${customerId}`);
    return data;
  }

  /**
   * Get all bookings for a specific customer with pagination
   * @param customerId Customer UUID
   * @param page Page number (0-based)
   * @param size Page size
   * @returns Paginated list of customer's bookings
   */
  static async getCustomerBookings(
    customerId: string,
    page: number = 0,
    size: number = 10
  ): Promise<PageResponse<BookingResponse>> {
    const { data } = await apiClient.get<PageResponse<BookingResponse>>(
      `/admin/customers/${customerId}/bookings`,
      {
        params: { page, size },
      }
    );
    return data;
  }
}
