# Villas Boats

Full-stack boat rental and booking management system with automated staging deployment and controlled production releases.

## Overview

Villas Boats is a modern web application for managing boat rentals, bookings, and customer relationships. The system features:

- **Backend**: Spring Boot 3.4.1 REST API with PostgreSQL 18 and Redis 7
- **Frontend**: Next.js 15.1.6 with server-side rendering and responsive design
- **Automation**: N8N workflow integration for booking notifications
- **Infrastructure**: Dockerized deployment with Traefik reverse proxy and Let's Encrypt SSL

## Architecture

### Technology Stack

**Backend**:
- Java 21 with Spring Boot 3.4.1
- PostgreSQL 18 (database)
- Redis 7 (caching)
- Flyway (database migrations)
- JWT authentication
- Spring Boot Actuator (health checks)

**Frontend**:
- Next.js 15.1.6
- React Server Components
- TypeScript
- Tailwind CSS
- Server-side rendering

**Infrastructure**:
- Docker & Docker Compose
- Traefik (reverse proxy, SSL termination)
- Portainer (container management)
- GitHub Actions (CI/CD)
- GitHub Container Registry (Docker images)

**Automation**:
- N8N (workflow automation)
- Email notifications via SMTP
- Webhook integrations

### Deployment Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   Local     │────▶│   Staging   │────▶│  Production  │
│ Development │     │  (develop)  │     │   (v1.x.x)   │
└─────────────┘     └─────────────┘     └──────────────┘
    Manual           Auto-deploy          Manual approval
   Testing          on push              on git tag
```

**Environments**:

- **Local**: http://localhost:3000 - Individual developer testing
- **Staging**: https://villasboats.mcg.sh - Automated integration testing
- **Production**: https://villasboats.com - Live user-facing application

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git
- Text editor (VS Code recommended)

### Local Development Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/elogioseancoras-gif/villas-boats.git
   cd villas-boats
   ```

2. **Configure Environment**:
   ```bash
   # Copy environment template
   cp backend/.env.staging.example .env.staging

   # Edit with your values (use placeholders for local dev)
   nano .env.staging
   ```

   Required values:
   - Database credentials (DB_NAME, DB_USER, DB_PASSWORD)
   - Redis password (REDIS_PASSWORD)
   - JWT secret key (JWT_SECRET_KEY) - Generate with: `openssl rand -base64 32`

3. **Start Local Stack**:
   ```bash
   docker compose -f docker-compose.local.yml up
   ```

4. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Backend Health: http://localhost:8080/api/actuator/health
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

### Development Workflow

See [docs/developer-workflow.md](docs/developer-workflow.md) for complete development workflow documentation.

**Quick workflow**:
1. Create feature branch from `develop`
2. Develop and test locally
3. Push and create PR to `develop`
4. Automatic deployment to staging
5. Verify in staging
6. Merge to `main` for production release

## Versioning and Releases

### Semantic Versioning

This project follows **Semantic Versioning 2.0.0**: **vMAJOR.MINOR.PATCH**

- **MAJOR** (v2.0.0): Breaking changes, incompatible API changes
- **MINOR** (v1.1.0): New features, backward-compatible functionality
- **PATCH** (v1.0.1): Bug fixes, backward-compatible fixes

**Examples**:
```bash
v1.0.0  # First production release
v1.0.1  # Bug fix release
v1.1.0  # New booking feature added
v2.0.0  # Breaking API changes
```

### Release Process

**Staging** (Automatic):
- Push to `develop` branch
- GitHub Actions builds `develop` tag
- Auto-deploys to https://villasboats.mcg.sh

**Production** (Manual Approval):
1. Merge `develop` to `main`
2. Create git tag: `git tag -a v1.0.0 -m "Release notes"`
3. Push tag: `git push origin v1.0.0`
4. GitHub Actions builds production images
5. Manual approval required in GitHub UI
6. Deploy to https://villasboats.com

See [docs/deployment-strategy.md](docs/deployment-strategy.md) for complete deployment strategy.

## Project Structure

```
villas-boats/
├── .github/
│   └── workflows/          # CI/CD workflows
│       ├── deploy-staging.yml
│       └── deploy-production.yml
├── backend/                # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Java source code
│   │   │   └── resources/  # Application config
│   │   └── test/           # Test cases
│   ├── pom.xml             # Maven dependencies
│   └── Dockerfile
├── frontend/               # Next.js app
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities
│   ├── package.json
│   └── Dockerfile
├── docs/                   # Documentation
│   ├── deployment-strategy.md
│   ├── production-deployment.md
│   ├── rollback-procedures.md
│   └── developer-workflow.md
├── docker-compose.local.yml       # Local development
├── docker-compose.staging.yml     # Staging deployment
├── docker-compose.production.yml  # Production deployment
├── DEPLOYMENT.md           # Deployment guide
├── CHANGELOG.md            # Version history
└── README.md               # This file
```

## Documentation

### Deployment Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Comprehensive deployment guide for staging
- **[docs/deployment-strategy.md](docs/deployment-strategy.md)**: Three-tier deployment strategy
- **[docs/production-deployment.md](docs/production-deployment.md)**: Step-by-step production deployment
- **[docs/rollback-procedures.md](docs/rollback-procedures.md)**: Emergency rollback procedures
- **[docs/developer-workflow.md](docs/developer-workflow.md)**: Development to production workflow

