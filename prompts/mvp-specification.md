# Villas Boats - MVP Implementation Specification

**Timeline**: 1 Week Development Sprint
**Last Updated**: 2025-11-01

---

## 📋 Executive Summary

**Project**: Villas Boats - Premium boat rental platform for Portugal and Brazil
**Slogan**: "Sail towards your dreams"
**MVP Scope**: Admin-managed boat catalog with WhatsApp-based booking flow
**Target Markets**: 6 locations (Porto, Lisbon, Algarve, São Paulo, Rio de Janeiro, Santa Catarina)

### Key MVP Features
1. ✅ Public website (Homepage, Boat List, Boat Details)
2. ✅ Quick search and filtering
3. ✅ WhatsApp booking integration
4. ✅ Admin dashboard (Boat CRUD, Customer CRUD, Reservation tracking)
5. ✅ Multi-language (EN, PT_BR, PT_PT, ES)
6. ✅ Multi-currency (USD, EUR, GBP, BRL) - static prices per boat

### Deferred to Phase 2
- ❌ Customer authentication/accounts
- ❌ Online payment processing
- ❌ Statistics dashboard
- ❌ Newsletter subscription
- ❌ "How does it work?" page
- ❌ Destinations page
- ❌ Featured/Highlights section

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                            BOAT                                  │
├─────────────────────────────────────────────────────────────────┤
│ id                    BIGINT (PK)                                │
│ name_en               VARCHAR(255)                               │
│ name_pt_br            VARCHAR(255)                               │
│ name_pt_pt            VARCHAR(255)                               │
│ name_es               VARCHAR(255)                               │
│ description_en        TEXT                                       │
│ description_pt_br     TEXT                                       │
│ description_pt_pt     TEXT                                       │
│ description_es        TEXT                                       │
│ brand                 VARCHAR(100)                               │
│ model                 VARCHAR(100)                               │
│ boat_type             VARCHAR(50)  -- ENUM: SAILBOAT, MOTORBOAT, │
│                                       CATAMARAN, YACHT, JETSKI,  │
│                                       FISHING_BOAT               │
│ rental_type           VARCHAR(50)  -- ENUM: BAREBOAT, SKIPPERED, │
│                                       CREWED, DAY_TRIP, MULTI_DAY│
│ capacity              INTEGER                                    │
│ length_feet           DECIMAL(5,2)                               │
│ price_usd             DECIMAL(10,2)                              │
│ price_eur             DECIMAL(10,2)                              │
│ price_gbp             DECIMAL(10,2)                              │
│ price_brl             DECIMAL(10,2)                              │
│ location_id           BIGINT (FK -> LOCATION)                    │
│ latitude              DECIMAL(10,8)                              │
│ longitude             DECIMAL(11,8)                              │
│ status                VARCHAR(20)  -- ENUM: ACTIVE, INACTIVE     │
│ created_at            TIMESTAMP                                  │
│ updated_at            TIMESTAMP                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ 1:N
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BOAT_IMAGE                               │
├─────────────────────────────────────────────────────────────────┤
│ id                    BIGINT (PK)                                │
│ boat_id               BIGINT (FK -> BOAT)                        │
│ file_path             VARCHAR(500)                               │
│ display_order         INTEGER                                    │
│ is_primary            BOOLEAN                                    │
│ created_at            TIMESTAMP                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          LOCATION                                │
├─────────────────────────────────────────────────────────────────┤
│ id                    BIGINT (PK)                                │
│ name_en               VARCHAR(100)                               │
│ name_pt_br            VARCHAR(100)                               │
│ name_pt_pt            VARCHAR(100)                               │
│ name_es               VARCHAR(100)                               │
│ country               VARCHAR(50)  -- ENUM: PORTUGAL, BRAZIL     │
│ city                  VARCHAR(100)                               │
│ region                VARCHAR(100)                               │
│ slug                  VARCHAR(100) UNIQUE                        │
│ is_active             BOOLEAN                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          AMENITY                                 │
├─────────────────────────────────────────────────────────────────┤
│ id                    BIGINT (PK)                                │
│ name_en               VARCHAR(100)                               │
│ name_pt_br            VARCHAR(100)                               │
│ name_pt_pt            VARCHAR(100)                               │
│ name_es               VARCHAR(100)                               │
│ icon                  VARCHAR(50)   -- Icon identifier           │
│ category              VARCHAR(50)   -- SAFETY, COMFORT, NAVIGATION│
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ M:N
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BOAT_AMENITY                               │
├─────────────────────────────────────────────────────────────────┤
│ boat_id               BIGINT (FK -> BOAT)                        │
│ amenity_id            BIGINT (FK -> AMENITY)                     │
│ PRIMARY KEY (boat_id, amenity_id)                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         CUSTOMER                                 │
├─────────────────────────────────────────────────────────────────┤
│ id                    BIGINT (PK)                                │
│ name                  VARCHAR(255)                               │
│ email                 VARCHAR(255) UNIQUE                        │
│ phone                 VARCHAR(50)                                │
│ preferred_language    VARCHAR(10)  -- EN, PT_BR, PT_PT, ES       │
│ created_at            TIMESTAMP                                  │
│ updated_at            TIMESTAMP                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ 1:N
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BOOKING_REQUEST                             │
├─────────────────────────────────────────────────────────────────┤
│ id                    BIGINT (PK)                                │
│ customer_id           BIGINT (FK -> CUSTOMER)                    │
│ boat_id               BIGINT (FK -> BOAT)                        │
│ check_in_date         DATE                                       │
│ check_out_date        DATE                                       │
│ num_passengers        INTEGER                                    │
│ price_amount          DECIMAL(10,2)                              │
│ price_currency        VARCHAR(3)   -- USD, EUR, GBP, BRL         │
│ additional_info       TEXT                                       │
│ status                VARCHAR(20)  -- PENDING, CONFIRMED,        │
│                                       CANCELLED, COMPLETED        │
│ whatsapp_sent_at      TIMESTAMP                                  │
│ confirmed_at          TIMESTAMP                                  │
│ confirmed_by_admin_id BIGINT (FK -> ADMIN_USER)                  │
│ created_at            TIMESTAMP                                  │
│ updated_at            TIMESTAMP                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN_USER                                │
├─────────────────────────────────────────────────────────────────┤
│ id                    BIGINT (PK)                                │
│ username              VARCHAR(100) UNIQUE                        │
│ password_hash         VARCHAR(255)                               │
│ email                 VARCHAR(255) UNIQUE                        │
│ full_name             VARCHAR(255)                               │
│ role                  VARCHAR(50)  -- ADMIN, SUPER_ADMIN         │
│ is_active             BOOLEAN                                    │
│ last_login_at         TIMESTAMP                                  │
│ created_at            TIMESTAMP                                  │
│ updated_at            TIMESTAMP                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Database Indexes

