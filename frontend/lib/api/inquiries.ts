import { apiClient } from './client';

export interface CreateInquiryRequest {
  boatId: string;
  startDatetime: string; // ISO 8601 format
  endDatetime: string; // ISO 8601 format
  guestCount: number;
  needsCaptain: boolean;
  currency: 'USD' | 'EUR' | 'GBP' | 'BRL';
  fullName: string;
  email: string;
  phone: string;
  customerNotes?: string;
}

export interface BookingResponse {
  id: string;
  bookingReference: string;
  boat: {
    id: string;
    name: Record<string, string>;
    slug: string;
  };
  customer: {
    id: string;
    email: string;
    fullName: string;
  };
  startDatetime: string;
  endDatetime: string;
  guestCount: number;
  needsCaptain: boolean;
  currency: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

/**
 * Submit a booking inquiry without authentication
 */
export async function createInquiry(
  data: CreateInquiryRequest
): Promise<BookingResponse> {
  const response = await apiClient.post<BookingResponse>(
    '/bookings/inquiries',
    data
  );
  return response.data;
}
