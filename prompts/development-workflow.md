# Villas Boats - Development Workflow & Best Practices

## 🔄 Git Workflow Strategy

### Branch Structure

```
master (production-ready)
  ├── develop (integration branch)
  │   ├── feature/homepage-hero-section
  │   ├── feature/boat-search-api
  │   ├── feature/admin-dashboard
  │   └── feature/booking-whatsapp-integration
  └── hotfix/critical-bug-name (emergency fixes)
```

### Branch Naming Conventions

- **Feature branches**: `feature/descriptive-name`
  - Example: `feature/boat-listing-filters`
- **Bugfix branches**: `bugfix/issue-description`
  - Example: `bugfix/currency-conversion-error`
- **Hotfix branches**: `hotfix/critical-issue`
  - Example: `hotfix/payment-processing-failure`
- **Release branches**: `release/v1.0.0`

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

**Examples**:
```
feat(api): add boat search endpoint with filtering

- Implemented search by location, dates, boat type
- Added pagination support
- Integrated with service layer

Closes #12

---

fix(booking): correct WhatsApp message template encoding

The special characters were not properly URL-encoded, causing
broken links. Added encodeURIComponent for all dynamic fields.

Fixes #23

---

docs(readme): add Docker deployment instructions
```

### Development Workflow (Feature Development)

1. **Create feature branch from develop**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/boat-listing-filters
   ```

2. **Develop with frequent commits**:
   ```bash
   # Make changes
   git add .
   git commit -m "feat(filters): add boat type filter component"

   # More changes
   git commit -m "feat(filters): add price range slider"
   ```

3. **Keep branch updated with develop**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/boat-listing-filters
   git rebase develop
   # Resolve conflicts if any
   ```

4. **Run tests and linting before pushing**:
   ```bash
   # Backend
   cd backend
   mvn clean test
   mvn checkstyle:check

   # Frontend
   cd ../frontend
   npm run lint
   npm run test
   npm run build  # Ensure production build works
   ```

5. **Push feature branch**:
   ```bash
   git push origin feature/boat-listing-filters
   ```

6. **Create Pull Request** (via GitHub/GitLab):
   - Title: Clear description of feature
   - Description: What changed, why, testing performed
   - Link to related issue/ticket
   - Request review from team members

7. **After approval, merge to develop**:
   - Use "Squash and merge" for clean history
   - Delete feature branch after merge

8. **Deploy to staging** (from develop branch):
   ```bash
   git checkout develop
   git pull origin develop
   # Deploy to staging environment
   ```

9. **When ready for production**:
   ```bash
   git checkout master
   git merge develop
   git tag -a v1.0.0 -m "Release v1.0.0 - MVP"
   git push origin master --tags
   # Deploy to production
   ```

---

## 🏗️ Daily Development Routine (1-Week Sprint)

### Morning Routine (15 min)
1. **Pull latest changes**:
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Review task list** (from TodoWrite or project board)
3. **Check blockers** (dependencies, waiting on decisions)
4. **Plan today's work** (2-3 tasks max)

### During Development
1. **Follow TDD approach** (where applicable):
   - Write failing test
   - Implement minimal code to pass
   - Refactor
   - Commit

2. **Commit frequently** (every 30-60 min or logical checkpoint):
   ```bash
   git add -p  # Review changes interactively
   git commit -m "feat(component): descriptive message"
   ```

3. **Run tests before committing**:
   ```bash
   # Backend
   mvn test

   # Frontend
   npm run test
   ```

### End of Day (10 min)
1. **Push work to remote**:
   ```bash
   git push origin <current-branch>
   ```

2. **Update task tracker** (mark completed, note blockers)
3. **Document decisions** (update ADR if architecture changed)
4. **Plan tomorrow's tasks**

---

## 🧪 Testing Strategy

### Backend Testing

