# Villas Boats - Quick Reference Guide

**For Developers** | **MVP 1-Week Sprint** | **Last Updated**: 2025-11-01

---

## 🎯 Project Overview

**What**: Premium boat rental platform for Portugal and Brazil
**Slogan**: "Sail towards your dreams"
**Stack**: Next.js + Java 25/Spring Boot + PostgreSQL
**Timeline**: 1 week to MVP
**Deploy**: Docker Compose + Portainer

---

## 🚀 Quick Start

### Prerequisites
- Java 25
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16
- Git

### First Time Setup

```bash
# Clone repository
git clone <repository-url>
cd barcos

# Backend setup
cd backend
cp .env.example .env        # Edit database credentials
mvn clean install
mvn spring-boot:run

# Frontend setup (in new terminal)
cd ../frontend
cp .env.local.example .env.local   # Edit API URLs and keys
npm install
npm run dev

# Docker setup (alternative)
docker-compose up -d
```

**Access Points**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/v1
- PostgreSQL: localhost:5432
- Admin Login: http://localhost:3000/admin/login

**Default Admin Credentials** (Seeded in Flyway):
- Username: `admin`
- Password: `admin123` (change in production!)

---

## 📂 Project Structure Cheat Sheet

```
barcos/
├── backend/           → Java/Spring Boot API
│   ├── src/main/java/com/villasboats/
│   │   ├── controller/    → REST endpoints
│   │   ├── service/       → Business logic
│   │   ├── repository/    → Database access
│   │   ├── entity/        → JPA entities
│   │   ├── dto/           → Data Transfer Objects
│   │   ├── mapper/        → MapStruct mappers
│   │   └── config/        → Configuration classes
│   ├── src/main/resources/
│   │   ├── db/migration/  → Flyway SQL scripts
│   │   └── application.yml
│   └── pom.xml
│
├── frontend/          → Next.js React app
│   ├── src/
│   │   ├── app/           → Pages (App Router)
│   │   ├── components/    → React components
│   │   ├── lib/           → Utils, API clients, hooks
│   │   └── messages/      → I18N translations
│   ├── public/
│   │   └── uploads/       → User-uploaded images
│   └── package.json
│
├── docker-compose.yml
└── prompts/           → Project documentation
    ├── detailed.md
    ├── mvp-specification.md
    ├── development-workflow.md
    └── quick-reference.md (this file)
```

---

## 🗄️ Database Quick Reference

### Key Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **boat** | Boat listings | id, name_*, price_*, location_id, capacity, boat_type |
| **location** | Supported regions | id, name_*, country, city, slug |
| **amenity** | Boat amenities | id, name_*, icon, category |
| **boat_amenity** | Boat-Amenity M:N | boat_id, amenity_id |
| **boat_image** | Boat photos | id, boat_id, file_path, is_primary |
| **customer** | Customers | id, name, email, phone |
| **booking_request** | Booking requests | id, customer_id, boat_id, dates, status |
| **admin_user** | Admin users | id, username, password_hash, role |

### Enums

**boat_type**: SAILBOAT, MOTORBOAT, CATAMARAN, YACHT, JETSKI, FISHING_BOAT
**rental_type**: BAREBOAT, SKIPPERED, CREWED, DAY_TRIP, MULTI_DAY
**booking_status**: PENDING, CONFIRMED, CANCELLED, COMPLETED
**country**: PORTUGAL, BRAZIL
**currency**: USD, EUR, GBP, BRL

### Useful SQL Queries

```sql
-- Get all boats in Porto
SELECT b.*, l.city FROM boat b
JOIN location l ON b.location_id = l.id
WHERE l.slug = 'porto' AND b.status = 'ACTIVE';

-- Get pending booking requests
SELECT br.*, c.name as customer_name, b.name_en as boat_name
FROM booking_request br
JOIN customer c ON br.customer_id = c.id
JOIN boat b ON br.boat_id = b.id
WHERE br.status = 'PENDING'
ORDER BY br.created_at DESC;

-- Get boat with amenities
SELECT b.name_en, a.name_en as amenity
FROM boat b
JOIN boat_amenity ba ON b.id = ba.boat_id
JOIN amenity a ON ba.amenity_id = a.id
WHERE b.id = 1;
```

