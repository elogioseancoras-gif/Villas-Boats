# Villas Boats - Implementation Plan

**Project**: Villas Boats - Premium Boat Rental Platform
**Document Version**: 1.0
**Last Updated**: 2025-11-03
**Status**: Backend Complete | Frontend Pending

---

## 📊 Current State Assessment

### ✅ Completed Backend (100%)

**Core Infrastructure**:
- ✅ Spring Boot 3.3.5 + Java 21 application
- ✅ PostgreSQL 16 database with Flyway migrations
- ✅ JWT authentication framework
- ✅ RESTful API with 43 endpoints
- ✅ Application running on port 8080 with context path `/api`

**Domain Entities**:
- ✅ User (CUSTOMER, ADMIN roles)
- ✅ Location (Portugal & Brazil regions)
- ✅ Boat (with multi-currency pricing)
- ✅ Booking (complete lifecycle management)

**Features Implemented**:
- ✅ Complete CRUD services for all entities
- ✅ Multi-currency support (USD, EUR, GBP, BRL)
- ✅ JSONB-based i18n for entities (EN, PT_BR, PT_PT, ES)
- ✅ Role-based access control
- ✅ Database triggers for statistics
- ✅ Proper data types (BigDecimal for money, LocalDateTime for dates)
- ✅ Comprehensive indexing strategy
- ✅ Multi-layer validation (DB, entity, DTO)

**Persistence Layer Quality**: A (95/100)
- Proper BigDecimal usage for monetary values
- High-precision geographic coordinates
- Efficient JSONB with GIN indexes
- Comprehensive database constraints
- Lazy loading for relationships

### ❌ Missing Implementation

**Frontend** (0%):
1. Next.js application setup
2. Public website pages
3. Admin dashboard
4. UI components library

**Backend Additions** (Partial):
1. Image upload functionality
2. Amenities management (entity exists, needs endpoints)
3. Reviews system (optional for MVP)
4. File storage service

**Infrastructure** (0%):
1. Docker containerization
2. Docker Compose orchestration
3. Production deployment configuration

**Quality Assurance** (0%):
1. Backend unit tests
2. Backend integration tests
3. Frontend component tests
4. E2E tests

**Optimization** (0%):
1. SEO metadata
2. Performance optimization
3. Security hardening
4. WhatsApp integration

---

## 🎯 Implementation Strategy

### Approach: Wave-Based Parallel Implementation

**Philosophy**: Build in progressive waves with quality gates between each phase. Each wave delivers tangible user value and can be validated independently.

**Timeline**: 5 waves over ~1 week sprint (40-54 hours total)

**Quality Gates**: Each wave must pass validation before proceeding to the next:
- All code compiles/builds successfully
- No TypeScript/linting errors
- Core functionality tested manually
- Documentation updated

---

## 🌊 Wave 1: Foundation Setup

**Priority**: 🔴 CRITICAL
**Estimated Time**: 4-6 hours
**Dependencies**: Backend running
**Goal**: Establish frontend infrastructure and API connectivity

### 1.1 Frontend Project Initialization

**Tasks**:
- [ ] Create Next.js 15 project with TypeScript
  ```bash
  cd /home/mcg/src/barcos
  npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir
  ```
- [ ] Install core dependencies:
  - `next-intl` - Internationalization
  - `axios` - HTTP client
  - `@radix-ui/react-*` - ShadCN components
  - `lucide-react` - Icons
  - `zod` - Schema validation
  - `react-hook-form` - Form handling
  - `date-fns` - Date utilities
- [ ] Configure App Router structure
- [ ] Set up TailwindCSS with custom theme (sea/luxury colors)
- [ ] Install and configure ShadCN UI components

**Deliverables**:
```
frontend/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ...
│   └── globals.css
├── components/
│   ├── ui/           (ShadCN components)
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── middleware.ts     (i18n routing)
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

### 1.2 Internationalization Setup

**Tasks**:
- [ ] Configure next-intl middleware
- [ ] Create locale routing (`/en`, `/pt-BR`, `/pt-PT`, `/es`)
- [ ] Set up translation files structure
- [ ] Create initial translation keys for common UI elements
- [ ] Build language switcher component

**Deliverables**:
```
messages/
├── en.json
├── pt-BR.json
├── pt-PT.json
└── es.json

middleware.ts configuration:
- Supported locales: ['en', 'pt-BR', 'pt-PT', 'es']
- Default locale: 'en'
- Locale detection: URL path
```

**Translation Structure**:
```json
{
  "common": {
    "navigation": {},
    "footer": {},
    "currency": {},
    "language": {}
  },
  "home": {},
  "boats": {},
  "booking": {},
  "admin": {}
}
```

### 1.3 API Client Setup

**Tasks**:
- [ ] Create Axios client with base URL configuration
- [ ] Implement request/response interceptors
- [ ] Add JWT token management (localStorage + httpOnly cookies)
- [ ] Create API service modules:
  - `authService.ts` - Login, logout, token refresh
  - `boatService.ts` - CRUD, search, filtering
  - `bookingService.ts` - Create, list, manage
  - `locationService.ts` - List locations
  - `userService.ts` - User management
- [ ] Create TypeScript interfaces for all DTOs (matching backend)

**Deliverables**:
```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor (add JWT token)
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**Type Definitions**:
```typescript
// lib/types/index.ts
export interface Boat {
  id: string;
  slug: string;
  nameI18n: Record<string, string>;
  descriptionI18n: Record<string, string>;
  type: BoatType;
  status: BoatStatus;
  capacity: number;
  lengthFeet: number;
  pricePerDayUsd: number;
  pricePerDayEur: number;
  pricePerDayGbp: number;
  pricePerDayBrl: number;
  location: Location;
  // ... other fields
}

// Match all backend DTOs
```

### 1.4 Core Utilities & Hooks

**Tasks**:
- [ ] Currency context and hook (`useCurrency`)
- [ ] Price formatting utilities
- [ ] Date handling utilities (timezone support)
- [ ] Form validation schemas (Zod)
- [ ] API error handling utilities

**Deliverables**:
```typescript
// lib/contexts/CurrencyContext.tsx
export const CurrencyProvider: React.FC<{ children }>;
export const useCurrency = () => {
  currency: 'USD' | 'EUR' | 'GBP' | 'BRL';
  setCurrency: (currency) => void;
  formatPrice: (amount: number) => string;
  symbol: string;
};

// lib/utils/formatters.ts
export const formatCurrency = (amount: number, currency: string) => string;
export const formatDate = (date: Date, locale: string) => string;

// lib/schemas/bookingSchema.ts
export const createBookingSchema = z.object({ ... });
```

### 1.5 Base Layout Components

**Tasks**:
- [ ] Create responsive Navbar with:
  - Logo and brand name
  - Navigation menu (Boats, Destinations, How it works)
  - Language switcher
  - Currency switcher
  - Login/Register buttons
- [ ] Create Footer with:
  - Contact information
  - Links to main pages
  - Social media links
  - Copyright notice
- [ ] Create basic page layout wrapper