**Unit Tests** (JUnit 5 + Mockito):
```java
// Service layer tests
@ExtendWith(MockitoExtension.class)
class BoatServiceTest {

    @Mock
    private BoatRepository boatRepository;

    @InjectMocks
    private BoatService boatService;

    @Test
    void shouldReturnBoatsWhenSearchWithFilters() {
        // Given
        BoatSearchRequest request = new BoatSearchRequest();
        request.setLocationId(1L);

        // When
        Page<BoatDTO> results = boatService.searchBoats(request, PageRequest.of(0, 20));

        // Then
        assertThat(results).isNotEmpty();
        assertThat(results.getContent()).hasSize(5);
    }
}
```

**Repository Tests** (@DataJpaTest):
```java
@DataJpaTest
class BoatRepositoryTest {

    @Autowired
    private BoatRepository boatRepository;

    @Test
    void shouldFindBoatsByLocationId() {
        List<Boat> boats = boatRepository.findByLocationId(1L);
        assertThat(boats).hasSize(3);
    }
}
```

**Integration Tests** (@SpringBootTest):
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class BoatControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnBoatList() throws Exception {
        mockMvc.perform(get("/api/v1/boats"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.content").isArray());
    }
}
```

**Run tests**:
```bash
mvn test                    # All tests
mvn test -Dtest=BoatService # Specific test class
mvn verify                  # Tests + integration tests
mvn jacoco:report           # Generate coverage report
```

### Frontend Testing

**Component Tests** (Jest + React Testing Library):
```tsx
// components/boats/__tests__/BoatCard.test.tsx
import { render, screen } from '@testing-library/react';
import { BoatCard } from '../BoatCard';

describe('BoatCard', () => {
  const mockBoat = {
    id: 1,
    name: 'Luxury Yacht',
    price: { amount: 850, currency: 'EUR' },
    location: { name: 'Porto' },
    capacity: 8,
    boatType: 'SAILBOAT'
  };

  it('should display boat name and price', () => {
    render(<BoatCard boat={mockBoat} />);

    expect(screen.getByText('Luxury Yacht')).toBeInTheDocument();
    expect(screen.getByText('€850')).toBeInTheDocument();
  });

  it('should link to boat details page', () => {
    render(<BoatCard boat={mockBoat} />);

    const link = screen.getByRole('link', { name: /view details/i });
    expect(link).toHaveAttribute('href', '/boats/1');
  });
});
```

**Run tests**:
```bash
npm run test              # All tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### End-to-End Testing (Optional for MVP)

Using Playwright or Cypress:
```typescript
// e2e/booking-flow.spec.ts
test('user can search and book a boat', async ({ page }) => {
  // Navigate to homepage
  await page.goto('/');

  // Fill quick search form
  await page.selectOption('[name="location"]', '1');
  await page.fill('[name="checkIn"]', '2025-07-15');
  await page.fill('[name="checkOut"]', '2025-07-18');
  await page.fill('[name="passengers"]', '6');
  await page.click('button:has-text("Search Boats")');

  // Verify results page
  await expect(page).toHaveURL(/\/boats\?/);

  // Click first boat
  await page.click('.boat-card:first-child a');

  // Fill booking form
  await page.fill('[name="name"]', 'João Silva');
  await page.fill('[name="email"]', 'joao@example.com');
  await page.fill('[name="phone"]', '+351912345678');

  // Submit booking
  await page.click('button:has-text("Request Booking")');

  // Verify WhatsApp redirect
  await expect(page).toHaveURL(/wa\.me/);
});
```

---

## 🔍 Code Review Checklist

### General
- [ ] Code follows project coding standards (ESLint, Checkstyle)
- [ ] No commented-out code or debug logs
- [ ] Variable/function names are descriptive
- [ ] Complex logic has comments explaining "why"
- [ ] No hardcoded values (use environment variables or constants)

### Backend (Java/Spring Boot)
- [ ] DTOs used for API requests/responses (not entities)
- [ ] Input validation with `@Valid` and custom validators
- [ ] Proper exception handling with custom exceptions
- [ ] Database queries are optimized (no N+1 queries)
- [ ] Transactional boundaries are correct (`@Transactional`)
- [ ] Sensitive data is not logged (passwords, tokens)
- [ ] Unit tests cover happy path and edge cases
- [ ] Integration tests verify API contracts

### Frontend (Next.js/React)
- [ ] Components follow single responsibility principle
- [ ] Props are typed with TypeScript interfaces
- [ ] Forms use react-hook-form + zod validation
- [ ] API calls use proper error handling
- [ ] Loading and error states are handled
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Accessibility: keyboard navigation, ARIA labels, semantic HTML
- [ ] Images use Next.js `<Image>` component with alt text
- [ ] No inline styles (use TailwindCSS classes)
- [ ] Translations use next-intl (no hardcoded text)

### Security
- [ ] No SQL injection vulnerabilities (use parameterized queries)
- [ ] XSS prevention (escape user input, use CSP headers)
- [ ] CSRF protection enabled (Spring Security default)
- [ ] Sensitive routes require authentication
- [ ] File uploads validate type and size
- [ ] No secrets in code (use environment variables)

### Performance
- [ ] Database queries have proper indexes
- [ ] API responses are paginated (where applicable)
- [ ] Images are optimized (compressed, correct format)
- [ ] Frontend code is split (lazy loading for routes)
- [ ] No unnecessary re-renders (use React.memo, useMemo, useCallback)

---

## 📦 Docker & Deployment

### Local Development with Docker Compose

**Directory Structure**:
```
barcos/
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── docker-compose.yml
├── docker-compose.dev.yml
└── .env.example
```

**docker-compose.yml** (Development):
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: villasboats-db
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - villasboats-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: villasboats-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB}
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      WHATSAPP_BUSINESS_NUMBER: ${WHATSAPP_BUSINESS_NUMBER}
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    networks:
      - villasboats-network
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: villasboats-frontend
    environment:
      NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL}
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: ${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      NEXT_PUBLIC_WHATSAPP_NUMBER: ${NEXT_PUBLIC_WHATSAPP_NUMBER}
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - villasboats-network

volumes:
  postgres_data:

networks:
  villasboats-network:
    driver: bridge
```

**Backend Dockerfile** (Multi-stage):
```dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN mkdir -p /app/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Frontend Dockerfile**:
```dockerfile
FROM node:20-alpine AS base

# Stage 1: Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runtime
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

**Commands**:
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Access database
docker exec -it villasboats-db psql -U villasboats_user -d villasboats
```

### Production Deployment (Portainer)

1. **Push images to registry** (Docker Hub or private registry):
   ```bash
   docker build -t villasboats/backend:v1.0.0 ./backend
   docker build -t villasboats/frontend:v1.0.0 ./frontend
   docker push villasboats/backend:v1.0.0
   docker push villasboats/frontend:v1.0.0
   ```

2. **Create Stack in Portainer**:
   - Go to Portainer → Stacks → Add Stack
   - Name: `villasboats-production`
   - Upload `docker-compose.yml` (production version with image references)
   - Set environment variables in Portainer UI
   - Deploy

3. **Environment Variables in Portainer**:
   - `POSTGRES_DB=villasboats_prod`
   - `POSTGRES_USER=villasboats_user`
   - `POSTGRES_PASSWORD=<strong-password>`
   - `JWT_SECRET=<256-bit-secret>`
   - `WHATSAPP_BUSINESS_NUMBER=+351912345678`
   - `NEXT_PUBLIC_API_BASE_URL=https://api.villasboats.com/api/v1`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<api-key>`

4. **Health Checks**:
   - Backend: `http://localhost:8080/actuator/health`
   - Frontend: `http://localhost:3000/api/health`

5. **Backup Strategy**:
   ```bash
   # Backup PostgreSQL database
   docker exec villasboats-db pg_dump -U villasboats_user villasboats > backup_$(date +%Y%m%d).sql

   # Backup uploads directory
   tar -czf uploads_backup_$(date +%Y%m%d).tar.gz ./backend/uploads
   ```

---

## 🛠️ Development Tools Setup

### Backend (IntelliJ IDEA / VS Code)

**IntelliJ IDEA Plugins**:
- Lombok Plugin
- MapStruct Support
- SonarLint
- Checkstyle-IDEA

**VS Code Extensions** (if using VS Code):
- Extension Pack for Java
- Spring Boot Extension Pack
- Checkstyle for Java

**application-dev.yml** (for local development):
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/villasboats
    username: villasboats_user
    password: devpassword
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: validate
  flyway:
    enabled: true

logging:
  level:
    com.villasboats: DEBUG
    org.springframework.web: DEBUG

jwt:
  secret: dev-secret-key-min-256-bits-long
  expiration: 86400000
```

### Frontend (VS Code)

**VS Code Extensions**:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar) - for better TS support in Next.js
- Auto Rename Tag
- GitLens

**Settings** (.vscode/settings.json):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

**npm scripts** (package.json):
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 📊 Progress Tracking

### Daily Standup Questions
1. **What did I complete yesterday?**
2. **What will I work on today?**
3. **Any blockers or dependencies?**

### Task Tracking (Example for Day 3)

| Task | Status | Time Spent | Blockers |
|------|--------|------------|----------|
| Create BoatCard component | ✅ Completed | 1h | - |
| Implement BoatFilters sidebar | 🔄 In Progress | 2h | Need amenities API |
| Boat list pagination | ⏳ Pending | - | - |
| Google Maps integration | ⏳ Pending | - | API key needed |

### Weekly Retrospective (End of Week)

**What went well?**
- Backend API development was smooth
- Database schema well-designed
- Team collaboration effective

**What could be improved?**
- Better estimate time for frontend components
- Need clearer I18N translation process
- Docker setup took longer than expected

**Action items for next sprint:**
- Create component library documentation
- Set up automated deployment pipeline
- Improve test coverage to 80%

---

## 🚨 Troubleshooting Common Issues

### Backend Issues

**Database connection refused**:
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection details in application.yml
# Ensure database exists
docker exec -it villasboats-db psql -U villasboats_user -l
```

**Flyway migration fails**:
```bash
# Repair Flyway schema history
mvn flyway:repair

# Clean and re-run migrations (⚠️ DESTRUCTIVE in dev only)
mvn flyway:clean flyway:migrate
```

**JWT token issues**:
- Ensure JWT_SECRET is at least 256 bits (32 characters)
- Check token expiration hasn't passed
- Verify Authorization header format: `Bearer <token>`

### Frontend Issues

**API calls fail with CORS errors**:
- Check backend CORS configuration allows frontend origin
- Ensure API_BASE_URL is correct in .env.local
- Verify backend is running and accessible

**I18N translations not working**:
```bash
# Check locale is configured in middleware.ts
# Verify translation files exist in messages/ directory
# Ensure useTranslations hook is used correctly
```

**Build fails with TypeScript errors**:
```bash
# Run type checking
npm run typecheck

# Common issues:
# - Missing type definitions: npm install --save-dev @types/package-name
# - Strict mode errors: fix type annotations
```

**Image optimization errors**:
- Ensure images are in public/ or imported correctly
- Add domains to next.config.js for external images
- Check image file format is supported (jpg, png, webp)

### Docker Issues

**Container crashes on startup**:
```bash
# View logs
docker logs villasboats-backend

# Common causes:
# - Environment variables not set
# - Database not ready (add depends_on + health check)
# - Port already in use
```

**Volume permission issues**:
```bash
# Fix permissions for uploads directory
chmod -R 755 ./backend/uploads
chown -R 1000:1000 ./backend/uploads
```

---

## ✅ Definition of Done

A task is considered "done" when:
- [ ] Code is written and committed to feature branch
- [ ] Unit tests written and passing (>60% coverage)
- [ ] Integration tests passing (if applicable)
- [ ] Code passes linting (no errors, minimal warnings)
- [ ] Code reviewed by peer (PR approved)
- [ ] Merged to develop branch
- [ ] Deployed to staging environment
- [ ] Manually tested in staging
- [ ] Documentation updated (if needed)
- [ ] No known bugs or regressions

---

This workflow guide ensures consistency, quality, and efficiency throughout the 1-week MVP development sprint. Adjust as needed based on team size and project constraints.