---

## 🔌 API Endpoints Cheat Sheet

**Base URL**: `/api/v1`

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/locations` | List all locations | ❌ |
| GET | `/amenities` | List all amenities | ❌ |
| GET | `/boats` | Search/filter boats | ❌ |
| GET | `/boats/{id}` | Boat details | ❌ |
| POST | `/booking-requests` | Create booking request | ❌ |

### Admin Endpoints (Require JWT Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/auth/login` | Admin login |
| GET | `/admin/boats` | List boats (admin view) |
| POST | `/admin/boats` | Create boat |
| PUT | `/admin/boats/{id}` | Update boat |
| DELETE | `/admin/boats/{id}` | Delete boat |
| POST | `/admin/boats/{id}/images` | Upload boat images |
| GET | `/admin/customers` | List customers |
| PUT | `/admin/customers/{id}` | Update customer |
| GET | `/admin/booking-requests` | List booking requests |
| PUT | `/admin/booking-requests/{id}/confirm` | Confirm booking |
| PUT | `/admin/booking-requests/{id}/cancel` | Cancel booking |

### Example API Calls

**Search boats**:
```bash
curl "http://localhost:8080/api/v1/boats?locationId=1&currency=EUR&page=0&size=20"
```

**Get boat details**:
```bash
curl "http://localhost:8080/api/v1/boats/1?lang=EN&currency=EUR"
```

**Create booking request**:
```bash
curl -X POST http://localhost:8080/api/v1/booking-requests \
  -H "Content-Type: application/json" \
  -d '{
    "boatId": 1,
    "customerName": "João Silva",
    "customerEmail": "joao@example.com",
    "customerPhone": "+351912345678",
    "checkInDate": "2025-07-15",
    "checkOutDate": "2025-07-18",
    "numPassengers": 6,
    "priceCurrency": "EUR",
    "additionalInfo": "Need fishing equipment"
  }'
```

**Admin login**:
```bash
curl -X POST http://localhost:8080/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

**Create boat (admin)**:
```bash
curl -X POST http://localhost:8080/api/v1/admin/boats \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "name_en=Luxury Yacht" \
  -F "name_pt_br=Iate de Luxo" \
  -F "name_pt_pt=Iate de Luxo" \
  -F "name_es=Yate de Lujo" \
  -F "brand=Beneteau" \
  -F "boatType=SAILBOAT" \
  -F "capacity=8" \
  -F "priceEur=850" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

---

## 🎨 Frontend Component Map

### Public Pages
```
/                       → Homepage (HeroSection, QuickSearchForm)
/boats                  → Boat List (BoatCard, BoatFilters)
/boats/[id]             → Boat Details (BoatGallery, BookingForm, BoatLocationMap)
```

### Admin Pages (Protected)
```
/admin/login            → Admin Login
/admin/dashboard        → Dashboard Home
/admin/boats            → Boat List (BoatTable)
/admin/boats/new        → Create Boat (BoatForm)
/admin/boats/[id]/edit  → Edit Boat (BoatForm)
/admin/customers        → Customer List (CustomerTable)
/admin/customers/[id]   → Customer Details
/admin/bookings         → Booking List (BookingTable)
/admin/bookings/[id]    → Booking Details
```

### Key Components

**Layout**:
- `Navbar` - Main navigation with language/currency selector
- `Footer` - Footer with links and contact info
- `AdminSidebar` - Admin navigation sidebar

**Home**:
- `HeroSection` - Hero banner with slogan
- `QuickSearchForm` - Location + dates + passengers search

