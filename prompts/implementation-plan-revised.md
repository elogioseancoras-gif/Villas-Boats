# Villas Boats - Revised Implementation Plan

**Last Updated**: 2025-11-09
**Status**: Waves 1, 2, 3, 3.6 Complete + Wave 4 Phases 2 & 3 Complete - Full Booking System + Partial Admin Dashboard

---

## 🎯 Executive Summary

Based on comprehensive analysis of the existing codebase:

### Backend Status: ✅ 100% Complete
- Spring Boot 3.3.5 with Java 21
- PostgreSQL 16 with JSONB, triggers, advanced indexing
- 43 REST endpoints fully implemented
- JWT authentication with role-based access
- Multi-currency support (USD, EUR, GBP, BRL)
- Multi-language i18n via JSONB
- Comprehensive validation and error handling

### Frontend Status: 🟢 ~78% Complete
**Implemented (✅)**:
- Next.js 16 project structure
- next-intl i18n (EN, PT-BR, PT-PT, ES)
- ShadCN UI components (Button, Card, Input, Select, Badge, Separator, Tabs)
- Currency context with localStorage persistence
- Public pages: Homepage, Boats List, Boat Details, Destinations, How It Works
- Boat components: BoatCard, BoatGrid, BoatGallery, BoatFeatures, BoatSpecs
- Layout components: Header, Footer, Container, Layout
- **Backend integration** - ✅ API client with Axios and JWT interceptors
- **Real data** - ✅ Homepage and Boats List using live backend API
- **API services** - ✅ BoatService, LocationService, BookingService (inquiries), AuthService, UserService
- **Type safety** - ✅ TypeScript types matching backend DTOs
- **Authentication** - ✅ Login/registration system, AuthContext, protected routes
- **User profile** - ✅ Profile management page with password change and account deletion
- **Booking system** - ✅ BookingWidget component (482 lines, production-ready)
  - Multi-currency support, date/time selection, price calculation
  - Customer info collection, form validation, API integration
  - ✅ Integrated into boat detail pages (Wave 3.6 COMPLETE)
  - ✅ Booking confirmation page with all 4 languages
  - ✅ E2E test suite (4 comprehensive test scenarios)
- Responsive design with TailwindCSS 4
- SEO with JSON-LD structured data

**In Progress (🟡)**:
- **Admin dashboard** - Bookings and Boats management complete (~35% done), need Dashboard, Locations, Customers (Wave 4 - 6-8h remaining)

**Missing (❌)**:
- **Testing** - E2E infrastructure exists (~15% complete), needs more scenarios and unit tests (Wave 6 - 5-7h)
- **Production deployment** - No Docker, CI/CD, or infrastructure config (Wave 7 - 8-10h)

---

## 📋 Implementation Waves (Revised)

### ✅ Wave 0: Foundation (Already Complete)
**Completion**: 100%

- [x] Next.js 16 project initialized
- [x] next-intl configured (4 languages)
- [x] TailwindCSS 4 setup
- [x] ShadCN UI components installed
- [x] Project structure established
- [x] Currency context implemented

---

### ✅ Wave 1: Backend Integration (Priority 1) - COMPLETE
**Completion**: 100%
**Time Spent**: ~4 hours
**Completed**: 2025-11-04

#### Tasks:
1. **Create API Client Layer** (1.5h)
   - Implement Axios instance with interceptors
   - Base URL configuration with environment variables
   - Request/response type definitions matching backend DTOs
   - Error handling and retry logic
   - JWT token management

2. **Implement Data Services** (2h)
   - BoatService: CRUD operations for boats
   - LocationService: Fetch locations
   - BookingService: Manage bookings
   - AuthService: Login, register, token refresh
   - UserService: Profile management

3. **Replace Mock Data** (1h)
   - Update Homepage to use real boats API
   - Update Boats List to use real data with filters
   - Update Boat Details to fetch individual boat
   - Implement loading states and error boundaries

4. **Testing** (0.5h)
   - Test API connectivity
   - Validate CORS configuration
   - Test multi-language data fetching
   - Verify currency conversion

#### Code Example - API Client:
```typescript
// lib/api/client.ts
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh or logout
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  delete<T>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new APIClient();
```

```typescript
// lib/api/services/boat.service.ts
import { apiClient } from '../client';
import { BoatResponse, BoatSearchParams } from '@/types/api';

export class BoatService {
  static async getAll(params?: BoatSearchParams) {
    const { data } = await apiClient.get<BoatResponse[]>('/boats', { params });
    return data;
  }

  static async getBySlug(slug: string) {
    const { data } = await apiClient.get<BoatResponse>(`/boats/${slug}`);
    return data;
  }

  static async search(query: string, filters?: any) {
    const { data } = await apiClient.get<BoatResponse[]>('/boats/search', {
      params: { query, ...filters },
    });
    return data;
  }
}
```

#### Quality Gates:
- [x] All API endpoints return correct data types
- [x] Error handling covers 400, 401, 403, 404, 500 responses
- [x] Loading states implemented on all pages
- [x] CORS works for all endpoints
- [x] Multi-language content loads correctly

**Implementation Notes**:
- API client: `/lib/api/client.ts` with Axios interceptors for JWT tokens
- Services: `/lib/api/services/` for all entities (Boat, Location, Booking, Auth, User)
- Types: `/types/api.ts` matching backend DTOs exactly
- Real data integration in Homepage and Boats List pages
- Error handling includes automatic redirect to login on 401 responses
- Backend context path: `/api` (configured in application.yml)

---

### ✅ Wave 2: Authentication & User Management (Priority 2) - COMPLETE
**Completion**: 100%
**Time Spent**: ~6 hours
**Completed**: 2025-11-05
**Dependencies**: Wave 1 complete

#### Tasks:
1. **Authentication Pages** (2h)
   - Login page with form validation
   - Registration page with validation
   - Password reset flow
   - Email verification UI

2. **Auth Context & State Management** (1.5h)
   - Auth context provider
   - Protected route HOC
   - User session management
   - Token refresh logic

3. **User Profile Pages** (1.5h)
   - Profile view/edit
   - Password change
   - Preferences (language, currency)
   - Booking history

4. **Role-Based Access Control** (1h)
   - Customer role restrictions
   - Admin role permissions
   - Route guards
   - UI conditional rendering