```sql
-- BOAT table indexes
CREATE INDEX idx_boat_location ON boat(location_id);
CREATE INDEX idx_boat_type ON boat(boat_type);
CREATE INDEX idx_boat_status ON boat(status);
CREATE INDEX idx_boat_price_usd ON boat(price_usd);
CREATE INDEX idx_boat_capacity ON boat(capacity);

-- BOAT_IMAGE table indexes
CREATE INDEX idx_boat_image_boat ON boat_image(boat_id);
CREATE INDEX idx_boat_image_primary ON boat_image(is_primary) WHERE is_primary = true;

-- BOOKING_REQUEST table indexes
CREATE INDEX idx_booking_customer ON booking_request(customer_id);
CREATE INDEX idx_booking_boat ON booking_request(boat_id);
CREATE INDEX idx_booking_status ON booking_request(status);
CREATE INDEX idx_booking_dates ON booking_request(check_in_date, check_out_date);

-- CUSTOMER table indexes
CREATE INDEX idx_customer_email ON customer(email);
CREATE INDEX idx_customer_phone ON customer(phone);
```

---

## 🔌 Backend API Specification

**Base URL**: `/api/v1`
**Authentication**: JWT Bearer token (admin endpoints only)

### Public Endpoints

#### 1. Locations

```
GET /locations
Description: Get all active locations
Response: 200 OK
[
  {
    "id": 1,
    "name": "Porto",
    "country": "PORTUGAL",
    "city": "Porto",
    "region": "Norte",
    "slug": "porto"
  },
  ...
]
```

#### 2. Amenities

```
GET /amenities
Description: Get all amenities with translations
Query Params:
  - lang: string (optional, default: EN)
Response: 200 OK
[
  {
    "id": 1,
    "name": "GPS Navigation",
    "icon": "navigation",
    "category": "NAVIGATION"
  },
  ...
]
```

#### 3. Boats - Search/List

```
GET /boats
Description: Search and filter boats
Query Params:
  - locationId: number (optional)
  - checkInDate: string (ISO date, optional)
  - checkOutDate: string (ISO date, optional)
  - numPassengers: number (optional)
  - boatType: string (optional) -- SAILBOAT, MOTORBOAT, etc.
  - rentalType: string (optional)
  - minPrice: number (optional)
  - maxPrice: number (optional)
  - currency: string (default: EUR) -- USD, EUR, GBP, BRL
  - minCapacity: number (optional)
  - maxCapacity: number (optional)
  - amenities: string[] (optional, comma-separated IDs)
  - sortBy: string (optional) -- PRICE_ASC, PRICE_DESC, CAPACITY_ASC, CAPACITY_DESC
  - page: number (default: 0)
  - size: number (default: 20)
  - lang: string (default: EN)

Response: 200 OK
{
  "content": [
    {
      "id": 1,
      "name": "Luxury Sailing Yacht",
      "description": "Beautiful 45-foot sailing yacht...",
      "brand": "Beneteau",
      "model": "Oceanis 45",
      "boatType": "SAILBOAT",
      "rentalType": "SKIPPERED",
      "capacity": 8,
      "lengthFeet": 45.0,
      "price": {
        "amount": 850.00,
        "currency": "EUR"
      },
      "location": {
        "id": 1,
        "name": "Porto",
        "city": "Porto"
      },
      "primaryImage": "/uploads/boats/1/primary.jpg",
      "amenities": [
        {"id": 1, "name": "GPS Navigation", "icon": "navigation"},
        ...
      ]
    },
    ...
  ],
  "totalElements": 42,
  "totalPages": 3,
  "currentPage": 0,
  "size": 20
}
```

#### 4. Boat Details

```
GET /boats/{id}
Description: Get detailed information about a specific boat
Query Params:
  - lang: string (default: EN)
  - currency: string (default: EUR)

Response: 200 OK
{
  "id": 1,
  "name": "Luxury Sailing Yacht",
  "description": "Beautiful 45-foot sailing yacht with modern amenities...",
  "brand": "Beneteau",
  "model": "Oceanis 45",
  "boatType": "SAILBOAT",
  "rentalType": "SKIPPERED",
  "capacity": 8,
  "lengthFeet": 45.0,
  "price": {
    "amount": 850.00,
    "currency": "EUR"
  },
  "location": {
    "id": 1,
    "name": "Porto",
    "city": "Porto",
    "country": "PORTUGAL",
    "latitude": 41.1579,
    "longitude": -8.6291
  },
  "images": [
    {
      "id": 1,
      "filePath": "/uploads/boats/1/primary.jpg",
      "isPrimary": true,
      "displayOrder": 1
    },
    ...
  ],
  "amenities": [
    {"id": 1, "name": "GPS Navigation", "icon": "navigation", "category": "NAVIGATION"},
    {"id": 2, "name": "Life Jackets", "icon": "safety", "category": "SAFETY"},
    ...
  ]
}
```