**Boats**:
- `BoatCard` - Boat card for list view
- `BoatFilters` - Filter sidebar (location, type, price, etc.)
- `BoatGallery` - Image gallery with thumbnails
- `BoatAmenities` - Amenities display with icons
- `BoatLocationMap` - Google Maps embed
- `BookingForm` - Booking request form

**Admin**:
- `BoatForm` - Create/edit boat form (multi-step)
- `BoatImageUpload` - Image upload with drag-and-drop
- `BoatTable` - Boat list table with actions
- `CustomerTable` - Customer list table
- `BookingTable` - Booking request list table

---

## 🌍 I18N & Multi-Currency

### Supported Languages

| Code | Language |
|------|----------|
| EN | English |
| PT_BR | Brazilian Portuguese |
| PT_PT | European Portuguese |
| ES | Spanish |

### Supported Currencies

| Code | Symbol | Name |
|------|--------|------|
| USD | $ | US Dollar |
| EUR | € | Euro |
| GBP | £ | British Pound |
| BRL | R$ | Brazilian Real |

### Using Translations (Frontend)

```tsx
// In a component
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('home');

  return (
    <h1>{t('slogan')}</h1>  // "Sail towards your dreams"
  );
}
```

### Translation Files

```
messages/
├── en.json        → English translations
├── pt-BR.json     → Brazilian Portuguese
├── pt-PT.json     → European Portuguese
└── es.json        → Spanish
```

### Using Currency (Frontend)

```tsx
import { useCurrency } from '@/lib/hooks/useCurrency';

export function BoatCard({ boat }) {
  const { currency, formatPrice } = useCurrency();

  return (
    <div>
      <p>{formatPrice(boat.price[currency.toLowerCase()])}</p>
    </div>
  );
}
```

---

## 🧪 Testing Commands

### Backend

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=BoatServiceTest

# Run tests with coverage
mvn clean verify

# Generate coverage report
mvn jacoco:report
# View: target/site/jacoco/index.html

# Run linting
mvn checkstyle:check

# Fix formatting (if configured)
mvn fmt:format
```

### Frontend

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Build for production
npm run build

# Start production server
npm start
```

---

## 🐳 Docker Commands

### Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f         # All services
docker-compose logs -f backend  # Backend only
docker-compose logs -f frontend # Frontend only

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# Rebuild after code changes
docker-compose up -d --build

# Execute command in container
docker exec -it villasboats-backend bash
docker exec -it villasboats-db psql -U villasboats_user -d villasboats

# View running containers
docker ps

# Remove all containers and volumes (⚠️ DESTRUCTIVE)
docker-compose down -v
```

### Database Management

```bash
# Access PostgreSQL CLI
docker exec -it villasboats-db psql -U villasboats_user -d villasboats

# Backup database
docker exec villasboats-db pg_dump -U villasboats_user villasboats > backup.sql

# Restore database
cat backup.sql | docker exec -i villasboats-db psql -U villasboats_user -d villasboats

# View Flyway migration history
docker exec villasboats-db psql -U villasboats_user -d villasboats -c "SELECT * FROM flyway_schema_history;"
```

---

## 🔧 Common Tasks

### Add a New Location

1. **Database** (Flyway migration):
```sql
-- db/migration/V2__add_new_location.sql
INSERT INTO location (name_en, name_pt_br, name_pt_pt, name_es, country, city, region, slug, is_active)
VALUES ('Faro', 'Faro', 'Faro', 'Faro', 'PORTUGAL', 'Faro', 'Algarve', 'faro', true);
```

2. **Run migration**:
```bash
mvn flyway:migrate  # or restart Spring Boot app
```

### Add a New Amenity

1. **Database** (Flyway migration):
```sql
-- db/migration/V3__add_new_amenity.sql
INSERT INTO amenity (name_en, name_pt_br, name_pt_pt, name_es, icon, category)
VALUES ('Wi-Fi', 'Wi-Fi', 'Wi-Fi', 'Wi-Fi', 'wifi', 'COMFORT');
```

2. **Frontend** (Update icon mapping if needed):
```tsx
// lib/utils/icons.ts
export const amenityIcons = {
  wifi: <Wifi className="w-5 h-5" />,
  // ... other icons
};
```

### Add a New Translation

1. **Update translation files**:
```json
// messages/en.json
{
  "boats": {
    "newFilter": "New Filter Label"
  }
}