#### Code Example - Auth Context:
```typescript
// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '@/lib/api/services/auth.service';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await AuthService.getProfile();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await AuthService.login(email, password);
    localStorage.setItem('access_token', response.accessToken);
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await AuthService.register(data);
    localStorage.setItem('access_token', response.accessToken);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    window.location.href = '/';
  };

  const refreshUser = async () => {
    const userData = await AuthService.getProfile();
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

#### Quality Gates:
- [x] JWT tokens stored securely in localStorage
- [x] Token refresh works automatically (handled by API client interceptor)
- [x] Protected routes redirect to backoffice login (/backoffice/login)
- [x] User session persists across page reloads via AuthContext
- [x] Logout clears all auth state (tokens and user data)
- [x] Role-based UI rendering works correctly (ADMIN vs CUSTOMER)

**Implementation Notes**:
- AuthContext: `/contexts/AuthContext.tsx` - Global authentication state management
- Login page: `/app/backoffice/login/page.tsx` - Admin login at /backoffice/login
- Registration: `/app/[locale]/register/page.tsx` - Customer registration with i18n
- Profile management: `/app/[locale]/profile/page.tsx` - Full profile editing with tabs
- Protected routes: `/components/auth/ProtectedRoute.tsx` - Role-based route guards
- User service: `/lib/api/services/user.service.ts` - Profile CRUD operations
- Translation keys: All 4 languages (en, pt-BR, pt-PT, es) with complete `profile` namespace
- Password validation: Minimum 8 characters, confirmation matching

---

### ✅ Wave 3: Booking System (Priority 3) - COMPLETE
**Completion**: 100%
**Time Spent**: ~8 hours
**Completed**: 2025-11-06
**Dependencies**: Waves 1 & 2 complete ✅

#### Implementation Summary:

**Backend Components** (100% Complete):
- ✅ `CreateInquiryRequest` DTO with comprehensive validation
  - UUID validation for boatId
  - @Future validation for dates
  - @Email, @NotBlank, @Positive validations
- ✅ `WebhookService` for n8n integration
  - Webhook URL configuration
  - Async booking notifications
  - Error handling and retry logic
- ✅ `BookingController` /inquiries endpoint (public access)
  - POST `/api/bookings/inquiries` - No authentication required
  - Returns 201 Created with booking reference
- ✅ `BookingService.createInquiry()` method
  - Creates pending bookings
  - Generates unique booking references (BK + timestamp)
  - Creates or finds customers
  - Calculates total prices with captain fees
  - Triggers n8n webhook notifications
- ✅ Security configuration updated
  - `.permitAll()` on `/bookings/inquiries` endpoint
  - Public access verified and tested

**Frontend Components** (100% Complete):
- ✅ `BookingWidget` component (482 lines, production-ready)
  - Multi-currency support (EUR, USD, GBP, BRL) with dynamic switching
  - Date/time selection with validation
  - Guest count with boat capacity checking
  - Captain toggle with automatic price adjustment
  - Real-time price calculation (boat + captain × days)
  - Customer info collection (name, email, phone, notes)
  - Comprehensive form validation with error messages
  - API integration with error handling
  - Toast notifications for success/errors
  - Mobile-responsive design
- ✅ API service layer (`lib/api/inquiries.ts`)
  - Type-safe interfaces matching backend DTOs
  - `createInquiry()` function with proper error handling
- ✅ API client configuration
  - Correct base URL: http://localhost:8080/api
  - JWT token interceptor for authenticated requests
  - 401 error handling with redirect

**Translations** (100% Complete):
- ✅ English (en.json) - 48 translation keys
- ✅ Spanish (es.json) - Complete booking namespace
- ✅ Brazilian Portuguese (pt-BR.json) - Brazilian formatting
- ✅ European Portuguese (pt-PT.json) - European formatting
- All languages include:
  - Form labels and placeholders
  - Error messages
  - Success messages
  - Price breakdown labels

**Testing & Verification** (100% Complete):
- ✅ Backend API tested successfully
  - Created test booking: BK176244070993030
  - Verified boat: Lagoon 450 Luxury Catamaran (ID: 850e8400-e29b-41d4-a716-446655440001)
  - Verified customer creation: John Doe (ID: 750e8400-e29b-41d4-a716-446655440002)
  - Verified price calculation: €1,930 (2 days × €780 boat + 2 days × €185 captain)
  - Verified booking status: PENDING
  - Verified public access (no authentication required)
- ✅ Component structure verified
  - BookingWidget exports correctly
  - All props properly typed
  - Dependencies installed (Sonner for toasts)

**Current Status**:
The booking inquiry system is 100% functional on both backend and frontend. The BookingWidget component is production-ready but not yet integrated into boat detail pages. See Wave 3.6 below for integration tasks.

---

### ✅ Wave 3.6: BookingWidget Integration (Priority 3.6) - COMPLETE
**Completion**: 100%
**Time Spent**: ~2.5 hours
**Completed**: 2025-11-06
**Dependencies**: Wave 3 complete ✅

#### Critical Business Need:
The booking system is complete but not yet integrated into user-facing pages. This small task will make the booking functionality accessible to customers, enabling the core revenue-generating feature of the platform.

#### Tasks:
1. **Integrate BookingWidget into Boat Detail Page** (1h)
   - Modify `/app/[locale]/boats/[slug]/page.tsx`
   - Import BookingWidget component
   - Pass boat data as props (capacity, prices, captainPrices)
   - Configure onSuccess callback to redirect to confirmation page
   - Add proper error boundaries

2. **Create Booking Confirmation Page** (45min)
   - Create `/app/[locale]/booking/confirmation/[reference]/page.tsx`
   - Display booking reference prominently
   - Show booking details (boat, dates, price, customer info)
   - Display next steps:
     - WhatsApp contact information
     - Email confirmation notice
     - Calendar integration option
   - Add translations for confirmation page

3. **Test End-to-End Flow** (30min)
   - Start frontend dev server (`npm run dev`)
   - Navigate to a boat detail page
   - Fill out booking form with valid data
   - Submit inquiry
   - Verify booking created in database
   - Verify redirect to confirmation page
   - Verify booking reference displayed
   - Test all 4 languages
   - Test mobile responsive design
   - Verify n8n webhook notification (if configured)

#### Code Changes Required:

**1. Update Boat Detail Page** (`/app/[locale]/boats/[slug]/page.tsx`):
```typescript
import BookingWidget from '@/components/booking/BookingWidget';
import { useRouter } from 'next/navigation';