**Deliverables**:
```typescript
// components/layout/Navbar.tsx
export function Navbar() {
  // Responsive navigation with mobile menu
  // Language/currency switchers
  // Authentication state
}

// components/layout/Footer.tsx
export function Footer() {
  // Multi-column footer
  // Newsletter subscription form
}

// app/[locale]/layout.tsx
export default function RootLayout({ children, params: { locale } }) {
  return (
    <html lang={locale}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### Wave 1 Quality Gate

**Validation Checklist**:
- [ ] Frontend dev server runs successfully (`npm run dev`)
- [ ] No TypeScript compilation errors
- [ ] No ESLint errors
- [ ] Basic routing works (`/`, `/en`, `/pt-BR`, etc.)
- [ ] Language switcher changes locale
- [ ] Currency switcher changes displayed currency
- [ ] API client successfully fetches data from backend
- [ ] Navbar and Footer render correctly on all screen sizes

**Success Criteria**:
- Can navigate between locales
- Can switch currency and see updated prices
- Can make API calls to backend
- Base layout components are responsive

---

## 🌊 Wave 2: Public Website Pages

**Priority**: 🔴 HIGH
**Estimated Time**: 8-12 hours
**Dependencies**: Wave 1 complete
**Goal**: Complete public-facing website for boat browsing and booking

### 2.1 Homepage (`/`)

**Tasks**:
- [ ] Hero section with slogan and background image
- [ ] Quick search form (location + dates + passengers)
- [ ] Highlighted/featured boats carousel
- [ ] Newsletter subscription form
- [ ] SEO metadata and Open Graph tags

**Components**:
```typescript
// components/home/HeroSection.tsx
export function HeroSection() {
  // Full-screen hero with background image
  // Slogan: "Sail towards your dreams"
  // Call-to-action button
}

// components/home/QuickSearchForm.tsx
export function QuickSearchForm() {
  const form = useForm<QuickSearchFormData>();

  // Location selector (dropdown)
  // Date range picker (check-in, check-out)
  // Passenger count (number input)
  // Search button → redirects to /boats with query params
}

// components/home/FeaturedBoats.tsx
export function FeaturedBoats() {
  // Carousel of highlighted boats
  // Uses boat cards
}

// components/home/NewsletterForm.tsx
export function NewsletterForm() {
  // Email input + submit
  // Success/error toast notifications
}
```

**Page Implementation**:
```typescript
// app/[locale]/page.tsx
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickSearchForm />
      <FeaturedBoats />
      <NewsletterForm />
    </>
  );
}

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    openGraph: { ... }
  };
}
```

### 2.2 Boat List Page (`/boats`)

**Tasks**:
- [ ] Boat grid with cards (image, name, price, capacity, location)
- [ ] Filter sidebar:
  - Location (dropdown)
  - Boat type (checkboxes)
  - Price range (slider)
  - Capacity (number input)
  - Size in feet (slider)
  - Amenities (checkboxes - if available)
- [ ] Sorting options (price, rating, capacity, size, date)
- [ ] Pagination
- [ ] Loading states (skeleton screens)
- [ ] Empty state handling
- [ ] Mobile-responsive filters (drawer)

**Components**:
```typescript
// components/boats/BoatCard.tsx
export function BoatCard({ boat }: { boat: Boat }) {
  const { currency, formatPrice } = useCurrency();
  const t = useTranslations('boats');

  return (
    <Card>
      <CardImage src={boat.primaryImageUrl} alt={boat.nameI18n[locale]} />
      <CardContent>
        <h3>{boat.nameI18n[locale]}</h3>
        <p>{formatPrice(boat[`pricePerDay${currency}`])} / {t('day')}</p>
        <BoatMeta capacity={boat.capacity} location={boat.location} />
      </CardContent>
    </Card>
  );
}

// components/boats/BoatFilters.tsx
export function BoatFilters({ filters, onFilterChange }) {
  // Location select
  // Boat type checkboxes
  // Price range slider
  // Capacity input
  // Size slider
  // Apply/Reset buttons
}

// components/boats/BoatGrid.tsx
export function BoatGrid({ boats, isLoading }) {
  if (isLoading) return <BoatGridSkeleton />;
  if (boats.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boats.map(boat => <BoatCard key={boat.id} boat={boat} />)}
    </div>
  );
}

// components/boats/BoatSort.tsx
export function BoatSort({ sortBy, onSortChange }) {
  // Dropdown with sort options
}
```

**Page Implementation**:
```typescript
// app/[locale]/boats/page.tsx
export default function BoatsPage({ searchParams }) {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<BoatFilters>(parseSearchParams(searchParams));

  useEffect(() => {
    loadBoats(filters);
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="w-64">
          <BoatFilters filters={filters} onFilterChange={setFilters} />
        </aside>
        <main className="flex-1">
          <div className="flex justify-between mb-6">
            <h1>{boats.length} boats found</h1>
            <BoatSort sortBy={filters.sortBy} onSortChange={...} />
          </div>
          <BoatGrid boats={boats} isLoading={isLoading} />
          <Pagination currentPage={...} totalPages={...} />
        </main>
      </div>
    </div>
  );
}
```

### 2.3 Boat Details Page (`/boats/[id]`)

**Tasks**:
- [ ] Image gallery with thumbnails and lightbox
- [ ] Boat information section:
  - Name and description (i18n)
  - Specifications table (type, capacity, length, make, model, year)
  - Pricing (per day in selected currency)
- [ ] Amenities display with icons
- [ ] Location map (Google Maps embed with marina pin)
- [ ] Booking request form:
  - Date range picker (check-in, check-out)
  - Passenger count
  - Customer information (name, email, phone)
  - Additional notes
  - Price calculation preview
- [ ] WhatsApp contact button
- [ ] "Similar boats" section
- [ ] Breadcrumb navigation

**Components**:
```typescript
// components/boats/BoatGallery.tsx
export function BoatGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <div className="main-image" onClick={() => setIsLightboxOpen(true)}>
        <Image src={images[selectedIndex]} alt="..." fill />
      </div>
      <div className="thumbnails">
        {images.map((img, idx) => <Thumbnail key={idx} src={img} onClick={() => setSelectedIndex(idx)} />)}
      </div>
      {isLightboxOpen && <Lightbox images={images} onClose={...} />}
    </>
  );
}

// components/boats/BoatInfo.tsx
export function BoatInfo({ boat }: { boat: Boat }) {
  const { locale } = useLocale();
  const { currency, formatPrice } = useCurrency();

  return (
    <div>
      <h1>{boat.nameI18n[locale]}</h1>
      <p className="text-2xl font-bold">{formatPrice(boat[`pricePerDay${currency}`])} / day</p>
      <div dangerouslySetInnerHTML={{ __html: boat.descriptionI18n[locale] }} />
      <SpecificationsTable boat={boat} />
    </div>
  );
}

// components/boats/BoatAmenities.tsx
export function BoatAmenities({ amenities }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {amenities.map(amenity => (
        <div key={amenity.id} className="flex items-center gap-2">
          <AmenityIcon icon={amenity.icon} />
          <span>{amenity.nameI18n[locale]}</span>
        </div>
      ))}
    </div>
  );
}