#### 5. Booking Request - Create

```
POST /booking-requests
Description: Create a new booking request (triggers WhatsApp integration)
Request Body:
{
  "boatId": 1,
  "customerName": "João Silva",
  "customerEmail": "joao@example.com",
  "customerPhone": "+351912345678",
  "checkInDate": "2025-07-15",
  "checkOutDate": "2025-07-18",
  "numPassengers": 6,
  "priceCurrency": "EUR",
  "additionalInfo": "We would like to include fishing equipment",
  "preferredLanguage": "PT_PT"
}

Response: 201 CREATED
{
  "id": 123,
  "status": "PENDING",
  "boat": {
    "id": 1,
    "name": "Luxury Sailing Yacht"
  },
  "checkInDate": "2025-07-15",
  "checkOutDate": "2025-07-18",
  "priceAmount": 2550.00,
  "priceCurrency": "EUR",
  "whatsappSentAt": "2025-11-01T14:30:00Z",
  "message": "Booking request submitted successfully. Our team will contact you via WhatsApp shortly."
}
```

### Admin Endpoints (Requires Authentication)

#### 6. Admin Authentication

```
POST /admin/auth/login
Description: Admin login
Request Body:
{
  "username": "admin",
  "password": "securePassword123"
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@villasboats.com",
    "fullName": "Admin User",
    "role": "ADMIN"
  }
}
```

#### 7. Boats - Admin CRUD

```
GET /admin/boats
Description: Get all boats (admin view)
Query Params: Same as public /boats but includes INACTIVE boats
Response: 200 OK (same structure as public endpoint)

POST /admin/boats
Description: Create a new boat
Request Body: multipart/form-data
{
  "name_en": "Luxury Sailing Yacht",
  "name_pt_br": "Iate de Luxo",
  "name_pt_pt": "Iate de Luxo",
  "name_es": "Yate de Lujo",
  "description_en": "Beautiful 45-foot sailing yacht...",
  "description_pt_br": "Belo iate à vela de 45 pés...",
  "description_pt_pt": "Belo iate à vela de 45 pés...",
  "description_es": "Hermoso yate de vela de 45 pies...",
  "brand": "Beneteau",
  "model": "Oceanis 45",
  "boatType": "SAILBOAT",
  "rentalType": "SKIPPERED",
  "capacity": 8,
  "lengthFeet": 45.0,
  "priceUsd": 950.00,
  "priceEur": 850.00,
  "priceGbp": 750.00,
  "priceBrl": 5200.00,
  "locationId": 1,
  "latitude": 41.1579,
  "longitude": -8.6291,
  "amenityIds": [1, 2, 3, 5, 8],
  "images": [File, File, File],  // Image files
  "status": "ACTIVE"
}

Response: 201 CREATED
{
  "id": 1,
  "name": "Luxury Sailing Yacht",
  ...
}

PUT /admin/boats/{id}
Description: Update an existing boat
Request Body: Same as POST
Response: 200 OK

DELETE /admin/boats/{id}
Description: Soft delete a boat (set status to INACTIVE)
Response: 204 NO CONTENT
```

#### 8. Boat Images - Admin Management

```
POST /admin/boats/{boatId}/images
Description: Upload additional images to a boat
Request Body: multipart/form-data
{
  "images": [File, File],
  "displayOrders": [2, 3]  // Optional, auto-incremented if not provided
}

Response: 201 CREATED
[
  {"id": 5, "filePath": "/uploads/boats/1/img5.jpg", "displayOrder": 2},
  {"id": 6, "filePath": "/uploads/boats/1/img6.jpg", "displayOrder": 3}
]

DELETE /admin/boats/{boatId}/images/{imageId}
Description: Delete a boat image
Response: 204 NO CONTENT

PUT /admin/boats/{boatId}/images/{imageId}/primary
Description: Set an image as primary
Response: 200 OK
```

#### 9. Customers - Admin CRUD

```
GET /admin/customers
Description: Get all customers
Query Params:
  - search: string (optional, searches name/email/phone)
  - page: number (default: 0)
  - size: number (default: 20)

Response: 200 OK
{
  "content": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "phone": "+351912345678",
      "preferredLanguage": "PT_PT",
      "createdAt": "2025-10-15T10:30:00Z",
      "totalBookings": 3
    },
    ...
  ],
  "totalElements": 45,
  "totalPages": 3
}

GET /admin/customers/{id}
Description: Get customer details
Response: 200 OK
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "+351912345678",
  "preferredLanguage": "PT_PT",
  "createdAt": "2025-10-15T10:30:00Z",
  "bookingRequests": [
    {
      "id": 123,
      "boat": {"id": 1, "name": "Luxury Sailing Yacht"},
      "checkInDate": "2025-07-15",
      "checkOutDate": "2025-07-18",
      "status": "CONFIRMED"
    },
    ...
  ]
}

PUT /admin/customers/{id}
Description: Update customer information
Request Body:
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "+351912345678",
  "preferredLanguage": "PT_PT"
}

Response: 200 OK
```

#### 10. Booking Requests - Admin Management