export default function BoatDetailPage({ params }: { params: { slug: string, locale: string } }) {
  const router = useRouter();
  const boat = await fetchBoatBySlug(params.slug); // existing code

  const handleBookingSuccess = (bookingReference: string) => {
    router.push(`/${params.locale}/booking/confirmation/${bookingReference}`);
  };

  return (
    <div>
      {/* existing content */}

      {/* Add booking widget in a sticky sidebar or below gallery */}
      <div className="lg:sticky lg:top-24">
        <BookingWidget
          boat={boat}
          onSuccess={handleBookingSuccess}
        />
      </div>
    </div>
  );
}
```

**2. Create Confirmation Page** (`/app/[locale]/booking/confirmation/[reference]/page.tsx`):
```typescript
export default function BookingConfirmationPage({
  params
}: {
  params: { reference: string, locale: string }
}) {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-2xl mx-auto text-center">
        <h1>{t('booking.confirmation.title')}</h1>
        <p className="text-4xl font-bold my-6">{params.reference}</p>
        <p>{t('booking.confirmation.description')}</p>

        {/* Next steps section */}
        <div className="mt-8">
          <h2>{t('booking.confirmation.nextSteps')}</h2>
          <ul>
            <li>{t('booking.confirmation.emailSent')}</li>
            <li>{t('booking.confirmation.whatsappContact')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

#### Quality Gates:
- [x] BookingWidget visible on all boat detail pages
- [x] Form submission creates booking in database
- [x] Success redirect to confirmation page works
- [x] Booking reference displayed correctly on confirmation page
- [x] All 4 languages work properly
- [x] Mobile responsive design maintained
- [x] n8n webhook triggered (if configured)
- [x] No console errors in browser

**Implementation Notes**:
- BookingWidget integrated at `/app/[locale]/boats/[slug]/page.tsx` (line 453)
- Confirmation page at `/app/[locale]/booking/confirmation/[reference]/page.tsx`
- E2E test suite created at `/e2e/booking-flow.spec.ts` (4 comprehensive scenarios)
- All translations complete in all 4 languages (en, pt-BR, pt-PT, es)
- Tested successfully with booking reference BK176244070993030

---

#### Original Wave 3 Tasks (for reference):
<details>
<summary>Click to expand original planned tasks</summary>

1. **Booking Flow Pages** (3h)
   - Boat selection with date picker
   - Booking form with validation
   - Price calculation display
   - Booking confirmation page
   - Booking success/error states

2. **Date & Availability Management** (2h)
   - Calendar component integration
   - Availability checking API calls
   - Blocked dates display
   - Min/max booking duration

3. **Payment Integration UI** (2h)
   - Payment method selection
   - Booking summary
   - Terms & conditions
   - Invoice/receipt display

4. **Booking Management** (1.5h)
   - View bookings list
   - Booking details modal
   - Cancel booking flow
   - Booking status updates

#### Code Example - Booking Form:
```typescript
// app/[locale]/boats/[slug]/book/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookingService } from '@/lib/api/services/booking.service';
import { BoatService } from '@/lib/api/services/boat.service';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function BookBoatPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { currency } = useCurrency();
  const [boat, setBoat] = useState(null);
  const [dates, setDates] = useState({ start: null, end: null });
  const [guestCount, setGuestCount] = useState(1);
  const [needsCaptain, setNeedsCaptain] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!user) {
      router.push('/login?redirect=/boats/' + params.slug + '/book');
      return;
    }

    setLoading(true);
    try {
      const booking = await BookingService.create({
        boatId: boat.id,
        startDatetime: dates.start,
        endDatetime: dates.end,
        guestCount,
        needsCaptain,
        currency,
        customerNotes: '',
      });

      router.push(`/bookings/${booking.id}/confirmation`);
    } catch (error) {
      // Handle error
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Booking form UI */}
    </div>
  );
}
```

#### Quality Gates:
- [ ] Date validation prevents past dates
- [ ] Availability checked before booking
- [ ] Price calculated correctly with currency
- [ ] Captain requirement enforced
- [ ] Guest count validated against capacity
- [ ] Booking confirmation email sent
- [ ] Booking appears in user's bookings list

---

### 👨‍💼 Wave 4: Admin Dashboard (Priority 4)
**Completion**: ~35%
**Time Spent**: ~6 hours
**Estimated Remaining**: 6-8 hours
**Dependencies**: Waves 1, 2, 3 complete ✅
**Last Updated**: 2025-11-09

#### Current State:
**Backend**: ✅ 100% Ready
- 33 REST endpoints implemented (18 admin-protected)
- Boats CRUD: 11 endpoints (list, search, create, update, delete)
- Bookings CRUD: 14 endpoints (status management, filters, notes)
- Locations CRUD: 7 endpoints
- All CRUD operations protected with `@PreAuthorize("hasRole('ADMIN')")`

**Frontend Infrastructure**: ✅ 90% Ready
- API services complete (boat, booking, location, auth, user)
- TypeScript types matching backend DTOs
- 11 ShadCN components installed (button, card, input, select, badge, etc.)
- Authentication working (JWT + role-based access)
- Admin login page functional

**Admin UI**: 🟢 ~35% Complete
- ✅ Admin layout shell exists (`/backoffice/layout.tsx`)
- ✅ Admin login page working (`/backoffice/login/page.tsx`)
- ❌ Dashboard overview page (0%)
- ✅ **Bookings management interface (100%)** - BookingsTable component with full CRUD
- ✅ **Boats management interface (100%)** - BoatsTable component with full CRUD (800+ lines)
- ❌ Locations management interface (0%)
- ❌ Customers view (0%)

**Missing Components** (Need Installation):
- ❌ Table component (for data tables)
- ❌ Dialog/Modal component (for create/edit forms)
- ❌ Alert component (for notifications)
- ❌ Pagination component
- ❌ Form component (with validation)
- ❌ Checkbox component

#### Tasks:

**Phase 1: Foundation & Setup** (1.5h)
1. **Component Installation** (0.5h)
   - Install ShadCN components: `table`, `dialog`, `alert`, `pagination`, `form`, `checkbox`
   - Test component imports and basic usage

2. **Admin Navigation & Layout** (1h)
   - Create admin sidebar with navigation menu
   - Setup route structure (`/backoffice/dashboard`, `/bookings`, `/boats`, `/locations`, `/customers`)
   - Create reusable page layout component
   - Add loading states and error boundaries

**Phase 2: Bookings Management** (3.5h) ✅ **COMPLETE**
**Completed**: 2025-11-08
**Time Spent**: ~3 hours

3. ✅ **Bookings Data Table** (1.5h)
   - ✅ Data table with pagination and sorting
   - ✅ Filter by status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
   - ✅ Filter by date range
   - ✅ Search by booking reference or customer name
   - ✅ Show key info: reference, customer, boat, dates, status, total price

4. ✅ **Bookings Management Actions** (2h)
   - ✅ View booking details modal (full info display)
   - ✅ Status management dropdown (PENDING → CONFIRMED → COMPLETED/CANCELLED)
   - ✅ Add admin notes field (internal notes, not visible to customer)
   - ✅ Confirm booking button (with validation)
   - ✅ Cancel booking button (with confirmation dialog)
   - ✅ Show booking history/timeline

**Implementation Notes**:
- **Component**: `/components/admin/BookingsTable.tsx` - Comprehensive bookings management interface
- **Integration**: `/app/backoffice/bookings/page.tsx` - Integrated into backoffice
- **Features**: Pagination (10/25/50/100 per page), status filters, date range filters, search by reference/customer
- **CRUD Operations**: View details, update status, add admin notes, confirm/cancel bookings
- **Build Status**: ✅ All TypeScript errors fixed, build successful

**Phase 3: Boats Management** (3.5h) ✅ **COMPLETE**
**Completed**: 2025-11-09
**Time Spent**: ~3 hours

5. ✅ **Boats Data Table** (1h)
   - ✅ Boats list with pagination (10/25/50/100 per page)
   - ✅ Filter by status (ACTIVE, INACTIVE, MAINTENANCE)
   - ✅ Filter by type (SAILBOAT, MOTORBOAT, CATAMARAN, YACHT, JETSKI, FISHING_BOAT)
   - ✅ Search by name, make, or model
   - ✅ Show key info: name, type, capacity, price range, status

6. ✅ **Boats CRUD Operations** (2.5h)
   - ✅ Create boat modal form with:
     * ✅ Multi-language name/description/shortDescription fields (EN, PT-BR, PT-PT, ES)
     * ✅ Type selection dropdown (all 6 boat types)
     * ✅ Capacity, cabins, bathrooms inputs
     * ✅ Specifications (make, model, year, length)
     * ✅ Multi-currency pricing (EUR, USD, GBP, BRL)
     * ✅ Status toggle (ACTIVE, INACTIVE, MAINTENANCE)
     * ✅ Location assignment
   - ✅ Edit boat modal (same form, pre-populated)
   - ✅ Delete boat with confirmation dialog
   - ✅ Validation for all required fields

**Implementation Notes**:
- **Component**: `/components/admin/BoatsTable.tsx` - 800+ lines, comprehensive boats management interface
- **Integration**: `/app/backoffice/boats/page.tsx` - Integrated into backoffice
- **Features**: Full CRUD operations, multi-section form, responsive design
- **Type Fixes**: Corrected BoatType enum (6 types), BoatStatus enum (ACTIVE/INACTIVE/MAINTENANCE)
- **Prerender Fix**: Removed useTranslations hook to fix Next.js 16 prerender issue
- **Build Status**: ✅ All TypeScript errors fixed, build successful

**Phase 4: Dashboard Overview** (2h)
7. **Dashboard Stats & Metrics** (2h)
   - 4 stat cards: Total Boats, Total Bookings, Revenue Estimate, Total Customers
   - Recent bookings table (last 10 with quick actions)
   - Quick actions panel (Create Boat, View Bookings)
   - Real-time data fetching with React Query

**Phase 5: Locations & Customers** (3.5h)
8. **Locations Management** (2h)
   - Locations data table
   - Create location form (name, city, country, coordinates as text fields)
   - Edit location form
   - Delete location with confirmation
   - Show boats count per location

9. **Customers View** (1.5h)
   - Customers data table (read-only)
   - View customer details modal
   - Show customer's booking history
   - Show total bookings and total spend per customer

**Phase 6: Testing & Polish** (2h)
10. **Quality Assurance** (2h)
    - Test all CRUD operations end-to-end
    - Add error handling for API failures
    - Add loading states for all async operations
    - Responsive design testing (mobile, tablet, desktop)
    - Fix any bugs discovered
    - Add success/error toast notifications

#### Deferred Items (Future Waves):
These items are intentionally scoped out of Wave 4 and will be addressed in later waves:

**❌ Image Upload** (Moved to Wave 5)
- Reason: Requires backend endpoint for file upload + cloud storage setup (Cloudinary/S3)
- Complexity: Needs multipart/form-data handling, image optimization, CDN integration
- Current workaround: Use placeholder images or direct URL input

**❌ Map Integration** (Moved to Wave 5)
- Reason: Requires Google Maps API or similar service integration
- Complexity: API key management, interactive map component, coordinate picker
- Current workaround: Use text input for lat/lng coordinates

**❌ User CRUD Operations** (Needs backend implementation)
- Reason: Backend only has GET /users/profile endpoint, no admin user management
- Required backend: POST/PUT/DELETE /users endpoints with role management
- Current scope: Read-only customers view showing booking history

**❌ Advanced Analytics** (Moved to Wave 5)
- Reason: Requires data aggregation, charting library, complex queries
- Complexity: Revenue charts, booking trends, seasonal analysis
- Current scope: Simple stat cards with total counts

#### Code Example - Admin Dashboard:
```typescript
// app/[locale]/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoatService } from '@/lib/api/services/boat.service';
import { BookingService } from '@/lib/api/services/booking.service';
import { Ship, Calendar, DollarSign, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBoats: 0,
    activeBookings: 0,
    revenue: 0,
    customers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch dashboard statistics
      const [boats, bookings] = await Promise.all([
        BoatService.getAll(),
        BookingService.getAll({ status: 'ACTIVE' }),
      ]);

      setStats({
        totalBoats: boats.length,
        activeBookings: bookings.length,
        revenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
        customers: new Set(bookings.map(b => b.customer.id)).size,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Boats</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBoats}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

#### Quality Gates:
**Security & Access:**
- [ ] Admin routes protected by role check (ADMIN role required)
- [ ] JWT authentication working for all admin endpoints
- [ ] Unauthorized access redirects to login page

**Bookings Management:**
- [ ] Bookings table displays all bookings with pagination
- [ ] Status filtering works (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- [ ] Date range filtering works correctly
- [ ] Search by booking reference or customer name works
- [ ] View booking details modal shows complete information
- [ ] Confirm booking action updates status to CONFIRMED
- [ ] Cancel booking action updates status to CANCELLED
- [ ] Admin notes can be added and saved

**Boats Management:**
- [ ] Boats table displays all boats with pagination
- [ ] Create boat form validates and submits successfully
- [ ] Edit boat form pre-populates and updates correctly
- [ ] Delete boat with confirmation dialog works
- [ ] Multi-language fields (name, description) work for all 4 languages
- [ ] Multi-currency pricing saves correctly (EUR, USD, GBP, BRL)
- [ ] Status toggle (ACTIVE/INACTIVE/MAINTENANCE) works

**Locations Management:**
- [ ] Locations table displays all locations
- [ ] Create location form works with coordinate inputs
- [ ] Edit location form updates correctly
- [ ] Delete location with confirmation works
- [ ] Boats count per location displays correctly

**Dashboard:**
- [ ] Dashboard stats cards show correct counts
- [ ] Recent bookings table displays last 10 bookings
- [ ] Quick actions navigate to correct pages

**General UI/UX:**
- [ ] All tables have sorting capability
- [ ] All tables have pagination working
- [ ] Loading states show during API calls
- [ ] Error messages display for failed operations
- [ ] Success notifications appear for successful actions
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] All forms have proper validation with error messages

---

### 🚀 Wave 5: Advanced Features & Polish (Priority 5)
**Estimated Time**: 8-12 hours
**Dependencies**: All previous waves complete

#### Tasks:
1. **Image Management** (3h)
   - Image upload with preview
   - Multiple image support
   - Image ordering/priority
   - Image optimization
   - CDN integration preparation

2. **Amenities Management** (1.5h)
   - Amenities CRUD operations
   - Icon/image for amenities
   - Multi-language amenity names
   - Boat-amenity associations

3. **Reviews & Ratings** (2.5h)
   - Review submission form
   - Rating display component
   - Review moderation (admin)
   - Average rating calculation
   - Review pagination

4. **WhatsApp Integration** (1h)
   - WhatsApp contact button
   - Pre-filled message templates
   - Locale-specific messages
   - Click tracking

5. **SEO Enhancements** (1.5h)
   - Dynamic meta tags
   - OpenGraph tags
   - Twitter cards
   - Sitemap generation
   - Robots.txt configuration

#### Code Example - WhatsApp Integration:
```typescript
// components/shared/WhatsAppButton.tsx
'use client';

import { useTranslations } from 'next-intl';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  boatName?: string;
  message?: string;
}

export function WhatsAppButton({ boatName, message }: WhatsAppButtonProps) {
  const t = useTranslations('contact');

  const phoneNumber = '+351912345678'; // From environment variable

  const defaultMessage = message || (boatName
    ? t('whatsappMessage', { boat: boatName })
    : t('whatsappMessageGeneral'));

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    // Track event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        boat_name: boatName,
      });
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="bg-green-500 hover:bg-green-600 text-white border-green-600"
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {t('contactWhatsApp')}
    </Button>
  );
}
```

#### Quality Gates:
- [ ] Images upload and display correctly
- [ ] Reviews submit and appear immediately
- [ ] WhatsApp opens with correct message
- [ ] SEO meta tags render correctly
- [ ] Sitemap includes all boat pages
- [ ] Amenities display in correct language

---

### 🧪 Wave 6: Testing & Quality Assurance (Priority 6)
**Estimated Time**: 6-8 hours
**Dependencies**: All feature waves complete

#### Tasks:
1. **Unit Tests** (2h)
   - API services tests
   - Utility functions tests
   - Context providers tests
   - Form validation tests

2. **Integration Tests** (2.5h)
   - API integration tests
   - Authentication flow tests
   - Booking flow tests
   - Admin operations tests

3. **E2E Tests with Playwright** (2.5h)
   - Public pages navigation
   - Search and filters
   - Booking flow
   - Admin workflows

4. **Accessibility Testing** (1h)
   - WCAG compliance check
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast validation

#### Code Example - E2E Test:
```typescript
// tests/e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('should complete full booking process', async ({ page }) => {
    // Navigate to boats page
    await page.goto('/en/boats');

    // Select a boat
    await page.click('[data-testid="boat-card"]:first-child');

    // Click "Book Now" button
    await page.click('[data-testid="book-now-button"]');

    // Fill booking form
    await page.fill('[data-testid="guest-count"]', '4');
    await page.click('[data-testid="start-date"]');
    await page.click('[data-testid="calendar-next-month"]');
    await page.click('[data-testid="date-15"]');
    await page.click('[data-testid="end-date"]');
    await page.click('[data-testid="date-18"]');

    // Select captain option
    await page.check('[data-testid="needs-captain"]');

    // Submit booking
    await page.click('[data-testid="submit-booking"]');

    // Verify confirmation page
    await expect(page).toHaveURL(/\/bookings\/.*\/confirmation/);
    await expect(page.locator('[data-testid="booking-confirmation"]')).toBeVisible();
  });
});
```

#### Quality Gates:
- [ ] Test coverage > 80%
- [ ] All critical paths tested
- [ ] No accessibility violations
- [ ] All E2E tests pass
- [ ] Performance benchmarks met

---

### 🏭 Wave 7: Production Readiness (Priority 7)
**Estimated Time**: 8-10 hours
**Dependencies**: All previous waves complete

#### Tasks:
1. **Docker Configuration** (2h)
   - Frontend Dockerfile
   - Backend Dockerfile
   - PostgreSQL container
   - docker-compose.yml for local dev
   - docker-compose.prod.yml

2. **Environment Management** (1h)
   - .env.example files
   - Environment validation
   - Secret management strategy
   - Multi-environment configs (dev, staging, prod)

3. **CI/CD Pipeline** (2.5h)
   - GitHub Actions workflow
   - Build and test automation
   - Deployment automation
   - Environment-specific deployments

4. **Monitoring & Logging** (1.5h)
   - Error tracking setup (Sentry)
   - Analytics integration (Google Analytics 4)
   - Performance monitoring
   - Health check endpoints

5. **Documentation** (1.5h)
   - Deployment guide
   - Environment setup guide
   - API documentation
   - Admin user guide

#### Code Example - Docker Compose:
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: villasboats
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/villasboats
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### Quality Gates:
- [ ] Docker containers build successfully
- [ ] All services start with docker-compose up
- [ ] CI/CD pipeline runs successfully
- [ ] Production deployment works
- [ ] Monitoring dashboards operational
- [ ] Documentation complete and accurate

---

## 📊 Timeline Summary

| Wave | Focus | Hours | Completion |
|------|-------|-------|------------|
| 0 | Foundation | - | ✅ 100% |
| 1 | Backend Integration | 4h | ✅ 100% |
| 2 | Authentication | 6h | ✅ 100% |
| 3 | Booking System | 8h | ✅ 100% |
| 3.6 | Widget Integration | 2.5h | ✅ 100% |
| 4 | Admin Dashboard | 12h spent / 6-8h remaining | 🟢 ~35% (Phases 2 & 3 complete) |
| 5 | Advanced Features | 8-12h | ❌ 0% |
| 6 | Testing & QA | 5-7h | 🟡 ~15% |
| 7 | Production | 8-10h | ❌ 0% |
| **TOTAL** | **Complete Platform** | **57.5h spent / 15-23h remaining** | **✅ ~78% Current** |

**Current Progress**: Waves 0, 1, 2, 3, 3.6 complete + Wave 4 Phases 2 & 3 complete (booking system + bookings/boats management)
**Next Priority**: Wave 4 remaining phases (6-8h) - Dashboard Overview, Locations & Customers management
**Estimated Remaining**: ~15-23 hours to complete platform
**Estimated Completion**: 3-5 days (full-time) or 1-1.5 weeks (part-time)

---

## 🎯 Success Criteria

### Functionality
- [ ] Users can browse and filter boats
- [ ] Users can create accounts and log in
- [ ] Users can book boats with date selection
- [ ] Admins can manage boats, bookings, and users
- [ ] Multi-language content displays correctly
- [ ] Multi-currency pricing works accurately

### Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Core Web Vitals pass
- [ ] API response times < 500ms

### Quality
- [ ] Test coverage > 80%
- [ ] Zero critical accessibility violations
- [ ] Mobile responsive on all pages
- [ ] Cross-browser compatible (Chrome, Firefox, Safari, Edge)

### Security
- [ ] JWT tokens stored securely
- [ ] XSS protection implemented
- [ ] CSRF protection on forms
- [ ] SQL injection prevented (backend)
- [ ] Secure password hashing (backend)

---

## 🚀 Next Steps

### ✅ Completed:
- **Wave 0**: Foundation (100%)
- **Wave 1**: Backend Integration (100%)
- **Wave 2**: Authentication & User Management (100%)
- **Wave 3**: Booking System - Backend & Frontend (100%)
- **Wave 3.6**: BookingWidget Integration (100%)
- **Wave 4 - Phase 2**: Bookings Management (100%)
- **Wave 4 - Phase 3**: Boats Management (100%)

**Latest Completion**: Wave 4 Phases 2 & 3 finished on 2025-11-09
- ✅ BookingsTable component with full CRUD operations
- ✅ BoatsTable component (800+ lines) with full CRUD operations
- ✅ Multi-language support for all boat fields
- ✅ Multi-currency pricing support
- ✅ All TypeScript compilation errors fixed
- ✅ Build successful

### 🎯 Current Priority: Wave 4 - Admin Dashboard (Remaining Phases)

**Critical Business Need**: Complete the admin dashboard with overview metrics, locations and customers management.

**Current State**: ~35% complete (bookings and boats management done)

**What's Remaining** (6-8 hours):
1. ✅ ~~**Booking Management** (3h)~~ - COMPLETE
2. ✅ ~~**Boat CRUD** (3h)~~ - COMPLETE
3. **Dashboard Analytics** (2h) - Statistics, charts, key metrics - NOT STARTED
4. **Locations Management** (2h) - CRUD for locations - NOT STARTED
5. **Customer Management** (2h) - View customers, booking history - NOT STARTED
6. **Testing & Polish** (0.5h) - Final verification

**Dependencies Ready**:
- ✅ All backend admin endpoints exist (43 REST endpoints)
- ✅ Authentication and role-based access control working
- ✅ Real booking data available for management
- ✅ Frontend foundation and component library in place

---

### 📅 Subsequent Priorities (After Wave 4):

#### Wave 5: Advanced Features (8-12 hours)
**Status**: 0% complete
**Business Value**: Enhance user experience and drive conversions

**Planned Features**:
- Guest reviews and ratings system
- Boat amenities management UI
- WhatsApp quick booking integration
- Favorites/wishlist functionality
- Email notifications via n8n

#### Wave 6: Testing & QA (6-8 hours)
**Status**: 0% complete
**Business Value**: Ensure quality and reliability before launch

**Testing Scope**:
- E2E testing with Playwright
- Integration tests for API
- Accessibility testing (WCAG)
- Cross-browser compatibility
- Mobile responsiveness verification
- Performance optimization

#### Wave 7: Production Deployment (8-10 hours)
**Status**: 0% complete
**Business Value**: Make platform live and accessible to customers

**Deployment Tasks**:
- Docker containerization
- CI/CD pipeline setup
- Production database migration
- SSL certificates
- Environment configuration
- Monitoring and logging
- Documentation

---

### 🎯 Recommended Execution Order:

1. **Wave 4** (10-14h) - CURRENT PRIORITY
   - Admin dashboard with CRUD interfaces
   - Enable team to manage operations

2. **Wave 5** (8-12h) - NEXT
   - Advanced features (reviews, amenities, WhatsApp)
   - Enhance user experience

3. **Wave 6** (5-7h) - BEFORE LAUNCH
   - Complete testing suite
   - E2E scenarios, unit tests, accessibility
   - Ensure quality

4. **Wave 7** (8-10h) - LAUNCH
   - Production deployment
   - Docker, CI/CD, monitoring
   - Go live

---

#### ✅ Wave 3 Detailed Implementation Plan - n8n Automation Approach (COMPLETED)

**Status**: ✅ 100% Complete
**Time Spent**: ~8 hours
**Completed**: 2025-11-06

> **Note**: This section documents the original Wave 3 implementation plan. All tasks listed below have been completed. See the "Wave 3: Booking System - COMPLETE" section above for the implementation summary.

**Total Estimated Time**: 8-9 hours

**Key Changes from Original Plan**:
- ❌ No dedicated booking page - enhance existing widget instead
- ✅ No authentication required - capture leads for marketing
- ✅ WhatsApp-first booking flow with detailed message generation
- ✅ n8n workflow automation for emails, notifications, and follow-ups
- ✅ Same-day bookings allowed (end date >= start date)
- ✅ Fixed WhatsApp number: +351 915 500 020

---

##### Task 3.1: Backend - Inquiry Endpoint with Webhooks (3h)

**3.1.1 Create CreateInquiryRequest DTO (30min)**
**File to Create**: `backend/src/main/java/com/villasboats/infrastructure/web/dto/request/CreateInquiryRequest.java`

**Requirements**:
- Extends existing booking request with customer fields
- No authentication required - collects customer details directly
- Validation annotations for all fields

```java
package com.villasboats.infrastructure.web.dto.request;

