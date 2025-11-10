# Wave 7 Staging Deployment Plan - Villas Boats

**Target Environment**: Staging (Pre-Production)
**Domain**: villasboats.mcg.sh
**Infrastructure**: Portainer at https://mcg.sh:9443
**Date**: 2025-11-10

## Overview

Deploy Villas Boats application to staging environment using existing Portainer infrastructure with Traefik reverse proxy and N8N integration.

## Infrastructure Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    mcg.sh_network (external)                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Traefik  │  │   N8N    │  │ Frontend │  │ Backend  │   │
│  │  (SSL)   │  │          │  │  :3000   │  │  :8080   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │             │              │              │         │
│       └─────────────┼──────────────┴──────────────┘         │
│                     │                     │                 │
│                     │         ┌───────────┴────────┐        │
│                     │         │                    │        │
│                ┌────▼─────┐  ┌▼──────────┐  ┌─────▼─────┐  │
│                │PostgreSQL│  │   Redis   │  │  Volumes  │  │
│                │    :5432 │  │   :6379   │  │           │  │
│                └──────────┘  └───────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Phase 1: Docker Configuration Files (Est. 2h)

### Task 1.1: Create Frontend Dockerfile
**File**: `frontend/Dockerfile`

```dockerfile
# Multi-stage build for Next.js application

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build application
RUN npm run build

# Stage 3: Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
```

### Task 1.2: Create docker-compose.staging.yml
**File**: `docker-compose.staging.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: villas-boats-postgres-staging
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - mcg.sh_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: villas-boats-redis-staging
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - mcg.sh_network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  backend:
    image: ${DOCKER_REGISTRY:-ghcr.io}/${DOCKER_REPO:-villasboats}/backend:${VERSION:-latest}
    container_name: villas-boats-backend-staging
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      SPRING_PROFILES_ACTIVE: staging
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
      CORS_ALLOWED_ORIGINS: https://villasboats.mcg.sh
      N8N_WEBHOOK_BASE_URL: https://n8n.mcg.sh/webhook
      N8N_WEBHOOK_ENABLED: "true"
      STORAGE_TYPE: ${STORAGE_TYPE:-s3}
      S3_BUCKET: ${S3_BUCKET}
      S3_REGION: ${S3_REGION}
      S3_ACCESS_KEY: ${S3_ACCESS_KEY}
      S3_SECRET_KEY: ${S3_SECRET_KEY}
      VERSION: ${VERSION:-1.0.0}
    networks:
      - mcg.sh_network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/api/actuator/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 60s

  frontend:
    image: ${DOCKER_REGISTRY:-ghcr.io}/${DOCKER_REPO:-villasboats}/frontend:${VERSION:-latest}
    container_name: villas-boats-frontend-staging
    depends_on:
      backend:
        condition: service_healthy
    environment:
      NEXT_PUBLIC_API_URL: https://villasboats.mcg.sh/api
      NODE_ENV: production
    networks:
      - mcg.sh_network
    labels:
      # Enable Traefik
      - "traefik.enable=true"

      # HTTP Router
      - "traefik.http.routers.villasboats-staging.rule=Host(`villasboats.mcg.sh`)"
      - "traefik.http.routers.villasboats-staging.entrypoints=websecure"
      - "traefik.http.routers.villasboats-staging.tls=true"
      - "traefik.http.routers.villasboats-staging.tls.certresolver=letsencrypt"

      # Service
      - "traefik.http.services.villasboats-staging.loadbalancer.server.port=3000"

      # Middleware (optional - add security headers)
      - "traefik.http.middlewares.villasboats-staging-headers.headers.customResponseHeaders.X-Frame-Options=SAMEORIGIN"
      - "traefik.http.middlewares.villasboats-staging-headers.headers.customResponseHeaders.X-Content-Type-Options=nosniff"
      - "traefik.http.middlewares.villasboats-staging-headers.headers.customResponseHeaders.X-XSS-Protection=1; mode=block"
      - "traefik.http.routers.villasboats-staging.middlewares=villasboats-staging-headers"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 40s

networks:
  mcg.sh_network:
    external: true

volumes:
  postgres_data:
    name: villas-boats-postgres-staging
  redis_data:
    name: villas-boats-redis-staging
```

### Task 1.3: Create .dockerignore files

**File**: `backend/.dockerignore`
```
target/
.git/
.idea/
*.iml
.DS_Store
.env*
!.env.example
```

**File**: `frontend/.dockerignore`
```
node_modules/
.next/
.git/
.DS_Store
*.log
.env*
!.env.example
```

## Phase 2: Environment Configuration (Est. 1h)

### Task 2.1: Create Spring Boot Staging Profile