```
GET /admin/booking-requests
Description: Get all booking requests with filtering
Query Params:
  - status: string (optional) -- PENDING, CONFIRMED, CANCELLED, COMPLETED
  - boatId: number (optional)
  - customerId: number (optional)
  - fromDate: string (ISO date, optional)
  - toDate: string (ISO date, optional)
  - page: number (default: 0)
  - size: number (default: 20)

Response: 200 OK
{
  "content": [
    {
      "id": 123,
      "customer": {
        "id": 1,
        "name": "João Silva",
        "email": "joao@example.com",
        "phone": "+351912345678"
      },
      "boat": {
        "id": 1,
        "name": "Luxury Sailing Yacht",
        "primaryImage": "/uploads/boats/1/primary.jpg"
      },
      "checkInDate": "2025-07-15",
      "checkOutDate": "2025-07-18",
      "numPassengers": 6,
      "priceAmount": 2550.00,
      "priceCurrency": "EUR",
      "additionalInfo": "We would like to include fishing equipment",
      "status": "PENDING",
      "createdAt": "2025-11-01T14:30:00Z",
      "whatsappSentAt": "2025-11-01T14:30:05Z"
    },
    ...
  ],
  "totalElements": 28,
  "totalPages": 2
}

GET /admin/booking-requests/{id}
Description: Get booking request details
Response: 200 OK (detailed view of single booking request)

PUT /admin/booking-requests/{id}/confirm
Description: Confirm a booking request
Response: 200 OK
{
  "id": 123,
  "status": "CONFIRMED",
  "confirmedAt": "2025-11-02T09:15:00Z",
  "confirmedByAdminId": 1
}

PUT /admin/booking-requests/{id}/cancel
Description: Cancel a booking request
Request Body:
{
  "reason": "Customer requested cancellation"  // Optional
}

Response: 200 OK
{
  "id": 123,
  "status": "CANCELLED"
}
```

---

## 🎨 Frontend Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS + ShadCN UI
- **I18N**: next-intl
- **State Management**: React Context + Hooks
- **Forms**: react-hook-form + zod
- **API Client**: Axios
- **Maps**: @googlemaps/js-api-loader
- **Image Optimization**: next/image

### Directory Structure

```
src/
├── app/
│   ├── [locale]/                      # I18N locale routing
│   │   ├── layout.tsx                 # Root layout with providers
│   │   ├── page.tsx                   # Homepage
│   │   ├── boats/
│   │   │   ├── page.tsx               # Boat list page
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Boat details page
│   │   └── admin/
│   │       ├── layout.tsx             # Admin layout with auth check
│   │       ├── login/
│   │       │   └── page.tsx           # Admin login
│   │       ├── dashboard/
│   │       │   └── page.tsx           # Admin dashboard home
│   │       ├── boats/
│   │       │   ├── page.tsx           # Boat management list
│   │       │   ├── new/
│   │       │   │   └── page.tsx       # Create boat form
│   │       │   └── [id]/
│   │       │       └── edit/
│   │       │           └── page.tsx   # Edit boat form
│   │       ├── customers/
│   │       │   ├── page.tsx           # Customer list
│   │       │   └── [id]/
│   │       │       └── page.tsx       # Customer details
│   │       └── bookings/
│   │           ├── page.tsx           # Booking requests list
│   │           └── [id]/
│   │               └── page.tsx       # Booking details
│   └── api/                           # API routes (proxy to backend)
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts
├── components/
│   ├── ui/                            # ShadCN components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Navbar.tsx                 # Main navigation
│   │   ├── Footer.tsx                 # Footer
│   │   ├── AdminSidebar.tsx           # Admin sidebar navigation
│   │   └── LanguageCurrencySelector.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── QuickSearchForm.tsx
│   │   └── FeaturedBoats.tsx          # Future use
│   ├── boats/
│   │   ├── BoatCard.tsx               # Boat card for list view
│   │   ├── BoatFilters.tsx            # Filter sidebar/panel
│   │   ├── BoatGallery.tsx            # Image gallery for details
│   │   ├── BoatAmenities.tsx          # Amenities display
│   │   ├── BoatLocationMap.tsx        # Google Maps integration
│   │   └── BookingForm.tsx            # Booking request form
│   └── admin/
│       ├── boats/
│       │   ├── BoatForm.tsx           # Create/Edit boat form
│       │   ├── BoatImageUpload.tsx    # Image upload component
│       │   └── BoatTable.tsx          # Boat list table
│       ├── customers/
│       │   ├── CustomerTable.tsx
│       │   └── CustomerForm.tsx
│       └── bookings/
│           ├── BookingTable.tsx
│           └── BookingDetailsCard.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts                  # Axios instance with auth
│   │   ├── boats.ts                   # Boat API calls
│   │   ├── bookings.ts                # Booking API calls
│   │   ├── customers.ts               # Customer API calls
│   │   └── admin.ts                   # Admin API calls
│   ├── hooks/
│   │   ├── useBoats.ts                # Boat data fetching hooks
│   │   ├── useBookings.ts
│   │   ├── useAuth.ts                 # Authentication hook
│   │   └── useCurrency.ts             # Currency context hook
│   ├── contexts/
│   │   ├── CurrencyContext.tsx        # Currency state management
│   │   └── AuthContext.tsx            # Auth state management
│   ├── utils/
│   │   ├── currency.ts                # Currency formatting
│   │   ├── date.ts                    # Date formatting
│   │   └── whatsapp.ts                # WhatsApp URL generation
│   └── validations/
│       ├── boat.schema.ts             # Zod schemas
│       ├── booking.schema.ts
│       └── customer.schema.ts
├── messages/                          # I18N translation files
│   ├── en.json
│   ├── pt-BR.json
│   ├── pt-PT.json
│   └── es.json
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   └── hero-bg.jpg
│   └── uploads/                       # User-uploaded images (boats)
└── middleware.ts                      # I18N + Auth middleware
```

### Key Components Specification

