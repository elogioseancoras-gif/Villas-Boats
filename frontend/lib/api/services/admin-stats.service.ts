import { apiClient } from '../client';
import type { AdminStatsResponse } from '@/types/api';

export class AdminStatsService {
  /**
   * Get comprehensive admin statistics including bookings, boats, revenue, and trends
   * @returns Admin statistics with 30-day booking trends
   */
  static async getStatistics(): Promise<AdminStatsResponse> {
    const { data } = await apiClient.get<AdminStatsResponse>('/admin/stats');
    return data;
  }
}