**File**: `backend/src/main/resources/application-staging.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:postgres}:${DB_PORT:5432}/${DB_NAME:villas_boats}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000

  data:
    redis:
      host: ${REDIS_HOST:redis}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD}
      timeout: 5000ms

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: false
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true

server:
  port: 8080
  servlet:
    context-path: /api
  compression:
    enabled: true
  error:
    include-message: always
    include-binding-errors: always

logging:
  level:
    root: INFO
    com.villasboats: DEBUG
    org.springframework.web: INFO
    org.hibernate.SQL: WARN
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"

application:
  security:
    jwt:
      secret-key: ${JWT_SECRET_KEY}
      expiration: 86400000  # 24 hours
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:https://villasboats.mcg.sh}
  storage:
    type: ${STORAGE_TYPE:s3}
    s3:
      bucket: ${S3_BUCKET}
      region: ${S3_REGION}
      access-key: ${S3_ACCESS_KEY}
      secret-key: ${S3_SECRET_KEY}

n8n:
  webhook:
    base-url: ${N8N_WEBHOOK_BASE_URL:https://n8n.mcg.sh/webhook}
    enabled: ${N8N_WEBHOOK_ENABLED:true}
    timeout-ms: ${N8N_WEBHOOK_TIMEOUT:5000}

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized
```

### Task 2.2: Create Backend .env.staging Template

**File**: `backend/.env.staging`

```bash
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=villas_boats_staging
DB_USER=villasboats
DB_PASSWORD=CHANGE_THIS_SECURE_PASSWORD_123

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=CHANGE_THIS_REDIS_PASSWORD_456

# JWT Configuration (must be at least 256 bits for HS256)
JWT_SECRET_KEY=CHANGE_THIS_TO_A_VERY_LONG_RANDOM_STRING_AT_LEAST_256_BITS_FOR_HS256_ALGORITHM

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://villasboats.mcg.sh

# Storage Configuration (S3/MinIO)
STORAGE_TYPE=s3
S3_BUCKET=villas-boats-staging
S3_REGION=us-east-1
S3_ACCESS_KEY=YOUR_ACCESS_KEY_HERE
S3_SECRET_KEY=YOUR_SECRET_KEY_HERE

# N8N Configuration
N8N_WEBHOOK_BASE_URL=https://n8n.mcg.sh/webhook
N8N_WEBHOOK_ENABLED=true
N8N_WEBHOOK_TIMEOUT=5000

# Docker Configuration
DOCKER_REGISTRY=ghcr.io
DOCKER_REPO=YOUR_GITHUB_USERNAME/villasboats
VERSION=latest

# Application Version
VERSION=1.0.0-staging
```

### Task 2.3: Create Frontend .env.staging

**File**: `frontend/.env.staging`

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://villasboats.mcg.sh/api

# Environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Phase 3: CI/CD Pipeline (Est. 2.5h)

### Task 3.1: Create GitHub Actions Workflow