#### 1. Navbar Component
```tsx
// components/layout/Navbar.tsx
Features:
- Logo with link to homepage
- Horizontal menu: Boats, Destinations (future), How it Works (future)
- Language/Currency selector dropdown
- Login/Register link → Admin Login for MVP
- Responsive: Hamburger menu on mobile
- Sticky on scroll with glassmorphism effect
```

#### 2. QuickSearchForm Component
```tsx
// components/home/QuickSearchForm.tsx
Features:
- Location dropdown (6 locations)
- Check-in/Check-out date pickers (react-day-picker)
- Number of passengers input
- "Search Boats" CTA button
- Form validation with react-hook-form + zod
- Redirects to /boats with query params
```

#### 3. BoatCard Component
```tsx
// components/boats/BoatCard.tsx
Features:
- Primary image with Next.js image optimization
- Boat name (translated)
- Location + boat type + capacity icons
- Price display (formatted in selected currency)
- "View Details" button → /boats/[id]
- Hover effect with elevation
```

#### 4. BoatFilters Component
```tsx
// components/boats/BoatFilters.tsx
Features:
- Collapsible filter sections (mobile)
- Location multi-select
- Date range picker
- Boat type checkboxes
- Rental type checkboxes
- Price range slider (min/max in selected currency)
- Capacity slider
- Amenities multi-select
- "Apply Filters" button
- "Clear All" button
- Updates URL query params
```

#### 5. BoatGallery Component
```tsx
// components/boats/BoatGallery.tsx
Features:
- Main large image display
- Thumbnail strip below (horizontal scroll)
- Click thumbnail to change main image
- Full-screen modal view with navigation arrows
- Image lazy loading
```

#### 6. BookingForm Component
```tsx
// components/boats/BookingForm.tsx
Features:
- Customer name, email, phone inputs
- Check-in/check-out date pickers (pre-filled from quick search)
- Number of passengers
- Additional information textarea
- Price display (calculated from dates + boat price)
- "Request Booking via WhatsApp" CTA button
- Form validation
- On submit: POST /api/v1/booking-requests → Opens WhatsApp with pre-filled message
```

#### 7. BoatLocationMap Component
```tsx
// components/boats/BoatLocationMap.tsx
Features:
- Google Maps embed with marker at marina location
- Zoom controls
- Info window with marina name
- Responsive sizing
```

#### 8. BoatForm Component (Admin)
```tsx
// components/admin/boats/BoatForm.tsx
Features:
- Tabbed sections: Basic Info, Descriptions (I18N), Pricing, Location, Amenities, Images
- Basic Info: Name (4 languages), Brand, Model, Type, Rental Type, Capacity, Length
- Pricing: Input for USD, EUR, GBP, BRL
- Location: Dropdown + Latitude/Longitude inputs (Google Maps autocomplete)
- Amenities: Multi-select checkboxes
- Images: Drag-and-drop upload, set primary, reorder
- Save/Update button
- Form validation with react-hook-form + zod
```

#### 9. BookingTable Component (Admin)
```tsx
// components/admin/bookings/BookingTable.tsx
Features:
- Table columns: ID, Customer, Boat, Dates, Passengers, Price, Status, Actions
- Status badges (color-coded)
- Filter by status dropdown
- Search by customer name/email
- Pagination controls
- Action buttons: View Details, Confirm, Cancel
- Click row → /admin/bookings/[id]
```

### Responsive Design Breakpoints

```css
/* TailwindCSS breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */

/* Component behavior */
- Navbar: Hamburger menu below lg
- QuickSearchForm: Stacked inputs below md, horizontal above
- BoatFilters: Bottom sheet on mobile (below md), sidebar on desktop
- BoatCard: 1 col (mobile), 2 cols (md), 3 cols (lg)
- Admin Sidebar: Overlay on mobile, fixed on desktop (lg+)
```

---

## 📅 Development Task Breakdown (1 Week)

### Day 1-2: Foundation & Infrastructure (16 hours)

#### Backend Setup (8 hours)
- [ ] Create Spring Boot project with Java 25
  - [ ] Add dependencies: Spring Web, Spring Data JPA, Spring Security, PostgreSQL, Flyway, Lombok, MapStruct, Validation
  - [ ] Configure application.yml (dev, prod profiles)
  - [ ] Set up logging (SLF4J + Logback)
  - **Estimate**: 1.5 hours

- [ ] Database setup
  - [ ] Create PostgreSQL Docker container
  - [ ] Write Flyway migration scripts (V1__initial_schema.sql)
  - [ ] Seed initial data (locations, amenities)
  - [ ] Test migrations
  - **Estimate**: 2.5 hours

- [ ] Entity layer
  - [ ] Create JPA entities (Boat, Location, Amenity, Customer, BookingRequest, AdminUser, BoatImage, BoatAmenity)
  - [ ] Define relationships (@OneToMany, @ManyToMany, etc.)
  - [ ] Add validation annotations
  - **Estimate**: 2 hours

- [ ] Repository layer
  - [ ] Create Spring Data JPA repositories
  - [ ] Custom query methods (search, filters)
  - **Estimate**: 1 hour

- [ ] Security & Authentication
  - [ ] Configure Spring Security
  - [ ] JWT token generation and validation
  - [ ] Admin authentication endpoint
  - [ ] Password encoding (BCrypt)
  - **Estimate**: 2 hours

#### Frontend Setup (8 hours)
- [ ] Create Next.js project
  - [ ] Initialize with TypeScript, TailwindCSS, ESLint, Prettier
  - [ ] Install dependencies: next-intl, react-hook-form, zod, axios, @googlemaps/js-api-loader, lucide-react
  - [ ] Configure tailwind.config.ts
  - **Estimate**: 1 hour

- [ ] ShadCN UI setup
  - [ ] Initialize ShadCN
  - [ ] Install base components (button, card, input, select, dialog, dropdown, badge, table)
  - **Estimate**: 0.5 hours

