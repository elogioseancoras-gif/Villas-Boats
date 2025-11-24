# Staging Environment Credentials

## Admin Dashboard Access

**URL:** https://villasboats.mcg.sh

**Admin User:**
- Email: `admin@villasboats.com`
- Password: `Admin123!`
- Role: `ADMIN`

## API Endpoints

**Base URL:** https://villasboats.mcg.sh/api

**Login Endpoint:** `/auth/login`

**Example Login Request:**
```bash
curl -X POST https://villasboats.mcg.sh/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@villasboats.com","password":"Admin123!"}'
```

## Database Access

**Database Name:** `villas_boats_staging`
**User:** `villasboats`

**Connect via Docker:**
```bash
ssh -i ~/.ssh/id_mcg.sh debian@mcg.sh "docker exec -it villas-boats-postgres-staging psql -U villasboats -d villas_boats_staging"
```

## Notes

- Password hash generated using BCrypt with 10 rounds
- Hash format: `$2b$10$...` (Python bcrypt standard, compatible with Spring Security)
- JWT tokens expire after 86400 seconds (24 hours)
- API context path is `/api` (all endpoints prefixed)

**Last Updated:** 2025-11-24
