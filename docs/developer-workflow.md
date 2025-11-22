# Developer Workflow - Villas Boats

Complete guide for developers working with the Villas Boats project from feature development to production deployment.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing Strategy](#testing-strategy)
- [Deployment Process](#deployment-process)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Initial Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/elogioseancoras-gif/villas-boats.git
   cd villas-boats
   ```

2. **Configure Environment**:
   ```bash
   # Copy staging environment template
   cp backend/.env.staging.example .env.staging

   # Fill in values (use placeholders for local dev)
   nano .env.staging
   ```

3. **Start Local Stack**:
   ```bash
   # Start all services
   docker compose -f docker-compose.local.yml up

   # Or with rebuild
   docker compose -f docker-compose.local.yml up --build
   ```

4. **Verify Setup**:
   ```bash
   # Check all containers running
   docker ps

   # Test frontend
   curl http://localhost:3000

   # Test backend
   curl http://localhost:8080/api/actuator/health
   ```

### Project Structure

```
villas-boats/
├── .github/
│   └── workflows/          # CI/CD workflows
│       ├── deploy-staging.yml
│       └── deploy-production.yml
├── backend/                # Spring Boot API
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/               # Next.js app
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docs/                   # Project documentation
│   ├── deployment-strategy.md
│   ├── production-deployment.md
│   ├── rollback-procedures.md
│   └── developer-workflow.md (this file)
├── docker-compose.local.yml      # Local development
├── docker-compose.staging.yml    # Staging deployment
├── docker-compose.production.yml # Production deployment
├── DEPLOYMENT.md           # Deployment documentation
└── README.md              # Project overview
```

## Development Workflow

### Git Branching Strategy

We follow a **GitFlow-inspired** workflow with two permanent branches:

- **`main`**: Production-ready code (protected, requires PR)
- **`develop`**: Integration branch for features (auto-deploys to staging)

### Feature Development

#### Step 1: Create Feature Branch

```bash
# Always branch from develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/booking-calendar

# Or for bugs
git checkout -b fix/login-timeout

# Naming convention:
# - feature/descriptive-name
# - fix/bug-description
# - hotfix/urgent-fix (branch from main for production hotfixes)
```

#### Step 2: Develop and Test Locally

```bash
# Make changes
# Edit files...

# Test locally
docker compose -f docker-compose.local.yml up

# Verify changes
# - Test in browser: http://localhost:3000
# - Test API: http://localhost:8080
# - Run unit tests (if applicable)
```

#### Step 3: Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add booking calendar component

- Implemented calendar view for boat availability
- Added date range selection
- Integrated with booking API
- Added responsive design for mobile"

# Commit message format:
# - feat: new feature
# - fix: bug fix
# - docs: documentation changes
# - refactor: code refactoring
# - test: adding tests
# - chore: maintenance tasks
```

#### Step 4: Push and Create PR to Develop

```bash
# Push feature branch
git push origin feature/booking-calendar

# Create PR on GitHub:
# - Base: develop
# - Compare: feature/booking-calendar
# - Add description of changes
# - Link related issues
```

#### Step 5: Code Review

- Address review comments
- Make requested changes
- Push additional commits to same branch
- Request re-review when ready

#### Step 6: Merge to Develop

```bash
# Once approved, merge (via GitHub UI or CLI)
gh pr merge --squash

# Or via Git (after PR approval):
git checkout develop
git merge --no-ff feature/booking-calendar
git push origin develop

# Delete feature branch
git branch -d feature/booking-calendar
git push origin --delete feature/booking-calendar
```

### Staging Deployment (Automatic)

**Trigger**: Push to `develop` branch

**What Happens**:

1. **GitHub Actions Workflow**:
   - Builds Docker images (backend, frontend)
   - Tags images with `develop` and `develop-{sha}`
   - Pushes to GitHub Container Registry
   - Triggers Portainer webhook

2. **Portainer Auto-Deployment**:
   - Pulls new images
   - Restarts containers
   - Runs health checks

3. **Verify Staging**:
   ```bash
   # Check deployment status
   gh run list --workflow=deploy-staging.yml

   # Test staging environment
   curl https://villasboats.mcg.sh/api/actuator/health

   # Manual testing at:
   # https://villasboats.mcg.sh
   ```

**Duration**: ~5-10 minutes from push to live

### Testing in Staging

After automatic deployment to staging:

1. **Functional Testing**:
   - Test new features thoroughly
   - Verify existing functionality not broken
   - Test edge cases and error handling

2. **Integration Testing**:
   - Test API integration
   - Verify database interactions
   - Test third-party service integrations

3. **User Acceptance**:
   - Have stakeholders review changes
   - Gather feedback
   - Document any issues

4. **Performance Testing**:
   - Check page load times
   - Monitor API response times
   - Verify resource usage

### Production Release

#### Step 1: Merge Develop to Main

```bash
# After staging verification
git checkout main
git pull origin main

# Merge develop into main
git merge develop

# Resolve any conflicts (should be rare)
# Push to main
git push origin main
```

#### Step 2: Create Release Tag

```bash
# Determine version number (see versioning guide below)
# Create annotated tag
git tag -a v1.1.0 -m "Release v1.1.0: Booking Calendar Feature

Features:
- New booking calendar with date range selection
- Improved boat availability display
- Mobile-responsive calendar view
- Integration with booking system

Improvements:
- Optimized database queries for availability
- Enhanced error handling for booking conflicts
- Updated booking confirmation emails

Fixes:
- Fixed login timeout issue
- Resolved calendar timezone handling
- Fixed responsive layout on tablets

Testing:
- Tested in staging for 3 days
- User acceptance testing completed
- Performance verified under load"

# Push tag (triggers production workflow)
git push origin v1.1.0
```

#### Step 3: Approve Production Deployment

1. **GitHub Actions Builds Images**:
   - Wait for build to complete (~5-10 minutes)
   - Verify build success in Actions tab

2. **Manual Approval Required**:
   - Navigate to Actions → Deploy to Production workflow
   - Click "Review deployments"
   - Review changes and version
   - Click "Approve and deploy"

3. **Portainer Update** (if webhook not configured):
   - Log into Portainer
   - Update VERSION to `v1.1.0`
   - Click "Update the stack" with "Re-pull image and redeploy"

4. **Monitor Deployment**:
   ```bash
   # Watch deployment progress
   gh run watch

   # Check health after deployment
   watch -n 5 'curl -s https://api.villasboats.com/actuator/health'
   ```

## Testing Strategy

### Local Testing

**Before Every Commit**:

```bash
# Start local stack
docker compose -f docker-compose.local.yml up

# Manual testing:
# - Verify changes in browser
# - Test API endpoints
# - Check console for errors

# Run backend tests (if applicable)
cd backend
./mvnw test

# Run frontend tests (if applicable)
cd frontend
npm test
```

### Staging Testing Checklist

After deployment to staging:

**Automated Checks**:
- [ ] GitHub Actions workflow succeeded
- [ ] Health check endpoint returns 200
- [ ] No deployment errors in logs

**Manual Testing**:
- [ ] New feature works as expected
- [ ] Existing features still work (regression testing)
- [ ] No console errors (F12 → Console)
- [ ] Responsive design works (test mobile, tablet, desktop)
- [ ] Performance acceptable (page load < 2s)
- [ ] Database changes applied correctly

**Integration Testing**:
- [ ] API endpoints respond correctly
- [ ] Database queries return expected data
- [ ] Third-party integrations work (N8N, etc.)
- [ ] Authentication flow works
- [ ] File uploads work (if applicable)

### Production Verification

After production deployment:

**Immediate Checks** (first 5 minutes):
```bash
# Health check
curl https://api.villasboats.com/actuator/health

# Version verification
curl https://api.villasboats.com/actuator/info | jq '.build.version'

# Homepage accessibility
curl -I https://villasboats.com
```

**Critical Path Testing** (first 15 minutes):
- [ ] Homepage loads
- [ ] User can log in
- [ ] Boat search works
- [ ] Booking creation works
- [ ] Admin dashboard accessible

**Extended Monitoring** (first hour):
- [ ] Error rates normal (< 1%)
- [ ] Response times good (< 2s)
- [ ] No user complaints
- [ ] Resource usage stable

## Versioning Guide

### Semantic Versioning

Format: **vMAJOR.MINOR.PATCH** (e.g., v1.2.3)

**MAJOR** (v2.0.0) - Breaking Changes:
- Database schema incompatible changes
- API endpoint removal or incompatible changes
- Major architecture changes
- Removal of deprecated features

Examples:
- Changing API response format
- Removing /api/v1 endpoints
- Changing authentication mechanism

**MINOR** (v1.1.0) - New Features:
- New features (backward-compatible)
- New API endpoints
- UI enhancements
- Database schema additions (non-breaking)

Examples:
- Adding booking calendar feature
- New admin dashboard section
- Additional search filters

**PATCH** (v1.0.1) - Bug Fixes:
- Bug fixes
- Security patches
- Performance improvements (no API changes)
- Documentation updates

Examples:
- Fixing login timeout
- Patching security vulnerability
- Optimizing database queries

### Version Decision Tree

```
Is the change incompatible with previous version?
├─ Yes → MAJOR version bump (v2.0.0)
└─ No → Does it add new functionality?
    ├─ Yes → MINOR version bump (v1.1.0)
    └─ No → PATCH version bump (v1.0.1)
```

### Version Examples

```bash
# Current version: v1.0.0

# Bug fix release
git tag -a v1.0.1 -m "Fix: Resolve login timeout issue"

# Feature release
git tag -a v1.1.0 -m "Feature: Add booking calendar"

# Breaking change
git tag -a v2.0.0 -m "Breaking: New API v2 structure"

# Multiple changes
git tag -a v1.2.0 -m "Release v1.2.0
Features: Calendar view, Export bookings
Fixes: Login timeout, Search pagination
Improvements: Database query optimization"
```

## Best Practices

### Code Quality

1. **Write Clean Code**:
   - Follow language/framework conventions
   - Use meaningful variable/function names
   - Keep functions small and focused
   - Comment complex logic

2. **Test Your Changes**:
   - Test locally before pushing
   - Test in staging before production
   - Write unit tests for critical logic
   - Test edge cases and error scenarios

3. **Code Review**:
   - Review your own code before PR
   - Address review comments promptly
   - Learn from reviewer feedback
   - Review others' code when possible

### Git Hygiene

1. **Commit Frequently**:
   - Make small, logical commits
   - Commit working code
   - Don't commit broken code

2. **Write Good Commit Messages**:
   - Use present tense ("add feature" not "added feature")
   - Be specific about what changed
   - Reference issues when applicable
   - Include context for why change was made

3. **Keep Branches Clean**:
   - Delete merged branches
   - Don't commit to main directly
   - Keep feature branches focused
   - Rebase if needed to keep history clean

### Deployment Safety

1. **Always Test in Staging**:
   - Never skip staging testing
   - Give changes time to prove stable (24-48 hours)
   - Test thoroughly before production

2. **Plan Deployments**:
   - Deploy during low-traffic periods
   - Have rollback plan ready
   - Monitor closely after deployment
   - Document any special considerations

3. **Communicate**:
   - Notify team of deployments
   - Document what changed
   - Share deployment status
   - Report any issues immediately

### Documentation

1. **Keep Docs Updated**:
   - Update README for setup changes
   - Document new features
   - Update API docs if changed
   - Keep deployment docs current

2. **Document Decisions**:
   - Use git commit messages
   - Add comments for complex code
   - Document architecture decisions
   - Explain non-obvious choices

## Troubleshooting

### Common Issues

#### Issue: Local Stack Won't Start

**Symptoms**: Containers fail to start or crash

**Diagnosis**:
```bash
# Check container logs
docker compose -f docker-compose.local.yml logs

# Common causes:
# - Port already in use (3000, 8080, 5432, 6379)
# - Invalid .env.staging values
# - Database connection failed
```

**Solutions**:
```bash
# Stop conflicting services
lsof -i :3000
kill -9 <PID>

# Clean start
docker compose -f docker-compose.local.yml down -v
docker compose -f docker-compose.local.yml up --build

# Verify environment file
cat .env.staging
```

#### Issue: Changes Not Showing in Staging

**Symptoms**: Pushed to develop but staging shows old version

**Diagnosis**:
```bash
# Check GitHub Actions
gh run list --workflow=deploy-staging.yml

# Check if workflow ran
# Check if workflow succeeded
# Check Portainer stack status
```

**Solutions**:
```bash
# If workflow failed:
# - Review error logs in GitHub Actions
# - Fix issues and push again

# If workflow succeeded but Portainer not updated:
# - Check Portainer webhook configuration
# - Manually update stack in Portainer
# - Update VERSION to 'develop'
# - Click "Update the stack" + "Re-pull image"
```

#### Issue: Merge Conflicts

**Symptoms**: Git reports conflicts when merging

**Resolution**:
```bash
# Pull latest changes
git checkout develop
git pull origin develop

# Rebase your feature branch
git checkout feature/my-feature
git rebase develop

# Resolve conflicts in each file
# Edit files, remove conflict markers
git add <resolved-files>
git rebase --continue

# Force push (only on feature branches!)
git push origin feature/my-feature --force-with-lease
```

#### Issue: Production Deployment Failed

**Immediate Action**:
```bash
# Check GitHub Actions logs
gh run view --log

# If critical, rollback immediately
# See rollback-procedures.md
```

**Investigation**:
- Review error messages
- Check health endpoints
- Review container logs in Portainer
- Verify environment variables

**Resolution**:
- Fix issues in new commit
- Test thoroughly in staging
- Redeploy with new version tag

### Getting Help

1. **Check Documentation**:
   - README.md for project overview
   - DEPLOYMENT.md for deployment info
   - docs/ for detailed guides

2. **Review Logs**:
   - GitHub Actions for CI/CD issues
   - Portainer for runtime issues
   - Browser console for frontend issues

3. **Ask Team**:
   - Share error messages
   - Describe what you tried
   - Provide reproduction steps

## Quick Reference

### Common Commands

```bash
# Local development
docker compose -f docker-compose.local.yml up
docker compose -f docker-compose.local.yml up --build
docker compose -f docker-compose.local.yml down

# Git workflow
git checkout -b feature/my-feature
git commit -m "feat: add new feature"
git push origin feature/my-feature
gh pr create --base develop

# Production release
git checkout main && git merge develop
git tag -a v1.1.0 -m "Release notes"
git push origin v1.1.0

# Deployment monitoring
gh run list
gh run watch
curl https://villasboats.mcg.sh/api/actuator/health

# Emergency rollback
# Update VERSION in Portainer to previous version
# Or: gh workflow run deploy-production.yml -f version=v1.0.0
```

### Environment URLs

- **Local**: http://localhost:3000 (frontend), http://localhost:8080 (backend)
- **Staging**: https://villasboats.mcg.sh
- **Production**: https://villasboats.com

### Key Files

- `docker-compose.local.yml`: Local development configuration
- `.env.staging`: Local environment variables (not committed)
- `backend/.env.staging.example`: Template for environment variables
- `pom.xml`: Backend dependencies
- `package.json`: Frontend dependencies

## References

- [Deployment Strategy](./deployment-strategy.md): Overall deployment approach
- [Production Deployment Guide](./production-deployment.md): Step-by-step production deployment
- [Rollback Procedures](./rollback-procedures.md): Emergency rollback steps
- [Main Deployment Docs](../DEPLOYMENT.md): Comprehensive deployment documentation
- [Semantic Versioning](https://semver.org/): Versioning specification
- [Conventional Commits](https://www.conventionalcommits.org/): Commit message format