- [ ] I18N configuration
  - [ ] Set up next-intl
  - [ ] Create locale routing middleware
  - [ ] Create base translation files (en.json, pt-BR.json, pt-PT.json, es.json)
  - [ ] Translate common UI strings (navbar, footer, form labels)
  - **Estimate**: 2 hours

- [ ] Global contexts and providers
  - [ ] CurrencyContext (currency selection state)
  - [ ] AuthContext (admin authentication state)
  - [ ] Root layout with providers
  - **Estimate**: 1.5 hours

- [ ] API client setup
  - [ ] Create Axios instance with base URL and interceptors
  - [ ] Add JWT token injection for admin routes
  - [ ] Error handling middleware
  - **Estimate**: 1 hour

- [ ] Base layout components
  - [ ] Navbar component (without menu items yet)
  - [ ] Footer component (basic structure)
  - [ ] LanguageCurrencySelector component
  - **Estimate**: 2 hours

---

### Day 3-4: Core Features - Public Site (16 hours)

#### Backend API Development (8 hours)
- [ ] DTO layer
  - [ ] Create DTOs for all entities (BoatDTO, LocationDTO, etc.)
  - [ ] MapStruct mappers for Entity ↔ DTO conversion
  - **Estimate**: 2 hours

- [ ] Service layer
  - [ ] BoatService (search, filter, getById)
  - [ ] LocationService (getAll)
  - [ ] AmenityService (getAll)
  - [ ] BookingRequestService (create, sendWhatsApp integration)
  - [ ] Implement business logic and validation
  - **Estimate**: 3 hours

- [ ] Controller layer (Public APIs)
  - [ ] LocationController (/api/v1/locations)
  - [ ] AmenityController (/api/v1/amenities)
  - [ ] BoatController (/api/v1/boats, /api/v1/boats/{id})
  - [ ] BookingRequestController (/api/v1/booking-requests POST)
  - [ ] Add @RestController, @RequestMapping, validation
  - **Estimate**: 2 hours

- [ ] WhatsApp integration
  - [ ] Create WhatsApp URL generator service
  - [ ] Message template with booking details
  - [ ] Test integration
  - **Estimate**: 1 hour

#### Frontend Public Pages (8 hours)
- [ ] Homepage
  - [ ] HeroSection with background image and slogan
  - [ ] QuickSearchForm component
  - [ ] Basic Footer with links
  - [ ] Connect QuickSearchForm to /boats route with query params
  - **Estimate**: 2.5 hours

- [ ] Boat List Page (/boats)
  - [ ] Fetch boats from API with query params
  - [ ] BoatCard component
  - [ ] Grid layout (responsive)
  - [ ] BoatFilters component (sidebar)
  - [ ] Filter state management (URL sync)
  - [ ] Pagination component
  - [ ] Empty state handling
  - **Estimate**: 3 hours

- [ ] Boat Details Page (/boats/[id])
  - [ ] Fetch boat details from API
  - [ ] BoatGallery component
  - [ ] Boat information display (specs, amenities)
  - [ ] BoatLocationMap component (Google Maps integration)
  - [ ] BookingForm component
  - [ ] Handle form submission → WhatsApp redirect
  - **Estimate**: 2.5 hours

---

### Day 5-6: Admin Dashboard (16 hours)

#### Backend Admin APIs (6 hours)
- [ ] Admin service layer
  - [ ] AdminBoatService (CRUD operations)
  - [ ] AdminCustomerService (CRUD, search)
  - [ ] AdminBookingService (list, filter, confirm, cancel)
  - [ ] Image upload service (multipart file handling)
  - **Estimate**: 2.5 hours

- [ ] Admin controllers
  - [ ] AdminBoatController (/api/v1/admin/boats)
  - [ ] AdminBoatImageController (/api/v1/admin/boats/{id}/images)
  - [ ] AdminCustomerController (/api/v1/admin/customers)
  - [ ] AdminBookingController (/api/v1/admin/booking-requests)
  - [ ] Add authorization checks (@PreAuthorize)
  - **Estimate**: 2.5 hours

- [ ] File storage service
  - [ ] Configure multipart file upload (application.yml)
  - [ ] Image file validation (size, type)
  - [ ] Save to /public/uploads directory
  - [ ] Return file path URLs
  - **Estimate**: 1 hour

#### Frontend Admin Pages (10 hours)
- [ ] Admin authentication
  - [ ] Login page (/admin/login)
  - [ ] AuthContext integration
  - [ ] Protected route middleware
  - [ ] Admin layout with sidebar navigation
  - **Estimate**: 2 hours

- [ ] Admin Dashboard Home
  - [ ] Basic stats cards (placeholder for future)
  - [ ] Quick links to boats, customers, bookings
  - **Estimate**: 0.5 hours

- [ ] Boat Management
  - [ ] Boat list page with BoatTable component
  - [ ] Create boat page with BoatForm
  - [ ] Edit boat page with BoatForm (pre-filled)
  - [ ] BoatImageUpload component (drag-and-drop)
  - [ ] Delete boat confirmation dialog
  - [ ] Form validation and submission
  - **Estimate**: 4 hours

- [ ] Customer Management
  - [ ] Customer list page with CustomerTable
  - [ ] Customer details page
  - [ ] Edit customer form
  - [ ] Search functionality
  - **Estimate**: 1.5 hours

- [ ] Booking Management
  - [ ] Booking list page with BookingTable
  - [ ] Filter by status
  - [ ] Booking details page
  - [ ] Confirm booking action
  - [ ] Cancel booking action
  - **Estimate**: 2 hours

---

### Day 7: Testing, Deployment & Documentation (8 hours)