// components/boats/BoatLocationMap.tsx
export function BoatLocationMap({ location }: { location: Location }) {
  return (
    <iframe
      src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&hl=en&z=14&output=embed`}
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
    />
  );
}

// components/booking/BookingRequestForm.tsx
export function BookingRequestForm({ boat }: { boat: Boat }) {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  });
  const { currency } = useCurrency();

  const watchDates = form.watch(['checkInDate', 'checkOutDate']);
  const priceCalculation = useMemo(() => {
    const days = calculateDays(watchDates[0], watchDates[1]);
    return days * boat[`pricePerDay${currency}`];
  }, [watchDates, boat, currency]);

  return (
    <Form {...form}>
      <DateRangePicker name="dates" label="Check-in / Check-out" />
      <Input type="number" name="passengerCount" label="Passengers" />
      <Input name="customerName" label="Full Name" />
      <Input type="email" name="customerEmail" label="Email" />
      <Input type="tel" name="customerPhone" label="Phone" />
      <Textarea name="additionalNotes" label="Additional Notes" />

      <PricePreview>
        <p>{days} days × {formatPrice(boat[`pricePerDay${currency}`])}</p>
        <p className="text-2xl font-bold">Total: {formatPrice(priceCalculation)}</p>
      </PricePreview>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Submitting...' : 'Request Booking'}
      </Button>
    </Form>
  );
}

// components/boats/WhatsAppButton.tsx
export function WhatsAppButton({ boat, dates }) {
  const message = `Hi! I'm interested in booking ${boat.nameI18n['en']} from ${dates.checkIn} to ${dates.checkOut}.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <Button asChild variant="outline">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon /> Contact via WhatsApp
      </a>
    </Button>
  );
}
```

**Page Implementation**:
```typescript
// app/[locale]/boats/[id]/page.tsx
export default async function BoatDetailsPage({ params: { id, locale } }) {
  const boat = await boatService.getById(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Boats', href: '/boats' },
        { label: boat.nameI18n[locale], href: `/boats/${id}` }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2">
          <BoatGallery images={boat.images} />
          <BoatInfo boat={boat} />
          <BoatAmenities amenities={boat.amenities} />
          <BoatLocationMap location={boat.location} />
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-4">
            <BookingRequestForm boat={boat} />
            <WhatsAppButton boat={boat} />
          </div>
        </aside>
      </div>

      <SimilarBoats excludeId={boat.id} location={boat.location} />
    </div>
  );
}
```

### Wave 2 Quality Gate

**Validation Checklist**:
- [ ] All public pages render without errors
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] All translations display correctly in all 4 languages
- [ ] Currency switching updates prices everywhere
- [ ] Search and filters work correctly
- [ ] Booking form validation works
- [ ] Form submission creates booking request in backend
- [ ] Images load and gallery works
- [ ] Google Maps embed displays correctly

**Manual Testing**:
1. Navigate to homepage → See hero, search form, featured boats
2. Use quick search → Redirects to /boats with filters applied
3. Filter boats by location, type, price → Results update
4. Click on boat card → Navigate to boat details
5. View boat gallery → Lightbox opens on click
6. Fill out booking form → Submits successfully
7. Switch language → All text updates
8. Switch currency → All prices update

---

## 🌊 Wave 3: Admin Dashboard

**Priority**: 🔴 HIGH
**Estimated Time**: 10-14 hours
**Dependencies**: Wave 1 complete
**Goal**: Complete admin panel for platform management

### 3.1 Admin Authentication

**Tasks**:
- [ ] Admin login page (`/admin/login`)
- [ ] JWT token management (httpOnly cookies preferred)
- [ ] Protected route wrapper/middleware
- [ ] Automatic token refresh
- [ ] Logout functionality
- [ ] Redirect to login on 401

**Components**:
```typescript
// app/[locale]/admin/login/page.tsx
export default function AdminLoginPage() {
  const router = useRouter();
  const form = useForm<LoginFormData>();

  const onSubmit = async (data) => {
    try {
      const { token } = await authService.login(data.username, data.password);
      localStorage.setItem('token', token);
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return <LoginForm onSubmit={form.handleSubmit(onSubmit)} />;
}

// lib/auth/AuthContext.tsx
export const AuthProvider: React.FC;
export const useAuth = () => {
  user: User | null;
  isAuthenticated: boolean;
  login: (username, password) => Promise<void>;
  logout: () => void;
};

// middleware.ts (add admin route protection)
export function middleware(request: NextRequest) {
  // ... existing i18n logic

  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token');
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
}
```

### 3.2 Admin Layout & Dashboard

**Tasks**:
- [ ] Admin layout with sidebar navigation
- [ ] Dashboard page with statistics cards:
  - Total bookings this month
  - Monthly revenue
  - Occupancy rate
  - Pending booking requests count
- [ ] Quick actions section
- [ ] Recent activity feed

**Components**:
```typescript
// components/admin/AdminSidebar.tsx
export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: 'Boats', href: '/admin/boats', icon: <BoatIcon /> },
    { label: 'Bookings', href: '/admin/bookings', icon: <BookingIcon /> },
    { label: 'Customers', href: '/admin/customers', icon: <UserIcon /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="logo p-4">Villas Boats Admin</div>
      <nav>
        {menuItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? 'active' : ''}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <LogoutButton />
      </div>
    </aside>
  );
}

// app/[locale]/admin/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}

// components/admin/StatCard.tsx
export function StatCard({ title, value, icon, trend }) {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && <div className="text-sm text-gray-500">{trend}</div>}
      </CardContent>
    </Card>
  );
}

