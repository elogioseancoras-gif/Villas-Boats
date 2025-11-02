/**
 * Villas Boats - TypeScript Type Definitions
 * Core entity types for the application
 */

// ============================================================================
// Enums
// ============================================================================

export enum BoatType {
  SAILBOAT = 'SAILBOAT',
  MOTORBOAT = 'MOTORBOAT',
  CATAMARAN = 'CATAMARAN',
  YACHT = 'YACHT',
  JETSKI = 'JETSKI',
  FISHING_BOAT = 'FISHING_BOAT',
  SPEEDBOAT = 'SPEEDBOAT',
}

export enum BoatStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  BRL = 'BRL',
}

export enum Language {
  EN = 'en',
  PT_BR = 'pt-BR',
  PT_PT = 'pt-PT',
  ES = 'es',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum RentalType {
  BAREBOAT = 'BAREBOAT',
  SKIPPERED = 'SKIPPERED',
  CREWED = 'CREWED',
  DAY_TRIP = 'DAY_TRIP',
  MULTI_DAY = 'MULTI_DAY',
}

// ============================================================================
// Location Types
// ============================================================================

export interface Location {
  id: string;
  country: 'Portugal' | 'Brazil';
  city: string;
  region?: string;
  coordinates?: Coordinates;
  marinas?: Marina[];
  description?: TranslatableString;
  image?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Marina {
  id: string;
  name: string;
  location: Location;
  coordinates: Coordinates;
  facilities?: string[];
  contactInfo?: ContactInfo;
}

// ============================================================================
// Boat Types
// ============================================================================

export interface Boat {
  id: string;
  slug: string;
  name: TranslatableString;
  description: TranslatableString;
  shortDescription?: TranslatableString;
  type: BoatType;
  status: BoatStatus;

  // Specifications
  make?: string;
  model?: string;
  year?: number;
  length: number;          // in feet
  capacity: number;        // max passengers
  cabins?: number;
  bathrooms?: number;

  // Location
  location: Location;
  marina?: Marina;

  // Pricing (multi-currency)
  priceUSD: number;
  priceEUR: number;
  priceGBP: number;
  priceBRL: number;

  // Media
  images: Image[];
  videos?: Video[];

  // Features & Amenities
  amenities: Amenity[];
  features?: Feature[];

  // Availability
  availableFrom?: Date;
  availableUntil?: Date;

  // Ratings & Reviews
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  owner?: BoatOwner;
}

export interface BoatOwner {
  id: string;
  name: string;
  type: 'INDIVIDUAL' | 'CHARTER_COMPANY';
  contactInfo?: ContactInfo;
  verificationStatus?: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
}

export interface Image {
  id: string;
  url: string;
  alt?: TranslatableString;
  caption?: TranslatableString;
  order?: number;
  isPrimary?: boolean;
}

export interface Video {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title?: TranslatableString;
  duration?: number;
}

export interface Amenity {
  id: string;
  name: TranslatableString;
  icon?: string;
  category?: 'SAFETY' | 'COMFORT' | 'NAVIGATION' | 'ENTERTAINMENT' | 'OTHER';
}

export interface Feature {
  id: string;
  name: TranslatableString;
  description?: TranslatableString;
  icon?: string;
}

// ============================================================================
// Search & Filter Types
// ============================================================================

export interface SearchParams {
  location?: string;
  dateFrom?: Date;
  dateTo?: Date;
  guests?: number;
  boatType?: BoatType[];
  priceMin?: number;
  priceMax?: number;
  currency?: Currency;
  amenities?: string[];
  lengthMin?: number;
  lengthMax?: number;
  sortBy?: 'price' | 'rating' | 'capacity' | 'length' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  locations: Location[];
  boatTypes: BoatType[];
  priceRange: { min: number; max: number };
  amenities: Amenity[];
  capacity: { min: number; max: number };
}

export interface SearchResults {
  boats: Boat[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  filters: FilterOptions;
}

// ============================================================================
// Booking Types
// ============================================================================

export interface BookingData {
  boatId: string;
  boat?: Boat;
  dateFrom: Date;
  dateTo: Date;
  guests: number;
  rentalType?: RentalType;
  extras?: BookingExtra[];

