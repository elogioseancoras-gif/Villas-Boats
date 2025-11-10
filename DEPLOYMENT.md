# Deployment Guide - Villas Boats

This guide covers deploying the Villas Boats application to the staging environment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Environment Setup](#environment-setup)
- [Deployment Steps](#deployment-steps)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedure](#rollback-procedure)

## Prerequisites

Before deploying, ensure you have:

- Access to Portainer at https://mcg.sh:9443
- Access to N8N at https://n8n.mcg.sh
- GitHub repository permissions
- Docker images built and pushed to registry
- Environment variables configured

## Architecture Overview

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
- Backend accessible at https://villasboats.mcg.sh/api

## Environment Setup

### 1. Configure Environment Variables

Copy `.env.staging` template and update with actual values:

```bash
# backend/.env.staging
DB_PASSWORD=<generate-secure-password>
REDIS_PASSWORD=<generate-secure-password>
JWT_SECRET_KEY=<generate-256-bit-secret>
S3_ACCESS_KEY=<your-s3-access-key>
S3_SECRET_KEY=<your-s3-secret-key>
DOCKER_REPO=<your-github-username>/villasboats
```

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

1. Navigate to https://n8n.mcg.sh
2. Click "Workflows" → "Import from File"
3. Import each workflow from `backend/n8n-workflows/`:
   - `booking-inquiry-new.json`
   - `booking-inquiry-followup.json`
   - `booking-status-update.json`
4. Activate each workflow after import
5. Verify webhook URLs:
   - https://n8n.mcg.sh/webhook/booking-inquiry-new
   - https://n8n.mcg.sh/webhook/booking-inquiry-followup
   - https://n8n.mcg.sh/webhook/booking-status-update

### Step 2: Configure N8N SMTP Credentials

1. In N8N, go to Settings → Credentials
2. Click "Add Credential" → Select "SMTP"
3. Configure your email provider:

**For Gmail:**
```
Host: smtp.gmail.com
Port: 587
Secure: TLS
User: your-email@gmail.com
Password: <app-password>  # Not your Gmail password!
```

**For SendGrid:**
```
Host: smtp.sendgrid.net
Port: 587
Secure: TLS
User: apikey
Password: <your-sendgrid-api-key>
```

**For AWS SES:**
```
Host: email-smtp.<region>.amazonaws.com
Port: 587
Secure: TLS
User: <smtp-username>
Password: <smtp-password>
```

4. Update all 3 workflows to use this SMTP credential
5. Test by triggering a workflow manually

### Step 3: Create Portainer Stack

1. Login to Portainer at https://mcg.sh:9443
2. Select your environment (e.g., "local")
3. Navigate to "Stacks" → Click "Add stack"
4. Configure stack:
   - **Name**: `villas-boats-staging`
   - **Build method**: Web editor
   - **Web editor**: Paste contents of `docker-compose.staging.yml`

5. Add environment variables in Portainer:

Click "Add an environment variable" for each:

```
DB_NAME=villas_boats_staging
DB_USER=villasboats
DB_PASSWORD=<your-secure-db-password>
REDIS_PASSWORD=<your-secure-redis-password>
JWT_SECRET_KEY=<your-256-bit-jwt-secret>
STORAGE_TYPE=s3
S3_BUCKET=villas-boats-staging
S3_REGION=us-east-1
S3_ACCESS_KEY=<your-s3-access-key>
S3_SECRET_KEY=<your-s3-secret-key>
DOCKER_REGISTRY=ghcr.io
DOCKER_REPO=<your-github-username>/villasboats
VERSION=latest
```

6. Click "Deploy the stack"

### Step 4: Configure Portainer Webhook

1. After stack is created, go to stack details
2. Scroll to "Webhooks" section
3. Click "Add webhook"
4. Copy the webhook URL (format: `https://mcg.sh:9443/api/webhooks/...`)
5. Add this URL to GitHub Secrets as `PORTAINER_WEBHOOK_URL`

### Step 5: Trigger Initial Deployment

**Option A: Push to develop branch**
```bash
git checkout develop
git pull
# Merge your feature branch
git push
```

**Option B: Manual workflow dispatch**
1. Go to GitHub Actions in your repository
2. Select "Deploy to Staging" workflow
3. Click "Run workflow" → Select "develop" branch
4. Click "Run workflow"

### Step 6: Monitor Deployment

1. **GitHub Actions**: Check workflow progress at github.com/your-repo/actions
2. **Portainer**: Monitor containers at https://mcg.sh:9443
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

1. Open https://villasboats.mcg.sh in browser
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

**1. Cannot push to GHCR**
```
Error: denied: permission_denied
```
**Fix**: Enable package write permissions in repository settings

**2. Portainer webhook fails**
```
curl: (7) Failed to connect
```
**Fix**: Verify PORTAINER_WEBHOOK_URL secret is correct

**3. Health check timeout**
```
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
   ```
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
- Test frontend: https://villasboats.mcg.sh loads

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