**File**: `.github/workflows/deploy-staging.yml`

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - develop
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  BACKEND_IMAGE: ${{ github.repository }}/backend
  FRONTEND_IMAGE: ${{ github.repository }}/frontend

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata for backend
        id: meta-backend
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.BACKEND_IMAGE }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push backend image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ steps.meta-backend.outputs.tags }}
          labels: ${{ steps.meta-backend.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Extract metadata for frontend
        id: meta-frontend
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.FRONTEND_IMAGE }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push frontend image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ${{ steps.meta-frontend.outputs.tags }}
          labels: ${{ steps.meta-frontend.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_API_URL=https://villasboats.mcg.sh/api

      - name: Trigger Portainer Webhook
        if: success()
        run: |
          curl -X POST "${{ secrets.PORTAINER_WEBHOOK_URL }}"

      - name: Wait for deployment
        run: sleep 30

      - name: Health check
        run: |
          max_attempts=10
          attempt=1
          while [ $attempt -le $max_attempts ]; do
            if curl -f -s https://villasboats.mcg.sh/api/actuator/health > /dev/null; then
              echo "✅ Backend is healthy"
              exit 0
            fi
            echo "Attempt $attempt/$max_attempts - waiting for backend..."
            sleep 10
            attempt=$((attempt + 1))
          done
          echo "❌ Backend health check failed"
          exit 1
```

### Task 3.2: Configure GitHub Secrets

Required secrets in GitHub repository settings:
- `PORTAINER_WEBHOOK_URL` - Portainer webhook URL for stack redeploy

Note: `GITHUB_TOKEN` is automatically provided by GitHub Actions.

## Phase 4: Manual Setup Tasks (Est. 1.5h)

### Task 4.1: Import N8N Workflows

**Steps**:
1. Navigate to https://n8n.mcg.sh
2. Import each workflow file from `backend/n8n-workflows/`:
   - `booking-inquiry-new.json`
   - `booking-inquiry-followup.json`
   - `booking-status-update.json`
3. Activate each workflow
4. Note the webhook URLs (should be):
   - `https://n8n.mcg.sh/webhook/booking-inquiry-new`
   - `https://n8n.mcg.sh/webhook/booking-inquiry-followup`
   - `https://n8n.mcg.sh/webhook/booking-status-update`

### Task 4.2: Configure N8N SMTP Credentials

**Steps**:
1. In N8N, go to Settings → Credentials
2. Create new "SMTP" credential
3. Configure with your email provider:
   - **Gmail**: smtp.gmail.com:587, TLS, app password
   - **SendGrid**: smtp.sendgrid.net:587, TLS, API key
   - **AWS SES**: email-smtp.region.amazonaws.com:587, TLS, SMTP credentials
4. Update all 3 workflows to use this credential

### Task 4.3: Create Portainer Stack

**Steps**:
1. Login to Portainer at https://mcg.sh:9443
2. Select your environment
3. Go to "Stacks" → "Add Stack"
4. Name: `villas-boats-staging`
5. Build method: "Web editor"
6. Copy content from `docker-compose.staging.yml`
7. Add environment variables (from `.env.staging`):

```
DB_NAME=villas_boats_staging
DB_USER=villasboats
DB_PASSWORD=[SECURE_PASSWORD]
REDIS_PASSWORD=[SECURE_PASSWORD]
JWT_SECRET_KEY=[256_BIT_SECRET]
S3_BUCKET=villas-boats-staging
S3_REGION=us-east-1
S3_ACCESS_KEY=[YOUR_KEY]
S3_SECRET_KEY=[YOUR_SECRET]
DOCKER_REGISTRY=ghcr.io
DOCKER_REPO=[YOUR_GITHUB_USERNAME]/villasboats
VERSION=latest
```

8. Click "Deploy the stack"

### Task 4.4: Configure Portainer Webhook

**Steps**:
1. In the stack details, scroll to "Webhooks"
2. Click "Add webhook"
3. Copy the webhook URL
4. Add this URL to GitHub Secrets as `PORTAINER_WEBHOOK_URL`

## Phase 5: Testing & Validation (Est. 1h)

### Task 5.1: Verify Traefik Routing

```bash
# Test HTTPS access
curl -I https://villasboats.mcg.sh

# Expected: HTTP/2 200 with valid SSL certificate
```

### Task 5.2: Test Backend API

```bash
# Health check
curl https://villasboats.mcg.sh/api/actuator/health

# Expected: {"status":"UP"}

# Test CORS
curl -H "Origin: https://villasboats.mcg.sh" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS https://villasboats.mcg.sh/api/boats
```

### Task 5.3: Test N8N Webhook Integration

```bash
# Test booking inquiry webhook (use actual n8n webhook URL)
curl -X POST https://n8n.mcg.sh/webhook/booking-inquiry-new \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "boatName": "Test Boat",
    "dateFrom": "2025-12-01",
    "dateTo": "2025-12-07"
  }'

# Check n8n execution log for success
```

### Task 5.4: Test Database Connectivity

```bash
# Check backend logs in Portainer
# Look for: "Flyway migration completed successfully"
# Look for: "Started VillasBoatsApplication"

# Verify database tables exist
docker exec villas-boats-postgres-staging \
  psql -U villasboats -d villas_boats_staging -c "\dt"
```

### Task 5.5: Test Frontend

1. Open https://villasboats.mcg.sh in browser
2. Verify home page loads
3. Test boat search functionality
4. Test language switching (EN, PT-BR, PT-PT, ES)
5. Open browser DevTools → Network tab
6. Verify API calls go to `https://villasboats.mcg.sh/api`

## Phase 6: Documentation (Est. 30min)

### Task 6.1: Create DEPLOYMENT.md

**File**: `DEPLOYMENT.md`

Document the complete deployment process including:
- Prerequisites
- Environment setup
- Portainer stack creation
- N8N workflow import
- GitHub Actions configuration
- Troubleshooting guide

### Task 6.2: Update README.md

Add staging environment section:
- Staging URL: https://villasboats.mcg.sh
- API URL: https://villasboats.mcg.sh/api
- N8N URL: https://n8n.mcg.sh
- Portainer URL: https://mcg.sh:9443

## Total Estimated Time: ~8.5 hours

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Domain | villasboats.mcg.sh | Subdomain of existing infrastructure |
| SSL | Let's Encrypt via Traefik | Automatic certificate management |
| Network | mcg.sh_network (external) | Shared with Traefik and N8N |
| CI/CD | GitHub Actions | Native GitHub integration |
| Container Registry | GitHub Container Registry (ghcr.io) | Free for public repos, integrated with GitHub |
| Database | PostgreSQL 16 with named volume | Data persistence across restarts |
| Cache | Redis 7 with named volume | Session and cache persistence |
| Backend Port | 8080 (internal only) | Not exposed externally |
| Frontend Port | 3000 (internal only) | Exposed via Traefik only |
| Spring Profile | staging | Environment-specific configuration |
| Build Strategy | Multi-stage Docker builds | Optimized image sizes |
| Deployment Trigger | Push to develop branch | Automatic staging deployment |

## Post-Deployment Checklist

- [ ] All containers are running (`docker ps`)
- [ ] All health checks are passing (Portainer dashboard)
- [ ] SSL certificate is valid (https://villasboats.mcg.sh)
- [ ] Frontend loads without errors
- [ ] Backend API responds (https://villasboats.mcg.sh/api/actuator/health)
- [ ] Database migrations completed successfully
- [ ] N8N workflows are active
- [ ] Test booking inquiry triggers email notification
- [ ] GitHub Actions workflow runs successfully
- [ ] Portainer webhook triggers redeploy
- [ ] No errors in container logs
- [ ] Environment variables are correctly set
- [ ] CORS is properly configured
- [ ] JWT authentication works
- [ ] Image uploads work (S3/MinIO)

## Troubleshooting

### Container won't start
1. Check logs in Portainer: Stacks → villas-boats-staging → Container name → Logs
2. Verify environment variables are set correctly
3. Check health check status
4. Verify network connectivity: `docker exec container_name ping postgres`

### Database connection error
1. Verify postgres container is healthy
2. Check DB credentials in environment variables
3. Test connection: `docker exec villas-boats-backend-staging nc -zv postgres 5432`

### SSL certificate not working
1. Verify Traefik labels are correct
2. Check Traefik logs for Let's Encrypt errors
3. Ensure port 80 and 443 are accessible
4. Verify DNS points to correct server

### N8N webhooks not triggering
1. Verify N8N_WEBHOOK_BASE_URL in backend environment
2. Check n8n workflow is active
3. Test webhook directly: `curl -X POST https://n8n.mcg.sh/webhook/booking-inquiry-new`
4. Check n8n execution logs

### GitHub Actions fails to push images
1. Verify GITHUB_TOKEN has packages:write permission
2. Check if repository visibility allows GHCR
3. Verify image name format: `ghcr.io/username/repo/image:tag`

## Security Considerations

1. **Secrets Management**: All secrets in environment variables, never committed to Git
2. **Non-root Containers**: Both backend and frontend run as non-root users
3. **Network Isolation**: Internal services not exposed externally
4. **SSL/TLS**: All external traffic encrypted via Traefik
5. **Database Access**: Only accessible from backend container
6. **Redis Access**: Password-protected, internal network only
7. **CORS**: Restricted to staging domain only
8. **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

## Rollback Procedure

If deployment fails:

1. **Via Portainer**:
   - Go to Images
   - Find previous version tag
   - Update stack environment variable `VERSION=previous-tag`
   - Click "Update the stack"

2. **Via GitHub Actions**:
   - Revert commit in develop branch
   - Push revert commit
   - GitHub Actions will auto-deploy previous version

3. **Emergency Rollback**:
   ```bash
   # SSH to server
   cd /var/lib/docker/volumes/portainer_data/_data/compose/villas-boats-staging

   # Edit docker-compose.yml
   # Change image tags to previous version

   # Redeploy
   docker-compose up -d
   ```

## Monitoring

**Container Health**:
- Portainer Dashboard: https://mcg.sh:9443
- Check all containers show "healthy" status

**Application Logs**:
- Portainer → Stacks → villas-boats-staging → Container logs
- Filter by log level: ERROR, WARN

**N8N Executions**:
- https://n8n.mcg.sh → Executions
- Verify successful webhook triggers

**Database**:
```bash
# Connection count
docker exec villas-boats-postgres-staging \
  psql -U villasboats -d villas_boats_staging \
  -c "SELECT count(*) FROM pg_stat_activity;"

# Table sizes
docker exec villas-boats-postgres-staging \
  psql -U villasboats -d villas_boats_staging \
  -c "SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

## Next Steps After Staging Deployment

1. **Load Testing**: Use tools like Apache JMeter or k6 to simulate production load
2. **Security Audit**: Run vulnerability scanners on deployed containers
3. **Backup Strategy**: Implement automated database backups
4. **Monitoring**: Set up proper monitoring with Prometheus/Grafana
5. **Production Planning**: Use staging deployment as template for production
6. **Documentation**: Keep this plan updated as deployment evolves

---

**Document Version**: 1.0
**Last Updated**: 2025-11-10
**Maintained By**: Development Team