import com.villasboats.domain.valueobject.Currency;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInquiryRequest {
    @NotNull(message = "Boat ID is required")
    private UUID boatId;

    @NotNull(message = "Start date and time is required")
    private LocalDateTime startDatetime;

    @NotNull(message = "End date and time is required")
    private LocalDateTime endDatetime;

    @NotNull(message = "Guest count is required")
    @Positive(message = "Guest count must be positive")
    private Integer guestCount;

    @NotNull(message = "Needs captain flag is required")
    private Boolean needsCaptain;

    @NotNull(message = "Currency is required")
    private Currency currency;

    // Customer information (no auth required)
    @NotBlank(message = "Full name is required")
    @Size(max = 255)
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255)
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(max = 50)
    private String phone;

    private String customerNotes;
}
```

**3.1.2 Create WebhookService for n8n Integration (45min)**
**File to Create**: `backend/src/main/java/com/villasboats/infrastructure/integration/WebhookService.java`

**Requirements**:
- Emit webhook events to n8n for inquiry created, booking confirmed, status changed
- Use RestTemplate or WebClient for HTTP POST
- Handle errors gracefully (log but don't fail booking)
- Configurable webhook URL from application.yml

```java
package com.villasboats.infrastructure.integration;

import com.villasboats.domain.entity.Booking;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "n8n.webhook", name = "enabled", havingValue = "true", matchIfMissing = true)
public class WebhookService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${n8n.webhook.url}")
    private String webhookUrl;

    @Value("${app.whatsapp.number:+351915500020}")
    private String whatsappNumber;

    public void sendInquiryCreatedEvent(Booking booking) {
        try {
            Map<String, Object> payload = buildInquiryPayload(booking);
            sendWebhook(webhookUrl + "/inquiry-created", payload);
            log.info("Sent inquiry created webhook for booking: {}", booking.getBookingReference());
        } catch (Exception e) {
            log.error("Failed to send inquiry webhook for booking: {}", booking.getBookingReference(), e);
        }
    }

    public void sendBookingStatusChangedEvent(Booking booking, String previousStatus) {
        try {
            Map<String, Object> payload = buildInquiryPayload(booking);
            payload.put("previousStatus", previousStatus);
            sendWebhook(webhookUrl + "/booking-status-changed", payload);
            log.info("Sent status changed webhook for booking: {}", booking.getBookingReference());
        } catch (Exception e) {
            log.error("Failed to send status webhook for booking: {}", booking.getBookingReference(), e);
        }
    }

    private Map<String, Object> buildInquiryPayload(Booking booking) {
        Map<String, Object> payload = new HashMap<>();

        // Booking details
        payload.put("bookingReference", booking.getBookingReference());
        payload.put("startDatetime", booking.getStartDatetime());
        payload.put("endDatetime", booking.getEndDatetime());
        payload.put("guestCount", booking.getGuestCount());
        payload.put("needsCaptain", booking.getNeedsCaptain());
        payload.put("currency", booking.getCurrency());
        payload.put("totalPrice", booking.getTotalPrice());
        payload.put("status", booking.getStatus());
        payload.put("customerNotes", booking.getCustomerNotes());

        // Customer details
        Map<String, Object> customer = new HashMap<>();
        customer.put("fullName", booking.getCustomer().getFullName());
        customer.put("email", booking.getCustomer().getEmail());
        customer.put("phone", booking.getCustomer().getPhone());
        payload.put("customer", customer);

        // Boat details
        Map<String, Object> boat = new HashMap<>();
        boat.put("name", booking.getBoat().getNameI18n().get("en"));
        boat.put("slug", booking.getBoat().getSlug());
        boat.put("type", booking.getBoat().getType());
        boat.put("capacity", booking.getBoat().getCapacity());
        boat.put("location", booking.getBoat().getLocation().getCity());
        payload.put("boat", boat);

        // WhatsApp contact
        payload.put("whatsappNumber", whatsappNumber);

        return payload;
    }

    private void sendWebhook(String url, Map<String, Object> payload) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
        restTemplate.postForEntity(url, request, String.class);
    }
}
```

**3.1.3 Add Inquiry Endpoint to BookingController (30min)**
**File to Modify**: `backend/src/main/java/com/villasboats/infrastructure/web/controller/BookingController.java`

```java
// Add this endpoint (NO @PreAuthorize - public access)
@PostMapping("/inquiries")
public ResponseEntity<BookingResponse> createInquiry(@Valid @RequestBody CreateInquiryRequest request) {
    BookingResponse response = bookingService.createInquiry(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

**3.1.4 Implement createInquiry() in BookingService (60min)**
**File to Modify**: `backend/src/main/java/com/villasboats/application/service/BookingService.java`

**Requirements**:
- Validate dates: allow end date >= start date (**SAME-DAY BOOKINGS OK**)
- Find or create User with dummy password "LEAD_USER_NO_PASSWORD"
- Check boat availability
- Calculate price (reuse existing logic)
- Create PENDING booking
- Call webhookService.sendInquiryCreatedEvent()

```java
@Transactional
public BookingResponse createInquiry(CreateInquiryRequest request) {
    // Validate dates - ALLOW SAME DAY BOOKINGS
    if (request.getEndDatetime().isBefore(request.getStartDatetime())) {
        throw new IllegalArgumentException("End date cannot be before start date");
    }

    // Find boat
    Boat boat = boatRepository.findById(request.getBoatId())
            .orElseThrow(() -> new EntityNotFoundException("Boat not found with id: " + request.getBoatId()));

    // Check availability
    if (bookingRepository.existsConflictingBooking(boat.getId(), request.getStartDatetime(), request.getEndDatetime())) {
        throw new IllegalStateException("Boat is not available for the selected dates");
    }

    // Validate guest count
    if (request.getGuestCount() > boat.getCapacity()) {
        throw new IllegalArgumentException("Guest count exceeds boat capacity");
    }

    // Validate captain requirement
    if (boat.getCaptainRequired() && !request.getNeedsCaptain()) {
        throw new IllegalArgumentException("This boat requires a captain");
    }

    // Find or create lead user (without real password)
    User customer = userRepository.findByEmail(request.getEmail())
            .orElseGet(() -> {
                User newUser = User.builder()
                        .email(request.getEmail())
                        .passwordHash("LEAD_USER_NO_PASSWORD") // Dummy password for leads
                        .fullName(request.getFullName())
                        .phone(request.getPhone())
                        .role(UserRole.CUSTOMER)
                        .preferredLanguage(LanguageCode.EN)
                        .build();
                return userRepository.save(newUser);
            });

    // Calculate days (minimum 1 for half-day rentals)
    long days = ChronoUnit.DAYS.between(request.getStartDatetime().toLocalDate(), request.getEndDatetime().toLocalDate());
    if (days < 1) {
        days = 1;
    }

    // Calculate prices (same logic as existing createBooking method)
    BigDecimal boatPrice = getPriceForCurrency(boat, request.getCurrency());
    BigDecimal captainPrice = request.getNeedsCaptain() ? getCaptainPriceForCurrency(boat, request.getCurrency()) : BigDecimal.ZERO;

    BigDecimal subtotal = boatPrice.multiply(BigDecimal.valueOf(days));
    if (captainPrice.compareTo(BigDecimal.ZERO) > 0) {
        subtotal = subtotal.add(captainPrice.multiply(BigDecimal.valueOf(days)));
    }

    BigDecimal taxPercentage = BigDecimal.valueOf(0);
    BigDecimal taxAmount = subtotal.multiply(taxPercentage).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    BigDecimal totalPrice = subtotal.add(taxAmount);

    // Generate unique booking reference
    String bookingReference = generateBookingReference();

    // Create PENDING booking
    Booking booking = Booking.builder()
            .bookingReference(bookingReference)
            .boat(boat)
            .customer(customer)
            .startDatetime(request.getStartDatetime())
            .endDatetime(request.getEndDatetime())
            .guestCount(request.getGuestCount())
            .needsCaptain(request.getNeedsCaptain())
            .currency(request.getCurrency())
            .boatPricePerDay(boatPrice)
            .captainPricePerDay(captainPrice)
            .daysCount((int) days)
            .extrasTotal(BigDecimal.ZERO)
            .subtotal(subtotal)
            .taxPercentage(taxPercentage)
            .taxAmount(taxAmount)
            .totalPrice(totalPrice)
            .status(BookingStatus.PENDING)
            .customerNotes(request.getCustomerNotes())
            .build();

    booking = bookingRepository.save(booking);

    // Emit webhook to n8n for email/WhatsApp automation
    webhookService.sendInquiryCreatedEvent(booking);

    return toResponse(booking);
}
```

**3.1.5 Update SecurityConfig (15min)**
**File to Modify**: `backend/src/main/java/com/villasboats/infrastructure/security/SecurityConfig.java`

```java
// Add to permitAll() list:
"/api/bookings/inquiries",
```

**3.1.6 Add Configuration (15min)**
**File to Modify**: `backend/src/main/resources/application.yml`

```yaml
# n8n Webhook Configuration
n8n:
  webhook:
    url: ${N8N_WEBHOOK_URL:http://localhost:5678/webhook/booking}
    enabled: ${N8N_WEBHOOK_ENABLED:true}

# WhatsApp Contact
app:
  whatsapp:
    number: "+351915500020"
```

---

##### Task 3.2: n8n Workflows (2.5h)

**3.2.1 Workflow: New Booking Inquiry (90min)**
**n8n Workflow Name**: `booking-inquiry-new`

**Workflow Structure**:
1. **Webhook Trigger** - Listen for POST from Spring Boot `/inquiry-created`
2. **Set Variables** - Extract and format booking data
3. **Function: Generate WhatsApp Message**:
```javascript
// Generate detailed WhatsApp message
const booking = $input.item.json;
const boat = booking.boat;
const customer = booking.customer;

const message = `Hello! I'd like to book the ${boat.name}:

📅 Dates: ${new Date(booking.startDatetime).toLocaleDateString()} to ${new Date(booking.endDatetime).toLocaleDateString()}
👥 Guests: ${booking.guestCount}
⚓ Captain: ${booking.needsCaptain ? 'Yes' : 'No'}
💰 Estimated Total: ${booking.currency} ${booking.totalPrice}

My details:
👤 Name: ${customer.fullName}
📧 Email: ${customer.email}
📞 Phone: ${customer.phone}
🔖 Reference: ${booking.bookingReference}

${booking.customerNotes ? '\nNotes: ' + booking.customerNotes : ''}`;

return { whatsappMessage: encodeURIComponent(message) };
```
4. **Gmail: Send Confirmation to Customer**:
   - Subject: "Booking Inquiry Received - Ref: {{bookingReference}}"
   - Body: HTML template with booking details, boat info, WhatsApp contact button
5. **Gmail: Notify Admin**:
   - Subject: "New Booking Inquiry - {{boat.name}}"
   - Body: All booking details, customer info, link to admin panel
6. **Google Sheets: Log Inquiry** (Optional):
   - Append row with: timestamp, reference, customer, boat, dates, price, status

**3.2.2 Workflow: Follow-up Unconfirmed Bookings (30min)**
**n8n Workflow Name**: `booking-inquiry-followup`

**Workflow Structure**:
1. **Schedule Trigger** - Run every hour
2. **PostgreSQL: Query Unconfirmed** - Find PENDING bookings > 24h old
3. **Loop Over Results**
4. **Gmail: Send Reminder** - Friendly reminder email with WhatsApp button
5. **Update Last Contacted** - Track communication

**3.2.3 Workflow: Booking Status Changes (30min)**
**n8n Workflow Name**: `booking-status-update`

**Workflow Structure**:
1. **Webhook Trigger** - Listen for `/booking-status-changed`
2. **Switch: Status Type**
   - CONFIRMED → Send confirmation email + calendar invite
   - CANCELLED → Send cancellation email
   - COMPLETED → Send thank you + review request

---

##### Task 3.3: Frontend - Enhanced Booking Widget (2h)

**File to Modify**: `frontend/app/[locale]/boats/[slug]/page.tsx`

**Requirements**:
- Convert static widget to dynamic form with useState
- Add customer info collection (name, email, phone)
- Dynamic price calculation based on dates
- Form validation (allow same-day bookings)
- Submit to `/api/bookings/inquiries` endpoint
- Success modal with booking reference and WhatsApp link
- Error handling

**Key Changes** (lines 468-538 of existing file):
1. Add state management:
```typescript
const [startDate, setStartDate] = useState<string>('');
const [endDate, setEndDate] = useState<string>('');
const [guestCount, setGuestCount] = useState<number>(1);
const [fullName, setFullName] = useState<string>('');
const [email, setEmail] = useState<string>('');
const [phone, setPhone] = useState<string>('');
const [notes, setNotes] = useState<string>('');
const [loading, setLoading] = useState<boolean>(false);
const [showSuccess, setShowSuccess] = useState<boolean>(false);
const [bookingReference, setBookingReference] = useState<string>('');
const [errors, setErrors] = useState<Record<string, string>>({});
```

2. Add price calculation function:
```typescript
const calculatePrice = () => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const boatPrice = boat.pricePerDay * days;
  const serviceFee = boatPrice * 0.1;
  return boatPrice + serviceFee;
};
```

3. Add form submission handler:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Validation
  // API call to /api/bookings/inquiries
  // Show success modal
};
```

4. Add customer info fields before WhatsApp button
5. Replace static WhatsApp link with dynamic message generation
6. Add success modal component

---

##### Task 3.4: Translation Keys (0.5h)

**Files to Update**: `messages/en.json`, `messages/es.json`, `messages/pt-BR.json`, `messages/pt-PT.json`

Add new "booking" section with 30+ keys for form labels, validation messages, success messages, and WhatsApp integration.

---

##### Task 3.5: Testing & Quality Gates (1-1.5h)

**Backend Testing**:
- [ ] Inquiry endpoint accepts valid requests without authentication
- [ ] Lead user created with dummy password
- [ ] Booking saved with PENDING status
- [ ] Webhook emitted to n8n successfully
- [ ] Same-day bookings allowed (end date = start date)
- [ ] Validation errors returned properly
- [ ] Availability checking works
- [ ] Price calculation correct

**n8n Workflow Testing**:
- [ ] Webhook receives data from backend
- [ ] Confirmation email sent to customer within 1 minute
- [ ] Admin notification sent
- [ ] WhatsApp message generated with all details
- [ ] Follow-up workflow triggers after 24h
- [ ] Status change webhooks work

**Frontend Testing**:
- [ ] Widget collects all required customer fields
- [ ] Form validation displays inline errors
- [ ] Price updates dynamically with date changes
- [ ] Same-day bookings allowed in date picker
- [ ] Submission shows loading state
- [ ] Success modal displays booking reference
- [ ] WhatsApp link opens with pre-filled message
- [ ] Error handling works gracefully
- [ ] Responsive on mobile devices

**Integration Testing**:
- [ ] End-to-end: Widget → Backend → n8n → Email received
- [ ] Test with all 4 languages
- [ ] Test with different currencies
- [ ] Test with/without captain requirement
- [ ] Test same-day vs multi-day bookings

---

#### Wave 3 Quality Gates:
- [ ] User can submit inquiry without authentication
- [ ] Lead user saved in database for marketing
- [ ] Email confirmation received within 1 minute
- [ ] Admin receives notification
- [ ] WhatsApp message generated correctly
- [ ] Price calculation accurate and dynamic
- [ ] Same-day bookings work
- [ ] Form validation prevents invalid submissions
- [ ] Success modal shows next steps
- [ ] All 4 languages supported
- [ ] Mobile responsive

#### Wave 3 Testing Checklist:
- [ ] Inquiry submission without login
- [ ] Same-day booking (start date = end date)
- [ ] Multi-day booking
- [ ] Booking at boat capacity
- [ ] Booking exceeding capacity (should fail validation)
- [ ] Invalid email format (should fail validation)
- [ ] Empty required fields (should fail validation)
- [ ] Price calculation for 1, 3, 7 days
- [ ] Price calculation with/without captain
- [ ] Currency switching (EUR, USD, GBP, BRL)
- [ ] WhatsApp link generation
- [ ] Email delivery to customer
- [ ] Email delivery to admin
- [ ] n8n follow-up workflow after 24h

---

#### Files to Create/Modify Summary:

**Backend (5 new + 3 modified)**:
1. ✨ NEW: `CreateInquiryRequest.java`
2. ✨ NEW: `WebhookService.java`
3. ✏️ MODIFY: `BookingController.java` - Add inquiry endpoint
4. ✏️ MODIFY: `BookingService.java` - Add createInquiry method
5. ✏️ MODIFY: `SecurityConfig.java` - Allow public access
6. ✏️ MODIFY: `application.yml` - Add n8n config

**Frontend (1 modified)**:
1. ✏️ MODIFY: `app/[locale]/boats/[slug]/page.tsx` - Enhance widget

**Translations (4 modified)**:
1. ✏️ MODIFY: `messages/en.json`
2. ✏️ MODIFY: `messages/es.json`
3. ✏️ MODIFY: `messages/pt-BR.json`
4. ✏️ MODIFY: `messages/pt-PT.json`

**n8n (3 new workflows)**:
1. ✨ NEW: `booking-inquiry-new` workflow
2. ✨ NEW: `booking-inquiry-followup` workflow
3. ✨ NEW: `booking-status-update` workflow

**Total**: 6 new files, 8 modified files, 3 new n8n workflows

---

### 📅 Next Wave After Wave 3: Wave 4 - Admin Dashboard

**Priority**: After booking system is complete and tested

**Key Tasks**:
1. Admin dashboard overview with statistics
2. Boats management (CRUD interface)
3. Bookings management (status updates, notes)
4. Users management (view, activate/deactivate)
5. Locations management

**Estimated Time**: 10-14 hours

---

### Recommended Sequence:
```
✅ Wave 1 (Backend Integration) → ✅ Wave 2 (Authentication)
→ 🎯 Wave 3 (Booking System) [NEXT]
→ Wave 4 (Admin Dashboard)
→ Wave 5 (Advanced Features)
→ Wave 6 (Testing & QA)
→ Wave 7 (Production)
```

### Key Dependencies:
- **Wave 3** requires Waves 1 & 2 ✅ (READY TO START)
- **Wave 4** requires Waves 1, 2, 3 (booking data needed for admin management)
- **Waves 5-7** can be done in parallel after Wave 4 completes

---

## 📝 Notes

- Backend is production-ready and well-architected
- Frontend has good foundation but needs integration work
- Focus should be on connecting existing frontend to backend API
- Admin panel will require the most new development
- Testing and deployment infrastructure is completely missing

**Key Insight**: The heaviest lift is not building new features, but rather integrating the existing frontend with the backend and building out the admin interface. The public-facing pages are ~70% done and just need API connections.
