# Deployment Guide - Villas Boats

This guide covers deploying the Villas Boats application to the staging environment.

## Table of Contents

- [Local Development Testing](#local-development-testing)
- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Environment Setup](#environment-setup)
- [Deployment Steps](#deployment-steps)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedure](#rollback-procedure)
- [Production Deployment](#production-deployment)

## Local Development Testing

For testing the complete stack locally before deploying to Portainer, use the dedicated `docker-compose.local.yml` configuration.

### Quick Start

1. **Prepare environment file**:
   ```bash
   # Copy the example file
   cp backend/.env.staging.example .env.staging

   # Edit and fill in actual values
   nano .env.staging
   ```

2. **Start the stack**:
   ```bash
   docker compose -f docker-compose.local.yml up
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Postgres: localhost:5432
   - Redis: localhost:6379

### Key Differences from Staging

The local development configuration:

- ✅ Uses `.env.staging` file for environment variables (via `env_file` directive)
- ✅ Exposes ports directly (no Traefik reverse proxy)
- ✅ Uses local volumes (separate from staging)
- ✅ CORS configured for `http://localhost:3000`
- ✅ Pulls images from GHCR (same as staging)

### Common Commands

```bash
# Start all services
docker compose -f docker-compose.local.yml up

# Start in background
docker compose -f docker-compose.local.yml up -d

# View logs
docker compose -f docker-compose.local.yml logs -f

# Stop services
docker compose -f docker-compose.local.yml down

# Stop and remove volumes (clean slate)
docker compose -f docker-compose.local.yml down -v

# Check service health
docker compose -f docker-compose.local.yml ps
```

### Database Access

Connect to the local Postgres database:

```bash
# Using psql
psql -h localhost -U villasboats -d villas_boats_staging

# Using docker exec
docker exec -it villas-boats-postgres-local psql -U villasboats -d villas_boats_staging
```

### Troubleshooting Local Development

**Issue: Ports already in use**
```bash
# Check what's using the ports
lsof -i :3000  # Frontend
lsof -i :8080  # Backend
lsof -i :5432  # Postgres
lsof -i :6379  # Redis
```

**Issue: Permission denied on volumes**
```bash
# Clean up and recreate volumes
docker compose -f docker-compose.local.yml down -v
docker compose -f docker-compose.local.yml up
```

**Issue: Image not found**
```bash
# Authenticate with GHCR
echo $GHCR_TOKEN | docker login ghcr.io -u <your-username> --password-stdin

# Pull images manually
docker compose -f docker-compose.local.yml pull
```

### Notes

- ⚠️ Local development uses **different volumes** than staging (`postgres_data_local` vs `villas-boats-postgres-staging`)
- ⚠️ NEXT_PUBLIC_API_URL is baked into the frontend image at build time (defaults to production API URL)
- ⚠️ For full local development with hot-reload, use the development setups in `frontend/` and `backend/` instead

---

## Prerequisites

Before deploying, ensure you have:

- Access to Portainer at <https://mcg.sh:9443>
- Access to N8N at <https://n8n.mcg.sh>
- GitHub repository permissions
- Docker images built and pushed to registry
- Environment variables configured

## Architecture Overview

```ascii
┌───────────────────────────────────────────────────────────┐
│                    mcg.sh_network (external)              │
├───────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Traefik  │  │   N8N    │  │ Frontend │  │ Backend  │   │
│  │  (SSL)   │  │          │  │  :3000   │  │  :8080   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │             │              │              │       │
│       └─────────────┼──────────────┴──────────────┘       │
│                     │                     │               │
│                     │              ┌──────┴──────┐        │
│                     │              │             │        │
│                ┌────▼─────┐  ┌─────▼─────┐ ┌─────▼─────┐  │
│                │PostgreSQL│  │   Redis   │ │  Volumes  │  │
│                │    :5432 │  │   :6379   │ │           │  │
│                └──────────┘  └───────────┘ └───────────┘  │
└───────────────────────────────────────────────────────────┘
```

**Components:**

- **Traefik**: Reverse proxy with automatic Let's Encrypt SSL
- **Frontend**: Next.js application (port 3000, internal)
- **Backend**: Spring Boot API (port 8080, internal)
- **PostgreSQL**: Database (port 5432, internal)
- **Redis**: Cache (port 6379, internal)
- **N8N**: Workflow automation (external, pre-existing)

**Network:**

- All services share `mcg.sh_network` (external)
- Only frontend is exposed via Traefik
- Backend accessible at <https://villasboats.mcg.sh/api>

## Environment Setup

### 1. Configure Environment Variables

Copy `.env.staging` template and update with actual values:

```bash
# backend/.env.staging
DB_PASSWORD=<generate-secure-password>
REDIS_PASSWORD=<generate-secure-password>
JWT_SECRET_KEY=<generate-256-bit-secret>
DOCKER_REPO=<your-github-username>/villasboats
```

**Note:** For this initial release, images are stored on the local filesystem. S3 cloud storage can be configured later if needed.

**Generate Secure Passwords:**

```bash
# Database password (32 characters)
openssl rand -base64 32

# Redis password (32 characters)
openssl rand -base64 32

# JWT secret (64 characters for 256 bits)
openssl rand -base64 64
```

### 2. Configure GitHub Secrets

In your GitHub repository settings (Settings → Secrets and variables → Actions), add:

- `PORTAINER_WEBHOOK_URL`: Portainer stack webhook URL (created in step 4.3 below)

Note: `GITHUB_TOKEN` is automatically provided by GitHub Actions.

### 3. Build Docker Images Locally (Optional)

Test builds before pushing:

```bash
# Backend
cd backend
docker build -t villasboats/backend:test .

# Frontend
cd ../frontend
docker build -t villasboats/frontend:test .
```

## Deployment Steps

### Step 1: Import N8N Workflows

1. Navigate to <https://n8n.mcg.sh>
2. Click "Workflows" → "Import from File"
3. Import each workflow from `backend/n8n-workflows/`:
   - `booking-inquiry-new.json`
   - `booking-inquiry-followup.json`
   - `booking-status-update.json`
4. Activate each workflow after import
5. Verify webhook URLs:
   - <https://n8n.mcg.sh/webhook/booking-inquiry-new>
   - <https://n8n.mcg.sh/webhook/booking-inquiry-followup>
   - <https://n8n.mcg.sh/webhook/booking-status-update>

### Step 2: Configure N8N SMTP Credentials

1. In N8N, go to Settings → Credentials
2. Click "Add Credential" → Select "SMTP"
3. Configure your email provider:

   **For Gmail:**

   ```ascii
   Host: smtp.gmail.com
   Port: 587
   Secure: TLS
   User: your-email@gmail.com
   Password: <app-password>  # Not your Gmail password!
   ```

   **For SendGrid:**

   ```ascii
   Host: smtp.sendgrid.net
   Port: 587
   Secure: TLS
   User: apikey
   Password: <your-sendgrid-api-key>
   ```

   **For AWS SES:**

   ```ascii
   Host: email-smtp.<region>.amazonaws.com
   Port: 587
   Secure: TLS
   User: <smtp-username>
   Password: <smtp-password>
   ```

4. Update all 3 workflows to use this SMTP credential
5. Test by triggering a workflow manually

### Step 3: Create Portainer Stack

1. Login to Portainer at <https://mcg.sh:9443>
2. Select your environment (e.g., "local")
3. Navigate to "Stacks" → Click "Add stack"
4. Configure stack:
   - **Name**: `villas-boats-staging`
   - **Build method**: Web editor
   - **Web editor**: Paste contents of `docker-compose.staging.yml`

5. Add environment variables in Portainer:

   Click "Add an environment variable" for each:

   ```ascii
   DB_NAME=villas_boats_staging
   DB_USER=villasboats
   DB_PASSWORD=<your-secure-db-password>
   REDIS_PASSWORD=<your-secure-redis-password>
   JWT_SECRET_KEY=<your-256-bit-jwt-secret>
   STORAGE_TYPE=local
   UPLOAD_DIR=/app/uploads
   DOCKER_REGISTRY=ghcr.io
   DOCKER_REPO=<your-github-username>/villasboats
   VERSION=latest
   ```

   **Note:** The `uploads_data` volume (defined in docker-compose.staging.yml) will persist uploaded images across container restarts. For future S3 migration, add S3 credentials and change `STORAGE_TYPE=s3`.

6. Click "Deploy the stack"

### Step 4: Configure Portainer Webhook

1. After stack is created, go to stack details
2. Scroll to "Webhooks" section
3. Click "Add webhook"
4. Copy the webhook URL (format: `https://mcg.sh:9443/api/webhooks/...`)
5. Add this URL to GitHub Secrets as `PORTAINER_WEBHOOK_URL`

### Step 5: Trigger Initial Deployment

#### Option A: Push to develop branch

```bash
git checkout develop
git pull
# Merge your feature branch
git push
```

#### Option B: Manual workflow dispatch

1. Go to GitHub Actions in your repository
2. Select "Deploy to Staging" workflow
3. Click "Run workflow" → Select "develop" branch
4. Click "Run workflow"

### Step 6: Monitor Deployment

1. **GitHub Actions**: Check workflow progress at github.com/your-repo/actions
2. **Portainer**: Monitor containers at <https://mcg.sh:9443>
   - All containers should show "running" status
   - Health checks should be passing (green checkmarks)
3. **Container Logs**: Click on each container to view logs
   - Backend: Look for "Started VillasBoatsApplication"
   - Frontend: Look for "Ready in XYZms"
   - Postgres: Look for "database system is ready to accept connections"

## Post-Deployment Verification

### 1. Verify Traefik Routing

```bash
# Test HTTPS access
curl -I https://villasboats.mcg.sh

# Expected output:
# HTTP/2 200
# Content-Type: text/html
# X-Frame-Options: SAMEORIGIN
```

### 2. Test Backend Health

```bash
# Health check endpoint
curl https://villasboats.mcg.sh/api/actuator/health

# Expected: {"status":"UP"}

# Test CORS headers
curl -H "Origin: https://villasboats.mcg.sh" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://villasboats.mcg.sh/api/boats

# Expected: Access-Control-Allow-Origin header present
```

### 3. Verify Database Migrations

```bash
# SSH to Portainer server
docker exec villas-boats-postgres-staging \
  psql -U villasboats -d villas_boats_staging -c "\dt"

# Expected: List of tables (users, boats, bookings, etc.)

# Check migration history
docker exec villas-boats-postgres-staging \
  psql -U villasboats -d villas_boats_staging \
  -c "SELECT version, description, installed_on FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;"
```

### 4. Test N8N Integration

```bash
# Test booking inquiry webhook
curl -X POST https://n8n.mcg.sh/webhook/booking-inquiry-new \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "customerPhone": "+1234567890",
    "boatName": "Test Boat",
    "dateFrom": "2025-12-01",
    "dateTo": "2025-12-07",
    "guests": 4
  }'

# Expected: 200 OK
# Check email inbox for notification
```

### 5. Frontend Verification

1. Open <https://villasboats.mcg.sh> in browser
2. Verify:
   - ✅ Page loads without errors
   - ✅ All images load correctly
   - ✅ Language switcher works (EN, PT-BR, PT-PT, ES)
   - ✅ Search functionality works
   - ✅ Boat listings display
3. Open DevTools (F12) → Network tab
4. Verify API calls go to `https://villasboats.mcg.sh/api`
5. Check Console for errors (should be none)

### 6. Complete Checklist

- [ ] All containers are running (`docker ps`)
- [ ] All health checks are passing (green in Portainer)
- [ ] SSL certificate is valid (🔒 in browser)
- [ ] Frontend loads without errors
- [ ] Backend API responds to /actuator/health
- [ ] Database migrations completed successfully
- [ ] N8N workflows are active and working
- [ ] Test booking creates notification email
- [ ] GitHub Actions workflow completed successfully
- [ ] No errors in any container logs

## Troubleshooting

### Container Won't Start

**Symptoms**: Container status shows "Exited" or "Restarting"

**Diagnosis**:

```bash
# Check logs
docker logs villas-boats-backend-staging
docker logs villas-boats-frontend-staging
docker logs villas-boats-postgres-staging
```

**Common Causes**:

1. **Invalid environment variables**: Check Portainer stack environment variables
2. **Health check failing**: Container starts but health check fails, causing restart
3. **Port conflict**: Another service using the same port
4. **Resource limits**: Insufficient memory or CPU

**Resolution**:

```bash
# Fix environment variables in Portainer
# Update stack → Environment variables → Save

# Check resource usage
docker stats

# Restart stack
# Portainer → Stacks → villas-boats-staging → Stop → Start
```

### Database Connection Error

**Symptoms**: Backend logs show `Connection refused` or `Unknown host`

**Diagnosis**:

```bash
# Test connection from backend container
docker exec villas-boats-backend-staging nc -zv postgres 5432

# Expected: "postgres (172.x.x.x:5432) open"
```

**Common Causes**:

1. Postgres container not healthy yet
2. Wrong DB_HOST environment variable
3. Wrong credentials

**Resolution**:

```bash
# Check postgres is healthy
docker ps | grep postgres

# Verify environment variables
docker exec villas-boats-backend-staging env | grep DB_

# Check postgres logs
docker logs villas-boats-postgres-staging
```

### SSL Certificate Issues

**Symptoms**: Browser shows "Not secure" or certificate errors

**Diagnosis**:

```bash
# Check Traefik logs
docker logs traefik | grep villasboats

# Test DNS resolution
nslookup villasboats.mcg.sh
```

**Common Causes**:

1. DNS not pointing to correct server
2. Traefik labels incorrect
3. Let's Encrypt rate limit exceeded
4. Ports 80/443 not accessible

**Resolution**:

1. Verify DNS: `villasboats.mcg.sh` → server IP
2. Check Traefik labels in docker-compose.staging.yml
3. Ensure firewall allows ports 80 and 443
4. Check Traefik dashboard for certificate status

### N8N Webhooks Not Triggering

**Symptoms**: Booking created but no email received

**Diagnosis**:

```bash
# Test webhook directly
curl -X POST https://n8n.mcg.sh/webhook/booking-inquiry-new \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Check backend logs for webhook calls
docker logs villas-boats-backend-staging | grep n8n
```

**Common Causes**:

1. N8N workflow not activated
2. Wrong webhook URL in backend config
3. N8N SMTP credentials not configured
4. Network connectivity issue

**Resolution**:

1. Verify N8N_WEBHOOK_BASE_URL: `https://n8n.mcg.sh/webhook`
2. Check workflow is active in N8N
3. Test SMTP credentials in N8N
4. Check backend can reach N8N:

   ```bash
   docker exec villas-boats-backend-staging curl -I https://n8n.mcg.sh
   ```

### GitHub Actions Fails

**Symptoms**: Workflow run shows red X

**Common Failures**:

#### 1. Cannot push to GHCR

```ascii
Error: denied: permission_denied
```

**Fix**: Enable package write permissions in repository settings

#### 2. Portainer webhook fails

```ascii
curl: (7) Failed to connect
```

**Fix**: Verify PORTAINER_WEBHOOK_URL secret is correct

#### 3. Health check timeout

```ascii
❌ Backend health check failed
```

**Fix**: Check backend container logs, may need more startup time

### Frontend 404 Errors

**Symptoms**: Some pages return 404 errors

**Common Causes**:

1. Missing environment variable NEXT_PUBLIC_API_URL
2. Static files not copied correctly
3. Standalone build issue

**Resolution**:

```bash
# Check frontend environment
docker exec villas-boats-frontend-staging env | grep NEXT_PUBLIC

# Rebuild frontend with correct env
# Update .env.staging → rebuild image
```

## Rollback Procedure

If deployment fails and you need to rollback:

### Method 1: Via Portainer (Recommended)

1. Go to Portainer → Images
2. Find previous working image tag (e.g., `develop-abc123`)
3. Update stack environment variable:

   ```ascii
   VERSION=develop-abc123
   ```

4. Click "Update the stack"
5. Wait for containers to restart with old version

### Method 2: Via GitHub Actions

1. Revert the problematic commit:

   ```bash
   git revert <commit-sha>
   git push origin develop
   ```

2. GitHub Actions will automatically deploy the reverted version
3. Monitor deployment in Actions tab

### Method 3: Emergency Rollback (SSH Access)

If Portainer is unavailable:

```bash
# SSH to server
ssh user@mcg.sh

# Navigate to stack directory
cd /var/lib/docker/volumes/portainer_data/_data/compose/villas-boats-staging

# Edit docker-compose.yml
# Change image tags to previous working version

# Redeploy
docker-compose down
docker-compose up -d

# Monitor
docker-compose logs -f
```

## Monitoring and Maintenance

### Regular Health Checks

**Daily**:

- Check Portainer dashboard: All containers healthy
- Review error logs: No critical errors
- Test frontend: <https://villasboats.mcg.sh> loads

**Weekly**:

- Review N8N execution history: Workflows executing successfully
- Check database size growth: Plan for backups
- Review application logs: No anomalies

### Container Logs

```bash
# Backend logs (last 100 lines)
docker logs --tail 100 villas-boats-backend-staging

# Frontend logs with timestamps
docker logs --timestamps villas-boats-frontend-staging

# Follow logs in real-time
docker logs -f villas-boats-backend-staging

# Search logs for errors
docker logs villas-boats-backend-staging 2>&1 | grep ERROR
```

### Database Maintenance

```bash
# Check database size
docker exec villas-boats-postgres-staging \
  psql -U villasboats -d villas_boats_staging \
  -c "SELECT pg_size_pretty(pg_database_size('villas_boats_staging'));"

# Check table sizes
docker exec villas-boats-postgres-staging \
  psql -U villasboats -d villas_boats_staging \
  -c "SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
      FROM pg_tables
      WHERE schemaname NOT IN ('pg_catalog','information_schema')
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
      LIMIT 10;"

# Vacuum database (during low traffic)
docker exec villas-boats-postgres-staging \
  psql -U villasboats -d villas_boats_staging \
  -c "VACUUM ANALYZE;"
```

### Performance Monitoring

```bash
# Container resource usage
docker stats villas-boats-backend-staging villas-boats-frontend-staging

# Database connections
docker exec villas-boats-postgres-staging \
  psql -U villasboats -d villas_boats_staging \
  -c "SELECT count(*) FROM pg_stat_activity;"

# Redis memory usage
docker exec villas-boats-redis-staging redis-cli --no-auth-warning -a "$REDIS_PASSWORD" INFO memory
```

## Production Deployment

Production deployments to **https://villasboats.com** follow a controlled release process with manual approval gates and semantic versioning.

### Overview

- **Environment**: Production
- **URL**: https://villasboats.com
- **Trigger**: Git tags matching `v*.*.*` (e.g., v1.0.0)
- **Approval**: Manual approval required via GitHub Environments
- **Workflow**: `.github/workflows/deploy-production.yml`
- **Configuration**: `docker-compose.production.yml`

### Version Strategy

Production uses **Semantic Versioning 2.0.0**:

- **vMAJOR.MINOR.PATCH** (e.g., v1.2.3)
- **MAJOR**: Breaking changes (v2.0.0)
- **MINOR**: New features, backward-compatible (v1.1.0)
- **PATCH**: Bug fixes, backward-compatible (v1.0.1)

See [docs/deployment-strategy.md](docs/deployment-strategy.md) for complete versioning guidelines.

### Production Release Process

**Quick Overview**:

1. **Merge to Main**:
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

2. **Create Release Tag**:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0: Brief description

   Features:
   - Feature 1
   - Feature 2

   Fixes:
   - Bug fix 1
   - Bug fix 2"

   git push origin v1.0.0
   ```

3. **Approve Deployment**:
   - GitHub Actions builds images (~5-10 minutes)
   - Navigate to Actions tab → "Deploy to Production"
   - Click "Review deployments" → "Approve and deploy"

4. **Verify Production**:
   ```bash
   curl https://api.villasboats.com/actuator/health
   # Expected: {"status":"UP"}
   ```

### Docker Image Tags

Each production release creates multiple image tags:

```
v1.0.0  → ghcr.io/.../backend:v1.0.0
         ghcr.io/.../backend:1.0.0
         ghcr.io/.../backend:1.0
         ghcr.io/.../backend:1
         ghcr.io/.../backend:latest
```

This allows flexible version pinning in `docker-compose.production.yml`.

### Portainer Configuration

**Production Stack**: `villas-boats-production`

**Required Environment Variables**:
```bash
DB_NAME=villas_boats_production
DB_USER=villasboats
DB_PASSWORD=<secure-password>
REDIS_PASSWORD=<secure-password>
JWT_SECRET_KEY=<256-bit-key>
DOCKER_REGISTRY=ghcr.io
DOCKER_REPO=elogioseancoras-gif/villas-boats
VERSION=v1.0.0  # Update to desired version
```

**Deployment Methods**:

**Option 1: Automatic via Webhook** (when configured)
- GitHub Actions triggers Portainer webhook
- Stack automatically updates to new version

**Option 2: Manual Update in Portainer**
1. Navigate to Stacks → villas-boats-production
2. Update `VERSION` environment variable to new version
3. Click "Update the stack"
4. Select "Re-pull image and redeploy"
5. Monitor container logs during deployment

### Production Verification

After deployment, verify critical functionality:

```bash
# Health checks
curl https://api.villasboats.com/actuator/health
curl https://villasboats.com

# Version verification
curl https://api.villasboats.com/actuator/info | jq '.build.version'
```

**Manual Testing**:
- [ ] Homepage loads
- [ ] User login works
- [ ] Boat search functions
- [ ] Booking system operational
- [ ] Admin dashboard accessible

### Rollback Procedures

If issues occur in production:

**Quick Rollback via Portainer** (~2 minutes):
1. Navigate to villas-boats-production stack
2. Update `VERSION` to previous stable version (e.g., v1.0.0)
3. Click "Update the stack" + "Re-pull image and redeploy"

**Planned Rollback via GitHub Actions** (~10 minutes):
```bash
gh workflow run deploy-production.yml -f version=v1.0.0
```

See [docs/rollback-procedures.md](docs/rollback-procedures.md) for detailed rollback strategies.

### Production-Specific Configuration

**Security Headers** (via Traefik):
- `Strict-Transport-Security`: HSTS with preload
- `X-Frame-Options`: SAMEORIGIN
- `X-Content-Type-Options`: nosniff
- `Content-Security-Policy`: Strict CSP (TODO: implement nonce-based)

**Rate Limiting**:
- Average: 100 requests/second
- Burst: 200 requests

**Resource Limits**:
- Backend: 2 CPU, 2GB memory (limit), 0.5 CPU, 512MB (reserved)
- Frontend: 1 CPU, 1GB memory (limit), 0.25 CPU, 256MB (reserved)
- Postgres: 2 CPU, 2GB memory (limit), 0.5 CPU, 512MB (reserved)
- Redis: 1 CPU, 512MB memory (limit), 0.25 CPU, 128MB (reserved)

### Complete Documentation

For comprehensive production deployment procedures:

- **[Deployment Strategy](docs/deployment-strategy.md)**: Overall strategy and versioning
- **[Production Deployment Guide](docs/production-deployment.md)**: Step-by-step deployment
- **[Rollback Procedures](docs/rollback-procedures.md)**: Emergency rollback steps
- **[Developer Workflow](docs/developer-workflow.md)**: Development to production flow

## Security Considerations

1. **Secrets Management**:
   - All secrets in environment variables only
   - Never commit `.env.staging` to Git (already in .gitignore)
   - Rotate JWT secret and passwords regularly

2. **Network Security**:
   - Internal services not exposed externally
   - Only frontend accessible via Traefik
   - Database and Redis only accessible from backend

3. **SSL/TLS**:
   - All external traffic encrypted
   - Let's Encrypt certificates auto-renewed
   - Security headers enforced (X-Frame-Options, etc.)

4. **Container Security**:
   - Backend runs as non-root user (spring:spring)
   - Frontend runs as non-root user (nextjs:nextjs)
   - Images scanned for vulnerabilities regularly

5. **Access Control**:
   - Portainer protected by authentication
   - GitHub Container Registry requires authentication
   - Database uses strong passwords

## Additional Resources

- [Wave 7 Deployment Plan](claudedocs/wave-7-deployment-plan.md) - Detailed technical plan
- [Spring Boot Actuator Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [N8N Documentation](https://docs.n8n.io/)
- [Portainer Documentation](https://docs.portainer.io/)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-10
**Maintained By**: Development Team
