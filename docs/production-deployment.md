# Production Deployment Guide - Villas Boats

Detailed step-by-step guide for deploying to production at https://villasboats.com.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Deployment Process](#deployment-process)
- [Post-Deployment Verification](#post-deployment-verification)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Access

- [x] GitHub repository push access
- [x] GitHub Actions approval permissions
- [x] Portainer admin access
- [x] Production server SSH access (emergency only)

### Required Setup

- [x] Portainer production stack configured with `docker-compose.production.yml`
- [x] GitHub Environment "production" configured with required approvers
- [x] Portainer environment variables configured:
  - `DB_NAME`, `DB_USER`, `DB_PASSWORD`
  - `REDIS_PASSWORD`
  - `JWT_SECRET_KEY`
  - `DOCKER_REGISTRY=ghcr.io`
  - `DOCKER_REPO=elogioseancoras-gif/villas-boats`
  - `VERSION=v1.0.0` (or desired version)

### Tools Required

```bash
# Git CLI
git --version

# GitHub CLI (optional, for checking runs)
gh --version

# curl (for health checks)
curl --version
```

## Pre-Deployment Checklist

### 1. Code Quality

```bash
# Ensure you're on main branch
git checkout main
git pull origin main

# Verify develop is merged
git log --oneline -10

# Check for uncommitted changes
git status
```

### 2. Staging Verification

**Test at https://villasboats.mcg.sh:**

- [ ] User authentication (login/logout)
- [ ] Boat listing and search
- [ ] Booking creation and management
- [ ] Image uploads
- [ ] Responsive design on mobile/tablet
- [ ] API health: https://villasboats.mcg.sh/api/actuator/health

### 3. Version Planning

Determine version number based on changes since last production release:

**MAJOR (v2.0.0)**: Breaking changes
- Database schema changes requiring migration
- API endpoint removals or incompatible changes
- Major architecture changes

**MINOR (v1.1.0)**: New features (backward-compatible)
- New API endpoints
- New UI features
- Database schema additions (non-breaking)

**PATCH (v1.0.1)**: Bug fixes
- Security patches
- Bug fixes
- Performance improvements (no API changes)

### 4. Database Migrations

```bash
# Review pending migrations
cd backend
./mvnw flyway:info

# If migrations exist, document them
# Consider backing up production database before deployment
```

### 5. Documentation Updates

- [ ] Update CHANGELOG.md with release notes
- [ ] Review README.md for accuracy
- [ ] Check API documentation if changed

## Deployment Process

### Step 1: Merge to Main

```bash
# Ensure you're on develop
git checkout develop
git pull origin develop

# Merge to main
git checkout main
git pull origin main
git merge develop

# Push to main
git push origin main
```

### Step 2: Create Release Tag

```bash
# Create annotated tag with release notes
git tag -a v1.0.0 -m "Release v1.0.0: Initial Production Release

Features:
- User authentication with JWT
- Boat catalog and search
- Booking management system
- Admin dashboard
- Image upload support

Technical:
- Spring Boot 3.4.1 backend
- Next.js 15.1.6 frontend
- PostgreSQL 18 database
- Redis 7 caching
- Docker containerization

Security:
- HTTPS with Let's Encrypt
- HSTS headers
- CSP headers
- Rate limiting

Infrastructure:
- Automated staging deployment
- Manual production approval
- Health checks and monitoring"

# Verify tag
git tag -n10 v1.0.0

# Push tag (triggers production workflow)
git push origin v1.0.0
```

### Step 3: Monitor GitHub Actions

```bash
# Using GitHub CLI
gh run list --workflow=deploy-production.yml

# Or visit: https://github.com/elogioseancoras-gif/villas-boats/actions
```

**Expected Flow:**

1. **Build Job** (~5-10 minutes):
   - Checkout code
   - Extract version from tag
   - Build backend Docker image
   - Build frontend Docker image
   - Push images to GHCR with tags:
     - `ghcr.io/.../backend:v1.0.0`
     - `ghcr.io/.../backend:1.0.0`
     - `ghcr.io/.../backend:1.0`
     - `ghcr.io/.../backend:1`
     - `ghcr.io/.../backend:latest`
     - Same for frontend

2. **Deploy Job** (requires manual approval):
   - Wait for approval in GitHub UI
   - Trigger Portainer webhook (when configured)
   - Wait 30 seconds
   - Run health checks

### Step 4: Manual Approval

1. Navigate to: https://github.com/elogioseancoras-gif/villas-boats/actions
2. Click on the running "Deploy to Production" workflow
3. Click "Review deployments"
4. Select "production" environment
5. Review deployment summary
6. Click "Approve and deploy"

### Step 5: Portainer Deployment

**Option A: Automatic (if webhook configured)**

Portainer will automatically pull and redeploy when webhook is triggered.

**Option B: Manual Update**

If webhook is not configured:

1. Log into Portainer
2. Navigate to Stacks → villas-boats-production
3. Scroll to "Environment variables"
4. Update `VERSION` to `v1.0.0` (or your version)
5. Click "Update the stack"
6. Select "Re-pull image and redeploy"
7. Click "Update"

### Step 6: Monitor Deployment

Watch container logs during deployment:

**Backend:**
```bash
# In Portainer, view logs for villas-boats-backend-production
# Look for:
"Started VillasBoatsApplication in X seconds"
"Tomcat started on port(s): 8080"
```

**Frontend:**
```bash
# In Portainer, view logs for villas-boats-frontend-production
# Look for:
"Ready in Xms"
"Local: http://localhost:3000"
```

**Database:**
```bash
# Check Flyway migrations completed
# Look for: "Successfully applied X migrations"
```

## Post-Deployment Verification

### Automated Health Checks

GitHub Actions runs these automatically:

```bash
# Backend health
curl -f https://api.villasboats.com/actuator/health

# Expected response:
{"status":"UP"}
```

### Manual Verification

#### 1. Frontend Accessibility

```bash
# Check homepage loads
curl -I https://villasboats.com

# Expected: HTTP/2 200
```

Visit https://villasboats.com and verify:
- [ ] Homepage loads correctly
- [ ] No console errors (F12 → Console)
- [ ] Images load
- [ ] Responsive design works (test mobile view)

#### 2. Authentication Flow

- [ ] Navigate to login page
- [ ] Log in with test account
- [ ] Verify JWT token is set (check cookies/localStorage)
- [ ] Access protected route
- [ ] Log out successfully

#### 3. Core Functionality

- [ ] Browse boat listings
- [ ] Search functionality works
- [ ] View boat details
- [ ] Create booking (if applicable)
- [ ] Upload image (if applicable)
- [ ] Admin dashboard access (admin user)

#### 4. API Health

```bash
# Detailed health check
curl https://api.villasboats.com/actuator/health | jq

# Check version info
curl https://api.villasboats.com/actuator/info | jq

# Test API endpoint
curl https://api.villasboats.com/api/boats
```

#### 5. Database Connectivity

```bash
# Check backend logs for database connection
# Should see: "HikariPool-1 - Start completed"
# No errors about database connectivity
```

#### 6. Redis Connectivity

```bash
# Check backend logs for Redis connection
# Should see successful Redis connection
# No "Unable to connect to Redis" errors
```

### Performance Checks

```bash
# Check response times
curl -w "@-" -o /dev/null -s https://villasboats.com <<'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF
```

**Expected response times:**
- Homepage: < 2 seconds
- API calls: < 500ms
- Search: < 1 second

### Security Verification

```bash
# Check security headers
curl -I https://villasboats.com

# Should include:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# Content-Security-Policy: ...
```

Test at: https://securityheaders.com/?q=https://villasboats.com

### SSL Certificate

```bash
# Check SSL certificate
echo | openssl s_client -servername villasboats.com -connect villasboats.com:443 2>/dev/null | openssl x509 -noout -dates

# Verify:
# - Certificate not expired
# - Valid for villasboats.com and www.villasboats.com
```

## Monitoring

### Immediate Post-Deployment (First Hour)

Monitor these metrics closely:

1. **Error Rates**
   ```bash
   # Check backend logs for exceptions
   # Filter for "ERROR" level logs
   ```

2. **Response Times**
   - Homepage load time
   - API response times
   - Database query performance

3. **User Activity**
   - Successful logins
   - Page views
   - API calls

### Ongoing Monitoring (First 24 Hours)

- [ ] Check error logs every 4 hours
- [ ] Monitor disk usage (database growth)
- [ ] Watch memory usage (detect leaks)
- [ ] Track response times
- [ ] Monitor user feedback/reports

### Monitoring Endpoints

```bash
# Health check (automated)
curl https://api.villasboats.com/actuator/health

# Metrics (if enabled)
curl https://api.villasboats.com/actuator/metrics

# Application info
curl https://api.villasboats.com/actuator/info
```

### Portainer Monitoring

In Portainer, monitor:

1. **Container Stats**
   - CPU usage (should be < 50% under normal load)
   - Memory usage (should be within limits)
   - Network I/O

2. **Container Logs**
   - Filter for "ERROR" or "WARN"
   - Watch for repeated errors
   - Monitor startup/shutdown events

3. **Volume Usage**
   - `villas-boats-postgres-production`: Database growth
   - `villas-boats-uploads-production`: Upload storage
   - `villas-boats-redis-production`: Cache storage

## Troubleshooting

### Issue: Deployment Failed to Start

**Symptoms**: Containers restart repeatedly, health checks fail

**Diagnosis**:
```bash
# Check container logs
# In Portainer: villas-boats-backend-production → Logs

# Common issues:
# - Database connection failed → Check DB_PASSWORD
# - Redis connection failed → Check REDIS_PASSWORD
# - Port already in use → Check for conflicting containers
```

**Solutions**:
1. Verify environment variables in Portainer
2. Check database is running and healthy
3. Restart stack in correct order: postgres → redis → backend → frontend

### Issue: Health Check Failing

**Symptoms**: `/actuator/health` returns 503 or timeout

**Diagnosis**:
```bash
# Check backend logs for startup errors
# Look for:
# - "Failed to configure a DataSource"
# - "Unable to connect to Redis"
# - OutOfMemoryError
```

**Solutions**:
1. Increase health check timeout (currently 10s)
2. Increase start_period (currently 90s for backend)
3. Check resource limits (memory, CPU)

### Issue: Database Migration Failed

**Symptoms**: Backend fails to start, Flyway errors in logs

**Diagnosis**:
```bash
# Check Flyway migration status
./mvnw flyway:info

# Check backend logs for:
# "Migration checksum mismatch"
# "Migration failed"
```

**Solutions**:
1. Review migration scripts
2. Check database schema manually
3. Consider rollback (see [rollback-procedures.md](./rollback-procedures.md))

### Issue: Frontend Not Loading

**Symptoms**: 502 Bad Gateway or timeout

**Diagnosis**:
```bash
# Check if backend is healthy
curl https://api.villasboats.com/actuator/health

# Check Traefik labels
# Verify NEXT_PUBLIC_API_URL is correct
```

**Solutions**:
1. Verify backend is running
2. Check Traefik router configuration
3. Verify SSL certificate is valid
4. Check frontend environment variables

### Issue: Slow Response Times

**Symptoms**: Pages load slowly, API timeouts

**Diagnosis**:
```bash
# Check database performance
# Monitor slow query log

# Check Redis hit rate
# Look for cache misses

# Check resource usage
# CPU/Memory limits reached?
```

**Solutions**:
1. Increase resource limits (CPU, memory)
2. Optimize database queries
3. Review Redis configuration
4. Enable database connection pooling

### Emergency Rollback

If critical issues occur, see [rollback-procedures.md](./rollback-procedures.md) for detailed steps.

**Quick rollback**:
```bash
# Option 1: Redeploy previous version in Portainer
# Update VERSION to previous version (e.g., v1.0.0)

# Option 2: Trigger workflow with previous version
gh workflow run deploy-production.yml -f version=v1.0.0
```

## Post-Deployment Tasks

### Update Documentation

- [ ] Update CHANGELOG.md with release notes
- [ ] Create GitHub release with notes
- [ ] Update project README if needed
- [ ] Document any configuration changes

### Team Communication

- [ ] Notify team of successful deployment
- [ ] Share release notes
- [ ] Document any known issues
- [ ] Schedule post-deployment review

### Backup

```bash
# Create post-deployment database backup
# This provides restore point if issues arise

# Export database
docker exec villas-boats-postgres-production \
  pg_dump -U villasboats villas_boats > backup-post-v1.0.0.sql
```

### Performance Baseline

Document current performance metrics for future comparison:

```bash
# Response times
# Database size
# Memory usage
# Active users
# Error rates
```

## Best Practices

### Before Every Deployment

1. ✅ Test thoroughly in staging
2. ✅ Review all code changes since last release
3. ✅ Check for breaking changes
4. ✅ Update CHANGELOG.md
5. ✅ Verify database migrations
6. ✅ Ensure backup exists

### During Deployment

1. ✅ Deploy during low-traffic period
2. ✅ Monitor logs in real-time
3. ✅ Keep rollback plan ready
4. ✅ Document any issues encountered

### After Deployment

1. ✅ Verify all critical functionality
2. ✅ Monitor for at least 1 hour
3. ✅ Check error rates and performance
4. ✅ Create post-deployment backup
5. ✅ Update team on status

## References

- [Deployment Strategy Overview](./deployment-strategy.md)
- [Rollback Procedures](./rollback-procedures.md)
- [Developer Workflow](./developer-workflow.md)
- [Main Deployment Documentation](../DEPLOYMENT.md)
- [Semantic Versioning 2.0.0](https://semver.org/)