### API Documentation

- Health Check: `/api/actuator/health`
- Application Info: `/api/actuator/info`
- API Base: `/api/`

## Features

### User Features

- **Boat Catalog**: Browse available boats with search and filtering
- **Booking System**: Create and manage boat reservations
- **User Authentication**: Secure JWT-based authentication
- **Responsive Design**: Mobile-friendly interface
- **Image Gallery**: Upload and view boat photos

### Admin Features

- **Admin Dashboard**: Manage boats, bookings, and users
- **Booking Management**: Approve, modify, and track reservations
- **Analytics**: View booking statistics and trends
- **User Management**: Manage user accounts and permissions

### Automation

- **Email Notifications**: Automated booking confirmations and updates via N8N
- **Webhook Integration**: N8N workflow triggers for booking events
- **Health Monitoring**: Automated health checks and alerts

## Technology Highlights

### Performance

- **Redis Caching**: Fast data retrieval for frequently accessed data
- **Database Indexing**: Optimized queries for search and filtering
- **Docker Resource Limits**: Controlled resource usage in production
- **CDN-Ready**: Static assets optimized for CDN delivery

### Security

- **HTTPS Only**: All traffic encrypted with Let's Encrypt
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured allowed origins
- **Security Headers**: HSTS, X-Frame-Options, CSP
- **Rate Limiting**: Protection against abuse (100 req/s average, 200 burst)
- **Database Security**: Strong passwords, no root access
- **Container Security**: Non-root users, minimal images

### Reliability

- **Health Checks**: Automatic container health monitoring
- **Auto-Restart**: Failed containers restart automatically
- **Database Migrations**: Flyway-managed schema versioning
- **Rollback Capability**: Quick rollback to previous versions
- **Resource Reservations**: Guaranteed minimum resources

## Environment Variables

### Required Variables

**Database**:
```bash
DB_NAME=villas_boats_production
DB_USER=villasboats
DB_PASSWORD=<secure-password>
```

**Redis**:
```bash
REDIS_PASSWORD=<secure-password>
```

**Authentication**:
```bash
JWT_SECRET_KEY=<256-bit-key>  # Generate: openssl rand -base64 32
```

**Docker Registry**:
```bash
DOCKER_REGISTRY=ghcr.io
DOCKER_REPO=elogioseancoras-gif/villas-boats
VERSION=v1.0.0  # or 'develop' for staging
```

See `backend/.env.staging.example` for complete list.

## Contributing

### Branch Strategy

- **`main`**: Production-ready code (protected)
- **`develop`**: Integration branch (auto-deploys to staging)
- **`feature/*`**: Feature branches
- **`fix/*`**: Bug fix branches
- **`hotfix/*`**: Production hotfix branches (branch from main)

### Commit Message Format

Use conventional commits:

```
feat: add boat availability calendar
fix: resolve login timeout issue
docs: update deployment guide
refactor: optimize database queries
test: add booking validation tests
chore: update dependencies
```

### Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Push and create PR to `develop`
4. Address code review feedback
5. Merge to `develop` (auto-deploys to staging)
6. Verify in staging
7. Ready for production release

## Deployment

### Quick Deployment Commands

**Local**:
```bash
docker compose -f docker-compose.local.yml up
```

**Staging** (automatic):
```bash
git push origin develop
# Automatic deployment to https://villasboats.mcg.sh
```

**Production**:
```bash
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release notes"
git push origin v1.0.0
# Manual approval in GitHub Actions required
```

### Monitoring

**Staging**:
- Frontend: https://villasboats.mcg.sh
- Backend Health: https://villasboats.mcg.sh/api/actuator/health

**Production**:
- Frontend: https://villasboats.com
- Backend Health: https://api.villasboats.com/actuator/health

## Troubleshooting

### Local Development Issues

**Containers won't start**:
```bash
# Check logs
docker compose -f docker-compose.local.yml logs

# Clean restart
docker compose -f docker-compose.local.yml down -v
docker compose -f docker-compose.local.yml up --build
```

**Port conflicts**:
```bash
# Check what's using port
lsof -i :3000
lsof -i :8080

# Kill process
kill -9 <PID>
```

**Database connection errors**:
```bash
# Verify .env.staging has correct credentials
cat .env.staging

# Check PostgreSQL is running
docker ps | grep postgres
```

### Deployment Issues

See [docs/rollback-procedures.md](docs/rollback-procedures.md) for emergency rollback procedures.

**Quick rollback**:
1. Navigate to Portainer
2. Update VERSION to previous version
3. Click "Update the stack" + "Re-pull image and redeploy"

## Support

For issues and questions:

1. **Check Documentation**: Review docs/ folder
2. **Review Logs**: Check container logs in Portainer
3. **GitHub Issues**: https://github.com/elogioseancoras-gif/villas-boats/issues

## License

[Add your license information here]

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.

---

**Project Status**: Active Development
**Current Version**: See [CHANGELOG.md](CHANGELOG.md)
**Documentation Version**: 1.0
**Last Updated**: 2025-01-22