#### Testing (4 hours)
- [ ] Backend unit tests
  - [ ] Service layer tests (JUnit 5 + Mockito)
  - [ ] Repository tests (@DataJpaTest)
  - [ ] Controller tests (@WebMvcTest)
  - [ ] Aim for 60%+ code coverage
  - **Estimate**: 2.5 hours

- [ ] Backend integration tests
  - [ ] API endpoint tests (@SpringBootTest)
  - [ ] Database integration tests
  - **Estimate**: 1 hour

- [ ] Frontend testing
  - [ ] Component tests (Jest + React Testing Library)
  - [ ] Key user flows: search, booking form, admin login
  - **Estimate**: 0.5 hours

#### Docker & Deployment (2.5 hours)
- [ ] Dockerfiles
  - [ ] Backend Dockerfile (multi-stage build)
  - [ ] Frontend Dockerfile (Next.js production build)
  - **Estimate**: 0.5 hours

- [ ] Docker Compose
  - [ ] PostgreSQL service
  - [ ] Backend service
  - [ ] Frontend service
  - [ ] Nginx reverse proxy (optional)
  - [ ] Environment variable configuration
  - **Estimate**: 1 hour

- [ ] Portainer deployment
  - [ ] Test deployment in Portainer
  - [ ] Verify all services running
  - [ ] Check database migrations
  - **Estimate**: 1 hour

#### Documentation & Handoff (1.5 hours)
- [ ] README.md
  - [ ] Project overview
  - [ ] Setup instructions (local + Docker)
  - [ ] Environment variables
  - [ ] API documentation link
  - **Estimate**: 0.5 hours

- [ ] Admin user guide
  - [ ] How to add boats
  - [ ] How to manage bookings
  - [ ] How to manage customers
  - **Estimate**: 0.5 hours

- [ ] Developer documentation
  - [ ] Architecture overview
  - [ ] Database schema diagram
  - [ ] API endpoints summary
  - [ ] Deployment guide
  - **Estimate**: 0.5 hours

---

## 🔧 Technical Implementation Notes

### Multi-language (I18N) Strategy

**Backend**:
- Store translated fields directly in database columns (name_en, name_pt_br, name_pt_pt, name_es)
- API accepts `lang` query parameter (default: EN)
- Service layer selects appropriate field based on lang param

**Frontend**:
- Use next-intl for UI strings (buttons, labels, messages)
- Locale in URL path: `/en/boats`, `/pt-br/boats`, `/pt-pt/boats`, `/es/boats`
- Boat names/descriptions fetched from backend in selected language

**Translation Files Structure**:
```json
// messages/en.json
{
  "nav": {
    "boats": "Boats",
    "destinations": "Destinations",
    "howItWorks": "How it Works"
  },
  "home": {
    "slogan": "Sail towards your dreams",
    "quickSearch": {
      "location": "Location",
      "checkIn": "Check-in",
      "checkOut": "Check-out",
      "passengers": "Passengers",
      "searchButton": "Search Boats"
    }
  },
  "boats": {
    "filters": {
      "title": "Filters",
      "boatType": "Boat Type",
      "rentalType": "Rental Type",
      "priceRange": "Price Range",
      "capacity": "Capacity",
      "amenities": "Amenities"
    }
  }
  // ... more translations
}
```

### Multi-currency Strategy

**Database**:
- Each boat has 4 price columns: price_usd, price_eur, price_gbp, price_brl
- No conversion logic - static prices set by admin

**Frontend**:
- CurrencyContext provides current currency (default: EUR)
- Currency selector in navbar
- Currency stored in localStorage
- All price displays use selected currency
- Booking form submits with selected currency

**API**:
- Boat search accepts `currency` query param
- Response includes price object: `{ amount: 850.00, currency: "EUR" }`

### WhatsApp Integration

**Message Template**:
```
Hello! I would like to request a booking:

Boat: {boat_name}
Location: {location}
Check-in: {check_in_date}
Check-out: {check_out_date}
Passengers: {num_passengers}
Price: {price_amount} {price_currency}

Customer Details:
Name: {customer_name}
Email: {customer_email}
Phone: {customer_phone}

Additional Information:
{additional_info}

Booking Reference: #{booking_id}
```

**WhatsApp URL Format**:
```
https://wa.me/{WHATSAPP_BUSINESS_NUMBER}?text={encoded_message}
```

**Implementation**:
- Backend generates message, sends WhatsApp URL in API response
- Frontend opens WhatsApp URL in new tab/window
- BookingRequest record created with status=PENDING

### Image Upload & Storage

**MVP Approach** (Local filesystem):
```
/public/uploads/boats/{boat_id}/
  ├── image1.jpg
  ├── image2.jpg
  └── primary.jpg
```

**Backend**:
- Accept multipart/form-data
- Validate file type (jpg, jpeg, png, webp)
- Validate file size (max 5MB per image)
- Generate unique filenames (UUID + extension)
- Save to disk
- Store file_path in boat_image table

**Frontend**:
- Use Next.js `<Image>` component for optimization
- Drag-and-drop upload with react-dropzone
- Preview images before upload
- Progress indicators

**Future Enhancement**: Migrate to S3/CloudFront for production

### Google Maps Integration

**API Key**: Required from Google Cloud Platform
- Enable Maps JavaScript API
- Enable Places API (for autocomplete in admin)
- Restrict key to domain

**Frontend Implementation**:
```tsx
// lib/utils/maps.ts
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places']
});

export const loadGoogleMaps = async () => {
  return await loader.load();
};
```

**Component**:
```tsx
// components/boats/BoatLocationMap.tsx
- Display map with marker at boat location (latitude, longitude)
- Zoom level 14
- Info window with marina name
- Responsive sizing
```

### Authentication & Security