  // Customer info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  additionalInfo?: string;

  // Pricing
  basePrice: number;
  extrasTotal: number;
  totalPrice: number;
  currency: Currency;

  // Metadata
  createdAt?: Date;
}

export interface BookingExtra {
  id: string;
  name: TranslatableString;
  price: number;
  quantity?: number;
  required?: boolean;
}

export interface Reservation {
  id: string;
  bookingData: BookingData;
  status: ReservationStatus;
  confirmationCode?: string;
  confirmedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Customer Types
// ============================================================================

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country?: string;
  preferredLanguage?: Language;
  preferredCurrency?: Currency;
  reservations?: Reservation[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Review Types
// ============================================================================

export interface Review {
  id: string;
  boatId: string;
  customerId: string;
  customerName: string;
  rating: number;      // 1-5
  title?: string;
  comment?: string;
  createdAt: Date;
  verifiedBooking?: boolean;
}

// ============================================================================
// Admin Types
// ============================================================================

export interface DashboardStats {
  totalReservations: number;
  monthlyRevenue: number;
  occupancyRate: number;
  pendingRequests: number;
  activeBoats: number;
  totalCustomers: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  createdAt: Date;
  lastLoginAt?: Date;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface TranslatableString {
  en: string;
  'pt-BR': string;
  'pt-PT': string;
  es: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// Form Types
// ============================================================================

export interface BoatFormData {
  name: TranslatableString;
  description: TranslatableString;
  type: BoatType;
  capacity: number;
  length: number;
  locationId: string;
  priceUSD: number;
  priceEUR: number;
  priceGBP: number;
  priceBRL: number;
  amenityIds: string[];
  images: File[] | string[];
  status: BoatStatus;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  country?: string;
  preferredLanguage?: Language;
  preferredCurrency?: Currency;
}

export interface BookingFormData {
  boatId: string;
  dateFrom: string;      // ISO date string
  dateTo: string;        // ISO date string
  guests: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  additionalInfo?: string;
}

// ============================================================================
// Component Prop Types
// ============================================================================

export interface BoatCardProps {
  boat: Boat;
  variant?: 'grid' | 'list';
  showQuickBook?: boolean;
  onFavorite?: (boatId: string) => void;
  className?: string;
}

export interface SearchBarProps {
  variant?: 'hero' | 'inline' | 'compact';
  defaultValues?: Partial<SearchParams>;
  onSearch: (params: SearchParams) => void;
  className?: string;
}

export interface FilterPanelProps {
  filters: FilterOptions;
  activeFilters: Partial<SearchParams>;
  onFilterChange: (filters: Partial<SearchParams>) => void;
  onClearFilters: () => void;
  className?: string;
}

export interface BookingCardProps {
  boat: Boat;
  sticky?: boolean;
  onBookingComplete: (booking: BookingData) => void;
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

export const SUPPORTED_LOCATIONS = [
  { country: 'Portugal', city: 'Porto', region: 'Norte' },
  { country: 'Portugal', city: 'Lisbon', region: 'Lisboa' },
  { country: 'Portugal', city: 'Algarve', region: 'Algarve' },
  { country: 'Brazil', city: 'São Paulo', region: 'Sudeste' },
  { country: 'Brazil', city: 'Rio de Janeiro', region: 'Sudeste' },
  { country: 'Brazil', city: 'Santa Catarina', region: 'Sul' },
] as const;

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.BRL]: 'R$',
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  [Language.EN]: 'English',
  [Language.PT_BR]: 'Português (Brasil)',
  [Language.PT_PT]: 'Português (Portugal)',
  [Language.ES]: 'Español',
};
