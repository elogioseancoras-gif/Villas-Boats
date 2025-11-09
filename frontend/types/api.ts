// Enums matching backend
export type Currency = 'USD' | 'EUR' | 'GBP' | 'BRL';
export type BoatType = 'SAILBOAT' | 'CATAMARAN' | 'MOTOR_YACHT' | 'GULET' | 'OTHER';
export type BoatStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type UserRole = 'CUSTOMER' | 'ADMIN';
export type Language = 'en' | 'pt-BR' | 'pt-PT' | 'es';

// I18N type
export type I18nString = {
  [key in Language]?: string;
};

// Location Response
export interface LocationResponse {
  id: string;
  country: string;
  city: string;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  nameI18n: I18nString;
  descriptionI18n: I18nString;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Boat Response
export interface BoatResponse {
  id: string;
  slug: string;
  nameI18n: I18nString;
  descriptionI18n: I18nString;
  shortDescriptionI18n: I18nString;
  type: BoatType;
  status: BoatStatus;
  make: string | null;
  model: string | null;
  year: number | null;
  lengthFeet: number | null;
  capacity: number;
  cabins: number | null;
  bathrooms: number | null;
  location: LocationResponse;
  pricePerDayUsd: number;
  pricePerDayEur: number;
  pricePerDayGbp: number;
  pricePerDayBrl: number;
  captainRequired: boolean;
  captainPricePerDayUsd: number | null;
  captainPricePerDayEur: number | null;
  captainPricePerDayGbp: number | null;
  captainPricePerDayBrl: number | null;
  primaryImageUrl: string | null;
  averageRating: number | null;
  reviewCount: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

// Customer Response
export interface CustomerResponse {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  preferredLanguage: Language;
}

// Booking Response
export interface BookingResponse {
  id: string;
  bookingReference: string;
  boat: BoatResponse;
  customer: CustomerResponse;
  startDatetime: string;
  endDatetime: string;
  guestCount: number;
  needsCaptain: boolean;
  currency: Currency;
  boatPricePerDay: number;
  captainPricePerDay: number;
  daysCount: number;
  extrasTotal: number;
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  totalPrice: number;
  status: BookingStatus;
  customerNotes: string | null;
  adminNotes: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Request DTOs
export interface CreateBookingRequest {
  boatId: string;
  startDatetime: string;
  endDatetime: string;
  guestCount: number;
  needsCaptain: boolean;
  currency: Currency;
  customerNotes?: string;
}

export interface UpdateBookingRequest {
  status?: BookingStatus;
  customerNotes?: string;
  adminNotes?: string;
  cancellationReason?: string;
  startDatetime?: string;
  endDatetime?: string;
  guestCount?: number;
  needsCaptain?: boolean;
}

export interface CreateLocationRequest {
  country: string;
  city: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  nameI18n?: I18nString;
  descriptionI18n?: I18nString;
  imageUrl?: string;
  isActive: boolean;
}

export interface UpdateLocationRequest {
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  nameI18n?: I18nString;
  descriptionI18n?: I18nString;
  imageUrl?: string;
  isActive?: boolean;
}

export interface CreateBoatRequest {
  nameI18n: I18nString;
  descriptionI18n: I18nString;
  shortDescriptionI18n: I18nString;
  type: BoatType;
  status: BoatStatus;
  make?: string;
  model?: string;
  year?: number;
  lengthFeet?: number;
  capacity: number;
  cabins?: number;
  bathrooms?: number;
  locationId: string;
  pricePerDayUsd: number;
  pricePerDayEur: number;
  pricePerDayGbp: number;
  pricePerDayBrl: number;
  captainRequired: boolean;
  captainPricePerDayUsd?: number;
  captainPricePerDayEur?: number;
  captainPricePerDayGbp?: number;
  captainPricePerDayBrl?: number;
  primaryImageUrl?: string;
}

export interface UpdateBoatRequest {
  nameI18n?: I18nString;
  descriptionI18n?: I18nString;
  shortDescriptionI18n?: I18nString;
  type?: BoatType;
  status?: BoatStatus;
  make?: string;
  model?: string;
  year?: number;
  lengthFeet?: number;
  capacity?: number;
  cabins?: number;
  bathrooms?: number;
  locationId?: string;
  pricePerDayUsd?: number;
  pricePerDayEur?: number;
  pricePerDayGbp?: number;
  pricePerDayBrl?: number;
  captainRequired?: boolean;
  captainPricePerDayUsd?: number;
  captainPricePerDayEur?: number;
  captainPricePerDayGbp?: number;
  captainPricePerDayBrl?: number;
  primaryImageUrl?: string;
}

// Search/Filter Parameters
export interface BoatSearchParams {
  type?: BoatType;
  locationId?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
  currency?: Currency;
  status?: BoatStatus;
  page?: number;
  size?: number;
  sort?: string;
}

export interface BookingSearchParams {
  status?: BookingStatus;
  customerId?: string;
  boatId?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// Pagination Response
export interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

// Auth DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  preferredLanguage: Language;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  preferredLanguage: Language;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Error Response
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