**Backend**:
- Spring Security with JWT tokens
- BCrypt password hashing (strength 12)
- Token expiration: 24 hours
- Admin role-based authorization

**Frontend**:
- Store JWT in localStorage
- Axios interceptor adds Authorization header
- AuthContext manages auth state
- Protected route middleware redirects to login

**Password Requirements** (for admin users):
- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 number

### SEO Optimization

**Next.js Metadata**:
```tsx
// app/[locale]/page.tsx
export const metadata: Metadata = {
  title: 'Villas Boats - Luxury Boat Rentals in Portugal and Brazil',
  description: 'Rent premium boats in Porto, Lisbon, Algarve, São Paulo, Rio de Janeiro, and Santa Catarina. Sail towards your dreams with Villas Boats.',
  keywords: 'boat rental, yacht rental, Portugal, Brazil, luxury boats',
  openGraph: {
    title: 'Villas Boats - Sail towards your dreams',
    description: 'Premium boat rental platform',
    images: ['/images/og-image.jpg']
  }
};
```

**Boat Details Pages**:
- Dynamic metadata with boat name, location, price
- JSON-LD structured data for rich snippets

**Sitemap**:
- Generate sitemap.xml with all boat detail pages
- Update on new boat creation (future automation)

### Linting & Code Quality

**Backend (Java)**:
- **Checkstyle**: Google Java Style Guide
- **SpotBugs**: Static analysis for bugs
- **JaCoCo**: Code coverage reports
- Maven plugins configured in pom.xml

**Frontend (TypeScript/React)**:
- **ESLint**: Airbnb config + Next.js plugin
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- Scripts: `npm run lint`, `npm run format`

### Environment Variables

**Backend** (.env or application.yml):
```yaml
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=villasboats
POSTGRES_USER=villasboats_user
POSTGRES_PASSWORD=securepassword

# JWT
JWT_SECRET=your-secret-key-min-256-bits
JWT_EXPIRATION=86400000

# File Upload
FILE_UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=5242880

# WhatsApp
WHATSAPP_BUSINESS_NUMBER=+351912345678

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://villasboats.com
```

**Frontend** (.env.local):
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_WHATSAPP_NUMBER=+351912345678
```

---

## 🚀 Post-MVP Enhancements (Phase 2)

### Week 2-3: Enhanced Features
1. **Statistics Dashboard**
   - Monthly revenue charts
   - Occupancy rate visualization
   - Top-performing boats
   - Customer acquisition metrics

2. **Featured Boats Section**
   - Admin can mark boats as "featured"
   - Display on homepage
   - Rotation logic

3. **Newsletter Subscription**
   - Email collection form
   - MailChimp/SendGrid integration
   - Admin view of subscribers

4. **Destinations Page**
   - Dedicated page for each location
   - Local attractions, weather info
   - Boats available in that location

5. **How It Works Page**
   - Step-by-step guide
   - FAQ section
   - Trust indicators (security, insurance)

### Week 4-6: Advanced Features
1. **Availability Calendar**
   - Real-time availability checking
   - Block dates when booked
   - Prevent double-bookings

2. **Online Payment Integration**
   - Stripe integration
   - PayPal support
   - Revolut Business
   - MBWay (Portugal)

3. **Customer Accounts**
   - Registration/login for customers
   - View booking history
   - Save favorite boats
   - Profile management

4. **Reviews & Ratings**
   - Customers can rate boats after rental
   - Display average rating on boat cards
   - Review moderation in admin

5. **Email Notifications**
   - Booking confirmation emails
   - Reminder emails (before check-in)
   - Thank you emails (after checkout)

6. **Advanced Search**
   - Full-text search on boat descriptions
   - Autocomplete suggestions
   - Save searches

### Long-term Roadmap
- **Mobile Apps** (React Native)
- **Owner Portal** (boat owners can manage their listings)
- **Dynamic Pricing** (seasonal rates, demand-based pricing)
- **Insurance Integration**
- **Multi-tenant Architecture** (white-label solution for other markets)
- **AI-powered Recommendations**

---

## ✅ Success Criteria for MVP

### Functional Requirements
- [x] User can search boats by location, dates, passengers
- [x] User can filter boats by type, price, capacity, amenities
- [x] User can view boat details with gallery and map
- [x] User can request booking via WhatsApp
- [x] Admin can login to dashboard
- [x] Admin can create, edit, delete boats
- [x] Admin can manage customers (view, edit)
- [x] Admin can view and confirm booking requests
- [x] Website is available in 4 languages (EN, PT_BR, PT_PT, ES)
- [x] Prices are displayed in 4 currencies (USD, EUR, GBP, BRL)

### Non-Functional Requirements
- [x] Responsive design works on mobile, tablet, desktop
- [x] Premium design with luxury aesthetic
- [x] Fast page loads (<3s on 3G)
- [x] SEO-optimized metadata
- [x] Accessible (WCAG 2.1 AA)
- [x] Secure (HTTPS, JWT auth, password hashing)
- [x] Deployable via Docker Compose in Portainer

### Quality Gates
- [x] Backend unit test coverage >60%
- [x] All critical user flows tested (search, booking, admin CRUD)
- [x] Code passes linting (ESLint, Checkstyle)
- [x] No console errors in production build
- [x] Database migrations run successfully
- [x] API response times <500ms (p95)

---

## 📞 Support & Escalation

**Technical Questions**:
- Backend: Java/Spring Boot setup, database schema, API design
- Frontend: Next.js, I18N, component architecture, ShadCN
- DevOps: Docker, Portainer, deployment

**Scope Clarifications**:
- Feature prioritization
- Design decisions
- Timeline adjustments

**Ready for Implementation**: This specification provides a complete blueprint for 1-week MVP development. Proceed to implementation or request clarification on any section.
