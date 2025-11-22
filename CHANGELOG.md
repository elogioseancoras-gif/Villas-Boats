# Changelog

All notable changes to the Villas Boats project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Production deployment workflow with semantic versioning
- Manual approval gate for production deployments
- Comprehensive deployment documentation suite
- Local development docker-compose configuration
- Environment variable security improvements

### Changed
- Staging environment now explicitly uses `develop` Docker image tag
- Updated .gitignore patterns for .env file security
- Enhanced deployment documentation structure

### Security
- Removed .env files from git tracking
- Created .env.example templates for all environments
- Implemented comprehensive .env exclusion patterns

## [0.1.0] - 2024-XX-XX

### Added
- Initial project setup
- Spring Boot 3.4.1 backend with PostgreSQL 18
- Next.js 15.1.6 frontend
- Redis 7 caching layer
- Docker containerization for all services
- GitHub Actions CI/CD for staging auto-deployment
- Portainer integration for container management
- Traefik reverse proxy with SSL

### Infrastructure
- Three-tier deployment architecture (local/staging/production)
- Automated staging deployment on push to `develop`
- Health check monitoring for all services
- Resource limits and reservations for production

### Documentation
- Deployment guide for staging environment
- Environment setup instructions
- Docker Compose configurations

---

## Version Guidelines

### Version Format

**vMAJOR.MINOR.PATCH** (e.g., v1.2.3)

### Version Types

**MAJOR** - Incompatible changes:
- Breaking API changes
- Database schema breaking changes
- Major architecture changes
- Removal of deprecated features

**MINOR** - Backward-compatible features:
- New features
- New API endpoints
- UI enhancements
- Database schema additions (non-breaking)

**PATCH** - Backward-compatible fixes:
- Bug fixes
- Security patches
- Performance improvements (no API changes)
- Documentation updates

### Changelog Categories

**Added** - New features
**Changed** - Changes in existing functionality
**Deprecated** - Soon-to-be removed features
**Removed** - Removed features
**Fixed** - Bug fixes
**Security** - Security vulnerability fixes

### Example Entry Template

```markdown
## [1.0.0] - 2024-XX-XX

### Added
- User authentication with JWT
- Boat catalog and search functionality
- Booking management system
- Admin dashboard

### Changed
- Improved database query performance for boat search
- Updated API response format for consistency

### Deprecated
- Legacy /api/v1/boats endpoint (use /api/boats instead)

### Removed
- Temporary test endpoints

### Fixed
- Login timeout issue after 5 minutes of inactivity
- Responsive design on tablet devices
- Search pagination edge cases

### Security
- Patched SQL injection vulnerability in search
- Updated dependencies to address CVE-XXXX-XXXXX
```

## Release Process

1. **Update CHANGELOG.md**:
   - Move changes from [Unreleased] to new version section
   - Add release date
   - Create new [Unreleased] section

2. **Create Git Tag**:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0: [Brief description]"
   git push origin v1.0.0
   ```

3. **GitHub Release**:
   - Create release from tag on GitHub
   - Copy changelog entry to release notes
   - Attach any release artifacts

## References

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [Deployment Strategy](docs/deployment-strategy.md)
- [Production Deployment Guide](docs/production-deployment.md)