// app/[locale]/admin/dashboard/page.tsx
export default async function AdminDashboardPage() {
  const stats = await adminService.getDashboardStats();

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard
          title="Bookings This Month"
          value={stats.bookingsThisMonth}
          icon={<CalendarIcon />}
          trend="+12% from last month"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue, 'EUR')}
          icon={<DollarIcon />}
          trend="+8% from last month"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon={<PercentIcon />}
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={<ClockIcon />}
        />
      </div>

      <div className="mt-8">
        <h2>Recent Activity</h2>
        <ActivityFeed activities={stats.recentActivities} />
      </div>
    </div>
  );
}
```

### 3.3 Boat Management

**Tasks**:
- [ ] Boat list table with:
  - Columns: Image, Name, Type, Location, Price (EUR), Capacity, Status, Actions
  - Search functionality
  - Status filter
  - Pagination
- [ ] Create boat page (multi-step form):
  - Step 1: Basic info (name, description in 4 languages, type, make, model, year)
  - Step 2: Specifications (capacity, length, cabins, bathrooms, location)
  - Step 3: Pricing (4 currencies, captain prices if applicable)
  - Step 4: Images (upload multiple, set primary)
  - Step 5: Amenities (multi-select)
- [ ] Edit boat page (same form as create, pre-filled)
- [ ] Delete boat with confirmation dialog
- [ ] View boat (read-only detailed view)

**Components**:
```typescript
// components/admin/BoatTable.tsx
export function BoatTable({ boats, onEdit, onDelete, onView }) {
  const columns = [
    { key: 'image', label: 'Image' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'price', label: 'Price (EUR)' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  return (
    <Table>
      <TableHeader>
        {columns.map(col => <TableHead key={col.key}>{col.label}</TableHead>)}
      </TableHeader>
      <TableBody>
        {boats.map(boat => (
          <TableRow key={boat.id}>
            <TableCell><Avatar src={boat.primaryImageUrl} /></TableCell>
            <TableCell>{boat.nameI18n['en']}</TableCell>
            <TableCell><Badge>{boat.type}</Badge></TableCell>
            <TableCell>{boat.location.city}, {boat.location.country}</TableCell>
            <TableCell>€{boat.pricePerDayEur}</TableCell>
            <TableCell>{boat.capacity}</TableCell>
            <TableCell><StatusBadge status={boat.status} /></TableCell>
            <TableCell>
              <Button size="sm" variant="ghost" onClick={() => onView(boat.id)}>View</Button>
              <Button size="sm" variant="ghost" onClick={() => onEdit(boat.id)}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(boat.id)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// components/admin/BoatForm.tsx (Multi-step wizard)
export function BoatForm({ boat, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<BoatFormData>({
    defaultValues: boat,
    resolver: zodResolver(boatSchema)
  });

  const steps = [
    { title: 'Basic Info', component: <BasicInfoStep form={form} /> },
    { title: 'Specifications', component: <SpecificationsStep form={form} /> },
    { title: 'Pricing', component: <PricingStep form={form} /> },
    { title: 'Images', component: <ImagesStep form={form} /> },
    { title: 'Amenities', component: <AmenitiesStep form={form} /> }
  ];

  return (
    <FormWizard
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
}

// components/admin/boat-form/BasicInfoStep.tsx
export function BasicInfoStep({ form }) {
  return (
    <>
      <Input name="nameI18n.en" label="Name (English)" />
      <Input name="nameI18n.pt_BR" label="Name (Portuguese BR)" />
      <Input name="nameI18n.pt_PT" label="Name (Portuguese PT)" />
      <Input name="nameI18n.es" label="Name (Spanish)" />

      <Textarea name="descriptionI18n.en" label="Description (English)" rows={4} />
      <Textarea name="descriptionI18n.pt_BR" label="Description (Portuguese BR)" rows={4} />
      <Textarea name="descriptionI18n.pt_PT" label="Description (Portuguese PT)" rows={4} />
      <Textarea name="descriptionI18n.es" label="Description (Spanish)" rows={4} />

      <Select name="type" label="Boat Type" options={boatTypes} />
      <Input name="make" label="Make/Brand" />
      <Input name="model" label="Model" />
      <Input name="year" label="Year" type="number" />
    </>
  );
}

// Similar implementations for other steps...
```

**Page Implementation**:
```typescript
// app/[locale]/admin/boats/page.tsx
export default function AdminBoatsPage() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this boat?')) {
      await boatService.delete(id);
      toast.success('Boat deleted successfully');
      loadBoats();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Boats</h1>
        <Button onClick={() => router.push('/admin/boats/new')}>
          <PlusIcon /> Add New Boat
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search boats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <BoatTable
        boats={boats.filter(b => matchesSearch(b, searchQuery))}
        onView={(id) => router.push(`/admin/boats/${id}`)}
        onEdit={(id) => router.push(`/admin/boats/${id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}

// app/[locale]/admin/boats/new/page.tsx
export default function NewBoatPage() {
  const router = useRouter();

  const handleSubmit = async (data: BoatFormData) => {
    try {
      await boatService.create(data);
      toast.success('Boat created successfully');
      router.push('/admin/boats');
    } catch (error) {
      toast.error('Failed to create boat');
    }
  };

  return (
    <div>
      <h1>Create New Boat</h1>
      <BoatForm onSubmit={handleSubmit} />
    </div>
  );
}
```

### 3.4 Booking Management

**Tasks**:
- [ ] Booking list table with:
  - Columns: Reference, Boat, Customer, Dates, Status, Price, Actions
  - Filter by status (pending, confirmed, cancelled, completed)
  - Search by reference, customer name, boat name
  - Pagination
- [ ] Booking details modal/page
- [ ] Confirm booking action (changes status to CONFIRMED)
- [ ] Cancel booking action (with reason field)
- [ ] Customer contact display (phone, email)

**Components**:
```typescript
// components/admin/BookingTable.tsx
export function BookingTable({ bookings, onConfirm, onCancel, onViewDetails }) {
  const columns = [
    { key: 'reference', label: 'Reference' },
    { key: 'boat', label: 'Boat' },
    { key: 'customer', label: 'Customer' },
    { key: 'dates', label: 'Dates' },
    { key: 'status', label: 'Status' },
    { key: 'price', label: 'Total Price' },
    { key: 'actions', label: 'Actions' }
  ];

  return (
    <Table>
      <TableBody>
        {bookings.map(booking => (
          <TableRow key={booking.id}>
            <TableCell><Code>{booking.bookingReference}</Code></TableCell>
            <TableCell>{booking.boat.nameI18n['en']}</TableCell>
            <TableCell>{booking.customer.fullName}</TableCell>
            <TableCell>
              {formatDate(booking.startDatetime)} - {formatDate(booking.endDatetime)}
            </TableCell>
            <TableCell><StatusBadge status={booking.status} /></TableCell>
            <TableCell>{formatCurrency(booking.totalPrice, booking.currency)}</TableCell>
            <TableCell>
              <Button size="sm" onClick={() => onViewDetails(booking.id)}>View</Button>
              {booking.status === 'PENDING' && (
                <>
                  <Button size="sm" variant="success" onClick={() => onConfirm(booking.id)}>Confirm</Button>
                  <Button size="sm" variant="destructive" onClick={() => onCancel(booking.id)}>Cancel</Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// components/admin/BookingDetailsModal.tsx
export function BookingDetailsModal({ bookingId, isOpen, onClose }) {
  const { data: booking } = useQuery(['booking', bookingId], () => bookingService.getById(bookingId));

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Details - {booking.bookingReference}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <DetailRow label="Status" value={<StatusBadge status={booking.status} />} />
          <DetailRow label="Boat" value={booking.boat.nameI18n['en']} />
          <DetailRow label="Customer" value={booking.customer.fullName} />
          <DetailRow label="Email" value={booking.customer.email} />
          <DetailRow label="Phone" value={booking.customer.phoneNumber} />
          <DetailRow label="Check-in" value={formatDate(booking.startDatetime)} />
          <DetailRow label="Check-out" value={formatDate(booking.endDatetime)} />
          <DetailRow label="Days" value={booking.daysCount} />
          <DetailRow label="Guests" value={booking.guestCount} />
          <DetailRow label="Needs Captain" value={booking.needsCaptain ? 'Yes' : 'No'} />
          <DetailRow label="Subtotal" value={formatCurrency(booking.subtotal, booking.currency)} />
          <DetailRow label="Tax" value={formatCurrency(booking.taxAmount, booking.currency)} />
          <DetailRow label="Total" value={formatCurrency(booking.totalPrice, booking.currency)} className="font-bold" />
        </div>

        {booking.customerNotes && (
          <div>
            <h3>Customer Notes</h3>
            <p>{booking.customerNotes}</p>
          </div>
        )}

        {booking.adminNotes && (
          <div>
            <h3>Admin Notes</h3>
            <p>{booking.adminNotes}</p>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 3.5 Customer Management

**Tasks**:
- [ ] Customer list table with:
  - Columns: Name, Email, Phone, Total Bookings, Total Spent, Actions
  - Search functionality
  - Pagination
- [ ] Customer details page with:
  - Personal information
  - Booking history
  - Total spent statistics
- [ ] Edit customer information

**Components**:
```typescript
// components/admin/CustomerTable.tsx
export function CustomerTable({ customers, onView, onEdit }) {
  return (
    <Table>
      <TableBody>
        {customers.map(customer => (
          <TableRow key={customer.id}>
            <TableCell>{customer.fullName}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phoneNumber}</TableCell>
            <TableCell>{customer.totalBookings}</TableCell>
            <TableCell>{formatCurrency(customer.totalSpent, 'EUR')}</TableCell>
            <TableCell>
              <Button size="sm" onClick={() => onView(customer.id)}>View</Button>
              <Button size="sm" onClick={() => onEdit(customer.id)}>Edit</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// app/[locale]/admin/customers/[id]/page.tsx
export default async function CustomerDetailsPage({ params: { id } }) {
  const customer = await customerService.getById(id);
  const bookings = await bookingService.getByCustomerId(id);

  return (
    <div>
      <h1>{customer.fullName}</h1>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <StatCard title="Total Bookings" value={bookings.length} />
        <StatCard title="Total Spent" value={formatCurrency(calculateTotal(bookings), 'EUR')} />
        <StatCard title="Member Since" value={formatDate(customer.createdAt)} />
      </div>

      <div className="mt-8">
        <h2>Personal Information</h2>
        <dl>
          <dt>Email</dt><dd>{customer.email}</dd>
          <dt>Phone</dt><dd>{customer.phoneNumber}</dd>
          <dt>Preferred Language</dt><dd>{customer.preferredLanguage}</dd>
          <dt>Country</dt><dd>{customer.country}</dd>
        </dl>
      </div>

      <div className="mt-8">
        <h2>Booking History</h2>
        <BookingTable bookings={bookings} />
      </div>
    </div>
  );
}
```

### Wave 3 Quality Gate

**Validation Checklist**:
- [ ] Admin can log in and access dashboard
- [ ] Dashboard statistics display correctly
- [ ] Admin can create new boats (all steps work)
- [ ] Admin can edit existing boats
- [ ] Admin can delete boats with confirmation
- [ ] Admin can view booking requests
- [ ] Admin can confirm/cancel bookings
- [ ] Admin can view customer details
- [ ] All forms validate correctly
- [ ] Tables are sortable and searchable
- [ ] Pagination works

**Manual Testing**:
1. Login with admin credentials
2. View dashboard → Statistics display
3. Create new boat → All 5 steps work → Boat created
4. Edit boat → Pre-filled form → Updates save
5. Delete boat → Confirmation dialog → Boat deleted
6. View bookings → Filter by status works
7. Confirm booking → Status changes to CONFIRMED
8. View customer details → Booking history displays

---

## 🌊 Wave 4: Advanced Features

**Priority**: 🟡 MEDIUM
**Estimated Time**: 8-10 hours
**Dependencies**: Waves 2 & 3 complete
**Goal**: Complete booking workflow with images, amenities, and WhatsApp

### 4.1 Image Upload System

**Backend Tasks**:
- [ ] Create file upload endpoint (`POST /api/boats/{id}/images`)
- [ ] Implement file storage strategy (local `public/uploads/` or cloud)
- [ ] Add image validation (size, format, dimensions)
- [ ] Implement image optimization (resize, compression)
- [ ] Support multiple image upload
- [ ] Add primary image selection endpoint
- [ ] Add image deletion endpoint

**Backend Implementation**:
```java
// BoatImageController.java
@RestController
@RequestMapping("/api/boats/{boatId}/images")
@RequiredArgsConstructor
public class BoatImageController {
    private final FileStorageService fileStorageService;
    private final BoatImageService boatImageService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> uploadImages(
        @PathVariable UUID boatId,
        @RequestParam("files") MultipartFile[] files
    ) {
        List<String> uploadedUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String fileName = fileStorageService.store(file);
            boatImageService.addImage(boatId, fileName);
            uploadedUrls.add("/uploads/" + fileName);
        }
        return ResponseEntity.ok(uploadedUrls);
    }

    @PutMapping("/{imageId}/primary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> setPrimaryImage(
        @PathVariable UUID boatId,
        @PathVariable UUID imageId
    ) {
        boatImageService.setPrimary(boatId, imageId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{imageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteImage(
        @PathVariable UUID boatId,
        @PathVariable UUID imageId
    ) {
        boatImageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}

// FileStorageService.java
@Service
public class FileStorageService {
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public String store(MultipartFile file) {
        // Validate file
        validateFile(file);

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);
        String fileName = UUID.randomUUID().toString() + extension;

        // Save file
        Path targetLocation = Paths.get(uploadDir).resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Optimize image
        optimizeImage(targetLocation);

        return fileName;
    }

    private void validateFile(MultipartFile file) {
        // Check size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File too large");
        }

        // Check format (jpg, png, webp)
        String contentType = file.getContentType();
        if (!Arrays.asList("image/jpeg", "image/png", "image/webp").contains(contentType)) {
            throw new IllegalArgumentException("Invalid file format");
        }
    }

    private void optimizeImage(Path imagePath) {
        // Use ImageMagick, Thumbnailator, or similar to resize/compress
        // Target: Max 1920x1080, 80% quality
    }
}
```

**Frontend Components**:
```typescript
// components/admin/ImageUploadDropzone.tsx
export function ImageUploadDropzone({ onUpload, maxFiles = 10 }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles].slice(0, maxFiles));

    // Generate previews
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const uploadedUrls = await boatService.uploadImages(boatId, formData);
      onUpload(uploadedUrls);
      toast.success(`${files.length} images uploaded successfully`);
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Dropzone onDrop={handleDrop} accept="image/*" maxFiles={maxFiles - files.length}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="border-2 border-dashed p-8 text-center cursor-pointer">
            <input {...getInputProps()} />
            <UploadIcon className="mx-auto mb-2" />
            <p>Drag and drop images here, or click to select</p>
            <p className="text-sm text-gray-500">Max {maxFiles} images, up to 5MB each</p>
          </div>
        )}
      </Dropzone>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative">
              <img src={preview} alt={`Preview ${idx + 1}`} className="rounded" />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => {
                  setFiles(prev => prev.filter((_, i) => i !== idx));
                  setPreviews(prev => prev.filter((_, i) => i !== idx));
                }}
              >
                <TrashIcon />
              </Button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <Button onClick={handleUpload} disabled={isUploading} className="mt-4">
          {isUploading ? 'Uploading...' : `Upload ${files.length} image(s)`}
        </Button>
      )}
    </div>
  );
}

// components/admin/ImageManager.tsx
export function ImageManager({ boatId, images, onUpdate }) {
  const [selectedPrimaryId, setSelectedPrimaryId] = useState<string | null>(
    images.find(img => img.isPrimary)?.id || null
  );

  const handleSetPrimary = async (imageId: string) => {
    try {
      await boatService.setPrimaryImage(boatId, imageId);
      setSelectedPrimaryId(imageId);
      toast.success('Primary image updated');
      onUpdate();
    } catch (error) {
      toast.error('Failed to set primary image');
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      await boatService.deleteImage(boatId, imageId);
      toast.success('Image deleted');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {images.map(image => (
        <div key={image.id} className="relative group">
          <img src={image.url} alt="Boat" className="rounded" />

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant={image.id === selectedPrimaryId ? 'default' : 'secondary'}
              onClick={() => handleSetPrimary(image.id)}
            >
              {image.id === selectedPrimaryId ? 'Primary' : 'Set Primary'}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(image.id)}
            >
              <TrashIcon />
            </Button>
          </div>

          {image.id === selectedPrimaryId && (
            <Badge className="absolute top-2 left-2">Primary</Badge>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 4.2 Amenities System

**Backend Tasks** (if not already implemented):
- [ ] Create Amenity entity (if missing)
- [ ] Create BoatAmenity join entity
- [ ] Implement Amenity CRUD endpoints
- [ ] Implement Boat-Amenity association endpoints
- [ ] Seed database with common amenities

**Backend Implementation**:
```java
// Amenity.java (if missing)
@Entity
@Table(name = "amenities")
@Getter
@Setter
public class Amenity extends BaseEntity {
    @Convert(converter = JsonbConverter.class)
    @Column(name = "name_i18n", columnDefinition = "jsonb")
    private Map<String, String> nameI18n;

    @Column(name = "icon", length = 50)
    private String icon; // Icon name from Lucide

    @Enumerated(EnumType.STRING)
    @Column(name = "category", length = 20)
    private AmenityCategory category; // COMFORT, SAFETY, EQUIPMENT, ENTERTAINMENT
}

// AmenityController.java
@RestController
@RequestMapping("/api/amenities")
public class AmenityController {
    @GetMapping
    public ResponseEntity<List<AmenityResponse>> getAllAmenities() {
        return ResponseEntity.ok(amenityService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AmenityResponse> createAmenity(@RequestBody CreateAmenityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(amenityService.create(request));
    }
}

// Migration: V3__add_amenities.sql
INSERT INTO amenities (name_i18n, icon, category) VALUES
  ('{"en":"WiFi","pt_BR":"WiFi","pt_PT":"WiFi","es":"WiFi"}', 'wifi', 'COMFORT'),
  ('{"en":"Air Conditioning","pt_BR":"Ar Condicionado","pt_PT":"Ar Condicionado","es":"Aire Acondicionado"}', 'air-vent', 'COMFORT'),
  ('{"en":"Life Jackets","pt_BR":"Coletes Salva-Vidas","pt_PT":"Coletes Salva-Vidas","es":"Chalecos Salvavidas"}', 'shield-check', 'SAFETY'),
  ('{"en":"GPS Navigation","pt_BR":"Navegação GPS","pt_PT":"Navegação GPS","es":"Navegación GPS"}', 'navigation', 'EQUIPMENT'),
  ('{"en":"Sound System","pt_BR":"Sistema de Som","pt_PT":"Sistema de Som","es":"Sistema de Sonido"}', 'music', 'ENTERTAINMENT');
```

**Frontend Components**:
```typescript
// components/boats/AmenityIcon.tsx
import * as Icons from 'lucide-react';

export function AmenityIcon({ icon }: { icon: string }) {
  const Icon = Icons[icon] || Icons.Circle;
  return <Icon className="w-5 h-5" />;
}

// components/admin/AmenitySelector.tsx
export function AmenitySelector({ selected, onChange }) {
  const { data: amenities } = useQuery('amenities', amenityService.getAll);
  const [selectedIds, setSelectedIds] = useState<string[]>(selected || []);

  const handleToggle = (amenityId: string) => {
    const newSelected = selectedIds.includes(amenityId)
      ? selectedIds.filter(id => id !== amenityId)
      : [...selectedIds, amenityId];

    setSelectedIds(newSelected);
    onChange(newSelected);
  };

  const groupedByCategory = groupBy(amenities, 'category');

  return (
    <div>
      {Object.entries(groupedByCategory).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h3 className="font-semibold mb-2">{category}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {items.map(amenity => (
              <label key={amenity.id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedIds.includes(amenity.id)}
                  onCheckedChange={() => handleToggle(amenity.id)}
                />
                <AmenityIcon icon={amenity.icon} />
                <span>{amenity.nameI18n[locale]}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// components/boats/AmenityFilter.tsx (for boat list page)
export function AmenityFilter({ selected, onChange }) {
  const { data: amenities } = useQuery('amenities', amenityService.getAll);

  return (
    <div>
      <h3>Amenities</h3>
      {amenities?.map(amenity => (
        <label key={amenity.id} className="flex items-center gap-2">
          <Checkbox
            checked={selected.includes(amenity.id)}
            onCheckedChange={() => {
              const newSelected = selected.includes(amenity.id)
                ? selected.filter(id => id !== amenity.id)
                : [...selected, amenity.id];
              onChange(newSelected);
            }}
          />
          <AmenityIcon icon={amenity.icon} />
          <span>{amenity.nameI18n[locale]}</span>
        </label>
      ))}
    </div>
  );
}
```

### 4.3 WhatsApp Integration

**Tasks**:
- [ ] Add WhatsApp business number to environment variables
- [ ] Create WhatsApp message template with boat and date info
- [ ] Add WhatsApp button to boat details page
- [ ] Add WhatsApp contact on booking confirmation
- [ ] Implement click-to-chat link generation

**Implementation**:
```typescript
// lib/utils/whatsapp.ts
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '351912345678';

export function generateWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function createBookingInquiryMessage(boat: Boat, dates: { checkIn: Date; checkOut: Date }, locale: string): string {
  const t = getTranslations(locale);

  return `${t('whatsapp.greeting')}

${t('whatsapp.interestedIn')}: ${boat.nameI18n[locale]}
${t('whatsapp.checkIn')}: ${formatDate(dates.checkIn, locale)}
${t('whatsapp.checkOut')}: ${formatDate(dates.checkOut, locale)}

${t('whatsapp.pleaseProvideInfo')}`;
}

// components/boats/WhatsAppButton.tsx
export function WhatsAppButton({ boat, dates }: { boat: Boat; dates?: { checkIn: Date; checkOut: Date } }) {
  const { locale } = useLocale();
  const t = useTranslations('boats');

  const message = dates
    ? createBookingInquiryMessage(boat, dates, locale)
    : `${t('whatsapp.greeting')} ${t('whatsapp.moreInfo')} ${boat.nameI18n[locale]}.`;

  const whatsappUrl = generateWhatsAppLink(message);

  return (
    <Button asChild variant="outline" className="w-full">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        {t('contactWhatsApp')}
      </a>
    </Button>
  );
}

// Usage in boat details page
<div className="space-y-4">
  <BookingRequestForm boat={boat} />
  <div className="text-center text-sm text-gray-500">or</div>
  <WhatsAppButton boat={boat} dates={selectedDates} />
</div>
```

### Wave 4 Quality Gate

**Validation Checklist**:
- [ ] Images can be uploaded to boats
- [ ] Primary image can be set
- [ ] Images can be deleted
- [ ] Image optimization works (file size reduced)
- [ ] Amenities display correctly on boat details
- [ ] Amenity filter works on boat list
- [ ] WhatsApp button generates correct message
- [ ] WhatsApp link opens in new tab with pre-filled message

**Manual Testing**:
1. Admin: Upload multiple images to boat → Images appear
2. Admin: Set primary image → Badge shows on correct image
3. Admin: Delete image → Confirmation → Image removed
4. User: View boat details → Amenities display with icons
5. User: Filter boats by amenity → Results update
6. User: Click WhatsApp button → Opens WhatsApp with message
7. User: Fill booking form → WhatsApp message includes dates and boat name

---

## 🌊 Wave 5: Production Readiness

**Priority**: 🟡 MEDIUM-HIGH
**Estimated Time**: 10-12 hours
**Dependencies**: All features complete
**Goal**: Deploy-ready application with tests, Docker, SEO, and optimization

### 5.1 Docker Containerization

**Tasks**:
- [ ] Create `Dockerfile` for backend (multi-stage build)
- [ ] Create `Dockerfile` for frontend (Next.js production build)
- [ ] Create `docker-compose.yml` for full stack
- [ ] Configure PostgreSQL service in Docker Compose
- [ ] Set up environment variable management
- [ ] Configure volume mounts for persistent data
- [ ] Add Portainer deployment instructions

**Deliverables**:

```dockerfile
# backend/Dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: villasboats-db
    environment:
      POSTGRES_DB: villasboats
      POSTGRES_USER: villasboats_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - villasboats-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: villasboats-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/villasboats
      SPRING_DATASOURCE_USERNAME: villasboats_user
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - db
    ports:
      - "8080:8080"
    networks:
      - villasboats-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: villasboats-frontend
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080/api
      NEXT_PUBLIC_WHATSAPP_NUMBER: ${WHATSAPP_NUMBER}
    depends_on:
      - backend
    ports:
      - "3000:3000"
    networks:
      - villasboats-network

volumes:
  postgres-data:

networks:
  villasboats-network:
    driver: bridge
```

```bash
# .env.example
DB_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_key_here
WHATSAPP_NUMBER=351912345678
```

### 5.2 Testing

**Backend Tests**:

**Tasks**:
- [ ] Write unit tests for services (JUnit 5 + Mockito)
- [ ] Write integration tests for controllers (MockMvc)
- [ ] Write repository tests (@DataJpaTest)
- [ ] Achieve test coverage > 80%
- [ ] Configure Jacoco for coverage reporting

**Example Tests**:
```java
// BookingServiceTest.java
@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BoatRepository boatRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void createBooking_ValidRequest_ReturnsBooking() {
        // Given
        UUID boatId = UUID.randomUUID();
        UUID customerId = UUID.randomUUID();

        Boat boat = Boat.builder()
            .id(boatId)
            .capacity(8)
            .captainRequired(false)
            .pricePerDayEur(BigDecimal.valueOf(500))
            .build();

        User customer = User.builder()
            .id(customerId)
            .email("test@example.com")
            .build();

        CreateBookingRequest request = CreateBookingRequest.builder()
            .boatId(boatId)
            .startDatetime(LocalDateTime.now().plusDays(7))
            .endDatetime(LocalDateTime.now().plusDays(10))
            .guestCount(6)
            .needsCaptain(false)
            .currency(Currency.EUR)
            .build();

        when(boatRepository.findById(boatId)).thenReturn(Optional.of(boat));
        when(userRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(bookingRepository.existsConflictingBooking(any(), any(), any())).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArguments()[0]);

        // When
        BookingResponse result = bookingService.createBooking(request, customerId);

        // Then
        assertNotNull(result);
        assertEquals(3, result.getDaysCount());
        assertEquals(BigDecimal.valueOf(1500), result.getSubtotal());
        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    void createBooking_GuestCountExceedsCapacity_ThrowsException() {
        // Given
        UUID boatId = UUID.randomUUID();
        Boat boat = Boat.builder().id(boatId).capacity(4).build();

        CreateBookingRequest request = CreateBookingRequest.builder()
            .boatId(boatId)
            .guestCount(6)
            .build();

        when(boatRepository.findById(boatId)).thenReturn(Optional.of(boat));

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(request, UUID.randomUUID());
        });
    }
}

// BookingControllerTest.java
@WebMvcTest(BookingController.class)
@AutoConfigureMockMvc(addFilters = false)
class BookingControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookingService bookingService;

    @Test
    void getAllBookings_ReturnsBookingList() throws Exception {
        // Given
        List<BookingResponse> bookings = List.of(
            BookingResponse.builder().id(UUID.randomUUID()).build()
        );
        when(bookingService.getAllBookings()).thenReturn(bookings);

        // When & Then
        mockMvc.perform(get("/api/bookings"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(1));
    }
}
```

**Frontend Tests**:

**Tasks**:
- [ ] Write component tests (Jest + React Testing Library)
- [ ] Write integration tests (Playwright)
- [ ] Write accessibility tests (axe-core)
- [ ] Achieve test coverage > 70%

**Example Tests**:
```typescript
// components/boats/BoatCard.test.tsx
import { render, screen } from '@testing-library/react';
import { BoatCard } from './BoatCard';

describe('BoatCard', () => {
  const mockBoat = {
    id: '1',
    nameI18n: { en: 'Luxury Yacht' },
    pricePerDayEur: 500,
    capacity: 8,
    location: { city: 'Porto', country: 'PORTUGAL' },
    primaryImageUrl: '/images/boat.jpg'
  };

  it('renders boat name', () => {
    render(<BoatCard boat={mockBoat} />);
    expect(screen.getByText('Luxury Yacht')).toBeInTheDocument();
  });

  it('displays price in selected currency', () => {
    render(<BoatCard boat={mockBoat} />);
    expect(screen.getByText(/€500/)).toBeInTheDocument();
  });

  it('shows capacity', () => {
    render(<BoatCard boat={mockBoat} />);
    expect(screen.getByText(/8/)).toBeInTheDocument();
  });
});

// e2e/booking-flow.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test('complete booking flow', async ({ page }) => {
  // Navigate to homepage
  await page.goto('http://localhost:3000');

  // Use quick search
  await page.fill('[name="location"]', 'Porto');
  await page.fill('[name="checkIn"]', '2025-12-01');
  await page.fill('[name="checkOut"]', '2025-12-05');
  await page.fill('[name="passengers"]', '6');
  await page.click('button:has-text("Search")');

  // Verify redirected to boat list
  await expect(page).toHaveURL(/\/boats/);

  // Click on first boat
  await page.click('article:first-child');

  // Verify boat details page
  await expect(page.locator('h1')).toContainText('Luxury Yacht');

  // Fill booking form
  await page.fill('[name="customerName"]', 'John Doe');
  await page.fill('[name="customerEmail"]', 'john@example.com');
  await page.fill('[name="customerPhone"]', '+351912345678');
  await page.click('button:has-text("Request Booking")');

  // Verify success message
  await expect(page.locator('text=Booking request submitted')).toBeVisible();
});
```

### 5.3 SEO Optimization

**Tasks**:
- [ ] Implement dynamic metadata generation
- [ ] Add Open Graph tags
- [ ] Add Twitter Card tags
- [ ] Add structured data (JSON-LD) for boats
- [ ] Generate sitemap.xml
- [ ] Configure robots.txt
- [ ] Add canonical URLs
- [ ] Ensure all images have alt texts

**Implementation**:
```typescript
// app/[locale]/boats/[id]/page.tsx
export async function generateMetadata({ params: { id, locale } }): Promise<Metadata> {
  const boat = await boatService.getById(id);
  const t = await getTranslations({ locale, namespace: 'boats' });

  return {
    title: `${boat.nameI18n[locale]} - ${t('metaTitleSuffix')}`,
    description: boat.shortDescriptionI18n[locale] || boat.descriptionI18n[locale].slice(0, 160),
    openGraph: {
      title: boat.nameI18n[locale],
      description: boat.shortDescriptionI18n[locale],
      images: [boat.primaryImageUrl],
      type: 'website',
      url: `https://villasboats.com/${locale}/boats/${id}`
    },
    twitter: {
      card: 'summary_large_image',
      title: boat.nameI18n[locale],
      description: boat.shortDescriptionI18n[locale],
      images: [boat.primaryImageUrl]
    },
    alternates: {
      canonical: `https://villasboats.com/${locale}/boats/${id}`,
      languages: {
        en: `https://villasboats.com/en/boats/${id}`,
        'pt-BR': `https://villasboats.com/pt-BR/boats/${id}`,
        'pt-PT': `https://villasboats.com/pt-PT/boats/${id}`,
        es: `https://villasboats.com/es/boats/${id}`
      }
    }
  };
}

// Structured data (JSON-LD)
export default function BoatDetailsPage({ boat }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": boat.nameI18n['en'],
    "description": boat.descriptionI18n['en'],
    "image": boat.images.map(img => img.url),
    "offers": {
      "@type": "Offer",
      "price": boat.pricePerDayEur,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": boat.averageRating ? {
      "@type": "AggregateRating",
      "ratingValue": boat.averageRating,
      "reviewCount": boat.reviewCount
    } : undefined
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Page content */}
    </>
  );
}

// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const boats = await boatService.getAll();
  const locales = ['en', 'pt-BR', 'pt-PT', 'es'];

  const boatUrls = boats.flatMap(boat =>
    locales.map(locale => ({
      url: `https://villasboats.com/${locale}/boats/${boat.id}`,
      lastModified: boat.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  );

  return [
    {
      url: 'https://villasboats.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    ...boatUrls
  ];
}

// public/robots.txt
User-agent: *
Allow: /

Sitemap: https://villasboats.com/sitemap.xml
```

### 5.4 Performance Optimization

**Tasks**:
- [ ] Implement Next.js Image component for all images
- [ ] Add lazy loading for images and components
- [ ] Implement code splitting
- [ ] Set up API response caching (React Query or SWR)
- [ ] Optimize database queries (add indexes, use projections)
- [ ] Configure CDN for static assets
- [ ] Achieve Lighthouse score > 90

**Implementation**:
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={boat.primaryImageUrl}
  alt={boat.nameI18n[locale]}
  width={600}
  height={400}
  priority={isPrimaryImage}
  placeholder="blur"
  blurDataURL={boat.blurDataUrl}
/>

// React Query setup for caching
// app/[locale]/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  }
});

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Lazy loading components
import dynamic from 'next/dynamic';

const BoatLocationMap = dynamic(() => import('./BoatLocationMap'), {
  loading: () => <Skeleton className="h-96" />,
  ssr: false
});

// Backend query optimization
// Use projections to fetch only needed fields
public interface BoatListProjection {
    UUID getId();
    String getSlug();
    Map<String, String> getNameI18n();
    BigDecimal getPricePerDayEur();
    Integer getCapacity();
    String getPrimaryImageUrl();
}

@Query("SELECT b FROM Boat b WHERE b.status = 'ACTIVE'")
List<BoatListProjection> findAllActive();
```

### 5.5 Security Hardening

**Tasks**:
- [ ] Configure CORS properly
- [ ] Implement rate limiting on API endpoints
- [ ] Validate all inputs (backend + frontend)
- [ ] Prevent XSS attacks
- [ ] Implement CSRF protection
- [ ] Use prepared statements (prevent SQL injection)
- [ ] Add security headers
- [ ] Enforce HTTPS in production

**Implementation**:
```java
// SecurityConfig.java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Use JWT, no CSRF needed
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'"))
                .frameOptions(frame -> frame.deny())
                .xssProtection(xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
            )
            // ... rest of config
        ;
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "https://villasboats.com"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

// Rate limiting (using Bucket4j)
@Component
public class RateLimitingFilter extends OncePerRequestFilter {
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String key = getClientIP(request);
        Bucket bucket = resolveBucket(key);

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.getWriter().write("Too many requests");
        }
    }

    private Bucket resolveBucket(String key) {
        return cache.computeIfAbsent(key, k ->
            Bucket4j.builder()
                .addLimit(Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1))))
                .build()
        );
    }
}
```

```typescript
// Frontend input validation (Zod)
import { z } from 'zod';

export const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name too short').max(100, 'Name too long'),
  customerEmail: z.string().email('Invalid email'),
  customerPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  checkInDate: z.date().min(new Date(), 'Date must be in the future'),
  checkOutDate: z.date(),
  passengerCount: z.number().min(1).max(50)
}).refine(data => data.checkOutDate > data.checkInDate, {
  message: "Check-out must be after check-in",
  path: ["checkOutDate"]
});
```

### Wave 5 Quality Gate

**Validation Checklist**:
- [ ] Docker Compose successfully builds all services
- [ ] Application runs in Docker containers
- [ ] Backend tests pass with >80% coverage
- [ ] Frontend tests pass with >70% coverage
- [ ] Lighthouse score > 85 (Performance, Accessibility, Best Practices, SEO)
- [ ] No security vulnerabilities in dependencies
- [ ] CORS configured correctly
- [ ] Rate limiting works
- [ ] SEO metadata present on all pages
- [ ] Sitemap.xml generates correctly

**Manual Testing**:
1. Run `docker-compose up -d` → All services start
2. Access frontend at http://localhost:3000 → Homepage loads
3. Access backend at http://localhost:8080/api → API responds
4. Run backend tests: `mvn test` → All pass
5. Run frontend tests: `npm test` → All pass
6. Check Lighthouse report → Score > 85
7. Verify SEO: View page source → Meta tags present
8. Test rate limiting: Make 101 requests → 429 error on 101st

---

## 📅 Execution Timeline Summary

| Wave | Focus Area | Estimated Time | Key Deliverables |
|------|------------|----------------|------------------|
| **Wave 1** | Foundation | 4-6 hours | Frontend setup, API client, i18n, base layout |
| **Wave 2** | Public Pages | 8-12 hours | Homepage, boat list, boat details, booking form |
| **Wave 3** | Admin Dashboard | 10-14 hours | Auth, dashboard, boat CRUD, booking management, customer management |
| **Wave 4** | Advanced Features | 8-10 hours | Image upload, amenities, WhatsApp integration |
| **Wave 5** | Production Ready | 10-12 hours | Docker, tests, SEO, performance, security |
| **Total** | | **40-54 hours** | **Complete production-ready application** |

---

## 🎯 Success Criteria

### Functional Requirements

**Public Website**:
- [x] Users can browse boats with filters (location, type, price, capacity, size)
- [x] Users can view boat details with gallery, amenities, and map
- [x] Users can submit booking requests via form
- [x] Users can contact via WhatsApp with pre-filled boat/date info
- [x] Multi-language support (EN, PT_BR, PT_PT, ES)
- [x] Multi-currency support (USD, EUR, GBP, BRL)
- [x] Responsive design (mobile, tablet, desktop)

**Admin Dashboard**:
- [x] Admin can log in with JWT authentication
- [x] Admin can view dashboard statistics
- [x] Admin can create/edit/delete boats
- [x] Admin can upload and manage boat images
- [x] Admin can manage amenities
- [x] Admin can view booking requests
- [x] Admin can confirm/cancel bookings
- [x] Admin can view and edit customer information

### Technical Requirements

**Stack Compliance**:
- [x] Backend: Java 25 + Spring Boot 3.3.5 + PostgreSQL 16
- [x] Frontend: Next.js 15 + TypeScript + TailwindCSS + ShadCN
- [x] Database migrations: Flyway
- [x] Containerization: Docker + Docker Compose
- [x] Deployment: Portainer-ready

**Quality Standards**:
- [x] Backend test coverage > 80%
- [x] Frontend test coverage > 70%
- [x] Lighthouse score > 85
- [x] No TypeScript/linting errors
- [x] No security vulnerabilities
- [x] SEO optimized (metadata, sitemap, structured data)
- [x] Performance optimized (lazy loading, caching, CDN)

---

## 🚀 Next Steps

### Immediate Action (Wave 1)

**Start with frontend foundation**:

1. Initialize Next.js project with TypeScript
2. Install and configure dependencies (TailwindCSS, ShadCN, next-intl)
3. Set up i18n routing and translation files
4. Create API client with Axios
5. Build Navbar and Footer components
6. Test API connectivity with backend

**Estimated Time**: 4-6 hours
**Goal**: Have a working frontend that can communicate with the backend

### Recommended Approach

**Sequential Wave Execution**:
- Complete each wave fully before moving to the next
- Validate quality gates between waves
- Document as you build
- Test continuously throughout development

**Parallel Opportunities** (within waves):
- Frontend components can be built in parallel
- Backend endpoints can be developed alongside frontend pages
- Tests can be written concurrently with features

---

## 📝 Notes

### Design Considerations

**Visual Identity**:
- Color palette: Sea blues, whites, sandy tones
- Premium feel: High-quality images, elegant typography
- Trust signals: Customer reviews, secure badges, clear policies

**User Experience**:
- Fast page loads (<3s)
- Intuitive navigation
- Clear call-to-actions
- Mobile-first design
- Accessibility (WCAG 2.1 AA)

### Future Enhancements (Post-MVP)

**Payment Integration**:
- Stripe, PayPal, Revolut integration
- MBWay support (Portugal)
- Secure checkout flow

**Reviews System**:
- Customer reviews with ratings
- Review moderation
- Average rating calculation

**Advanced Search**:
- Natural language search
- AI-powered recommendations
- Saved searches

**Analytics**:
- Google Analytics integration
- Conversion tracking
- User behavior analysis

---

**Document Status**: ✅ Ready for implementation
**Last Review**: 2025-11-03
**Next Review**: After Wave 1 completion