// messages/pt-BR.json
{
  "boats": {
    "newFilter": "Novo Rótulo de Filtro"
  }
}
```

2. **Use in component**:
```tsx
const t = useTranslations('boats');
<label>{t('newFilter')}</label>
```

### Change Admin Password

1. **Generate password hash**:
```java
// In AdminUserService or a utility class
String newPasswordHash = passwordEncoder.encode("newPassword123");
System.out.println(newPasswordHash);
```

2. **Update database**:
```sql
UPDATE admin_user
SET password_hash = '$2a$12$...'  -- Use generated hash
WHERE username = 'admin';
```

---

## 🐛 Debugging Tips

### Backend Debugging

**Enable SQL logging** (application-dev.yml):
```yaml
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true

logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

**Common Issues**:

1. **N+1 Query Problem**:
   - Use `@EntityGraph` or `JOIN FETCH` in queries
   - Monitor SQL logs for excessive queries

2. **Transaction Issues**:
   - Ensure `@Transactional` on service methods
   - Check propagation levels

3. **Jackson Serialization Errors**:
   - Use DTOs instead of entities
   - Add `@JsonIgnore` on cyclic references

### Frontend Debugging

**Enable verbose logging**:
```tsx
// lib/api/client.ts
axios.interceptors.request.use(config => {
  console.log('API Request:', config.method, config.url, config.params);
  return config;
});

axios.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);
```

**Common Issues**:

1. **Hydration Errors (Next.js)**:
   - Ensure server and client render the same HTML
   - Use `useEffect` for client-only code
   - Check for random values (e.g., `Math.random()`) in render

2. **I18N Not Working**:
   - Verify middleware.ts is configured
   - Check locale in URL path
   - Ensure translation keys exist

3. **Image Optimization Errors**:
   - Add external domains to next.config.js
   - Use correct paths (public/ or imports)

---

## 📚 Resources & References

### Documentation
- [Spring Boot Docs](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [ShadCN UI](https://ui.shadcn.com/)
- [next-intl](https://next-intl-docs.vercel.app/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [DBeaver](https://dbeaver.io/) - Database GUI
- [Figma](https://www.figma.com/) - Design mockups

### Learning Resources
- [Spring Boot Tutorial](https://www.baeldung.com/spring-boot)
- [Next.js Learn](https://nextjs.org/learn)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## 🎯 Quick Checklist (Before PR)

- [ ] Code passes linting (no errors)
- [ ] All tests passing
- [ ] No console errors in browser
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Translations added for all new UI strings
- [ ] API endpoints documented (if new)
- [ ] Database migrations tested
- [ ] No hardcoded values (use env variables)
- [ ] Git commit messages follow convention
- [ ] PR description clear and complete

---

## 📞 Need Help?

**Common Questions**:
1. **"Tests are failing"** → Check database is running, migrations applied
2. **"API returns 401"** → Verify JWT token in Authorization header
3. **"Images not displaying"** → Check file paths, uploads directory permissions
4. **"Translation missing"** → Add key to all 4 language files (en, pt-BR, pt-PT, es)
5. **"Docker build fails"** → Clear cache: `docker-compose build --no-cache`

**Project Documentation**:
- Full specification: `prompts/mvp-specification.md`
- Development workflow: `prompts/development-workflow.md`
- Original requirements: `prompts/detailed.md`

---

**Happy Coding!** 🚢⛵🌊
