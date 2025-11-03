# Villas Boats Backend

Spring Boot REST API for the Villas Boats boat rental platform.

## Technology Stack

- **Java**: 21 LTS
- **Spring Boot**: 3.3.5
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Build Tool**: Maven
- **Architecture**: Hexagonal/Clean Architecture
- **Security**: JWT Authentication
- **Documentation**: OpenAPI 3.0 (Swagger)
- **Deployment**: Docker & Docker Compose

## Prerequisites

- Java 21 (OpenJDK or Oracle JDK)
- Maven 3.9+
- Docker & Docker Compose (for local development)
- PostgreSQL 16 (if running locally without Docker)
- Redis 7 (if running locally without Docker)

## Quick Start

### Using Docker Compose (Recommended)

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services**:
   ```bash
   docker-compose up -d
   ```

4. **Check logs**:
   ```bash
   docker-compose logs -f backend
   ```

5. **Access the application**:
   - API: http://localhost:8080/api
   - Swagger UI: http://localhost:8080/api/swagger-ui.html
   - API Docs: http://localhost:8080/api/v3/api-docs

### Local Development (Without Docker)

1. **Start PostgreSQL and Redis** (via Docker):
   ```bash
   docker-compose up postgres redis -d
   ```

2. **Build the project**:
   ```bash
   mvn clean install
   ```

3. **Run the application**:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

## Project Structure

```
src/main/java/com/villasboats/
├── domain/                    # Domain layer (entities, value objects)
│   ├── entity/               # JPA entities
│   ├── repository/           # Repository interfaces
│   └── valueobject/          # Value objects
├── application/              # Application layer (use cases)
│   ├── usecase/             # Business logic use cases
│   ├── dto/                 # Data Transfer Objects
│   ├── mapper/              # MapStruct mappers
│   └── service/             # Application services
├── infrastructure/           # Infrastructure layer
│   ├── persistence/         # JPA implementations
│   ├── security/            # Security configuration
│   ├── config/              # Spring configuration
│   └── storage/             # File storage implementations
├── presentation/             # Presentation layer
│   ├── controller/          # REST controllers
│   └── advice/              # Exception handlers
└── common/                   # Shared utilities
    ├── exception/           # Custom exceptions
    └── util/                # Utility classes
```

## Database Migrations

Database migrations are managed with Flyway. Migration scripts are located in:
```
src/main/resources/db/migration/
```

Migrations run automatically on application startup.

## API Documentation

API documentation is available via Swagger UI:
- **Development**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/v3/api-docs

## Environment Variables

Key environment variables (see `.env.example` for complete list):

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `dev` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `villas_boats` |
| `DB_USER` | Database user | `villasboats` |
| `DB_PASSWORD` | Database password | - |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET_KEY` | JWT signing key | - |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |

## Testing

Run all tests:
```bash
mvn test
```

Run with coverage:
```bash
mvn test jacoco:report
```

## Building for Production

Build the Docker image:
```bash
docker build -t villasboats/backend:1.0.0 .
```

Deploy with production compose file:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Deployment to Portainer

1. **Build and tag image**:
   ```bash
   docker build -t villasboats/backend:1.0.0 .
   docker tag villasboats/backend:1.0.0 your-registry/villasboats/backend:1.0.0
   docker push your-registry/villasboats/backend:1.0.0
   ```

2. **Create stack in Portainer**:
   - Upload `docker-compose.prod.yml`
   - Configure environment variables
   - Deploy stack

3. **Configure NGINX** with SSL certificates for production domain

## Health Checks

- **Application Health**: GET `/api/actuator/health`
- **Database Connection**: Verified via health endpoint
- **Redis Connection**: Verified via health endpoint

## Logging

Logs are written to:
- **Development**: Console output
- **Production**: `/var/log/villas-boats/application.log`

Log levels can be configured via `application.yml` or environment variables.

## Security

- JWT-based authentication
- BCrypt password hashing
- CORS configuration
- Rate limiting (via NGINX in production)
- HTTPS enforcement (production)

## Support

For issues or questions, please contact the development team.

## License

Proprietary - Villas Boats © 2025
