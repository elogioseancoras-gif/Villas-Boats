# Rollback Procedures - Villas Boats

Emergency rollback and recovery procedures for production deployments.

## Table of Contents

- [When to Rollback](#when-to-rollback)
- [Rollback Methods](#rollback-methods)
- [Immediate Rollback (Emergency)](#immediate-rollback-emergency)
- [Planned Rollback](#planned-rollback)
- [Database Rollback](#database-rollback)
- [Verification After Rollback](#verification-after-rollback)
- [Post-Rollback Analysis](#post-rollback-analysis)

## When to Rollback

### Critical Issues (Immediate Rollback Required)

- **System Down**: Application completely unavailable (500 errors, crashes)
- **Data Loss Risk**: Database corruption or data integrity issues
- **Security Breach**: Critical security vulnerability actively exploited
- **Critical Feature Broken**: Core functionality (auth, payments, bookings) non-functional
- **Performance Degradation**: >50% increase in response times, timeouts

### Major Issues (Rollback Recommended)

- **Significant Bugs**: Multiple important features broken
- **User Impact**: Large number of user complaints or reports
- **Integration Failures**: Third-party services not working
- **Data Inconsistency**: Incorrect data being displayed or stored

### Minor Issues (Fix Forward Instead)

- **UI Bugs**: Visual glitches, non-critical display issues
- **Small Feature Bugs**: Non-essential features with workarounds
- **Performance Issues**: Minor slowdowns that don't affect usability
- **Isolated Errors**: Affecting small subset of users

## Rollback Methods

### Method 1: Portainer Quick Rollback (Fastest - 2 minutes)

**Use when**: Need immediate recovery, previous version is known stable

**Steps**:

1. **Access Portainer**: https://portainer.mcg.sh
2. **Navigate to Stack**: Stacks → villas-boats-production
3. **Update VERSION Variable**:
   - Find `VERSION` in environment variables
   - Change from current (e.g., `v1.2.0`) to previous stable (e.g., `v1.1.0`)
   - Click "Update the stack"
4. **Select Re-pull and Redeploy**: Enable "Re-pull image and redeploy"
5. **Click Update**: Stack will redeploy with previous version

**Duration**: ~2 minutes
**Downtime**: ~30 seconds (rolling update)

### Method 2: GitHub Actions Rollback (Safer - 10 minutes)

**Use when**: Want proper git history and approval gates

**Steps**:

1. **Trigger Workflow**:
   ```bash
   # Using GitHub CLI
   gh workflow run deploy-production.yml -f version=v1.1.0

   # Or manually at:
   # https://github.com/elogioseancoras-gif/villas-boats/actions/workflows/deploy-production.yml
   # Click "Run workflow" → Enter previous version
   ```

2. **Approve Deployment**:
   - Wait for build to complete (~5 minutes)
   - Review deployment in GitHub Actions
   - Click "Review deployments" → "Approve and deploy"

3. **Verify Portainer Update**:
   - Update VERSION in Portainer (if webhook not configured)
   - Or wait for webhook to trigger

**Duration**: ~10 minutes
**Downtime**: ~30 seconds

### Method 3: Git Revert Rollback (Complete - 15 minutes)

**Use when**: Want to preserve full history and maintain clean git state

**Steps**:

1. **Identify Problematic Commit**:
   ```bash
   git log --oneline -10
   # Find the commit that introduced issues
   ```

2. **Create Revert Commit**:
   ```bash
   git checkout main
   git pull origin main

   # Revert the problematic commit
   git revert <commit-sha>

   # Or revert a range of commits
   git revert <oldest-sha>^..<newest-sha>

   git push origin main
   ```

3. **Create Rollback Tag**:
   ```bash
   git tag -a v1.1.1 -m "Rollback: Revert v1.2.0 due to critical authentication bug

   This release reverts changes from v1.2.0 and restores v1.1.0 functionality.

   Reverted changes:
   - New authentication flow (causing login failures)
   - Redis session management changes

   Investigation:
   - Issue: Users unable to login after upgrade
   - Root cause: JWT token validation failing
   - Fix planned: Proper testing in staging before retry"

   git push origin v1.1.1
   ```

4. **Deploy via GitHub Actions**: Approve deployment as normal

**Duration**: ~15 minutes
**Downtime**: ~30 seconds

## Immediate Rollback (Emergency)

### Emergency Checklist

**Preparation (30 seconds):**

- [ ] Identify previous stable version (check git tags or Portainer history)
- [ ] Open Portainer in browser
- [ ] Have rollback command ready

**Execution (1 minute):**

```bash
# Option 1: Portainer UI
# 1. Navigate to villas-boats-production stack
# 2. Update VERSION to previous version
# 3. Click "Update the stack" + "Re-pull image and redeploy"

# Option 2: GitHub Actions
gh workflow run deploy-production.yml -f version=v1.1.0
```

**Verification (2 minutes):**

```bash
# Check health
curl https://api.villasboats.com/actuator/health

# Expected: {"status":"UP"}

# Check version
curl https://api.villasboats.com/actuator/info | jq '.build.version'

# Test critical functionality
# - Login works
# - Homepage loads
# - API responding
```

### Emergency Communication Template

```markdown
**PRODUCTION INCIDENT - ROLLBACK IN PROGRESS**

**Time**: [UTC timestamp]
**Severity**: Critical
**Status**: Rolling back to v1.1.0

**Issue**: [Brief description]
**Impact**: [User impact description]
**Action**: Reverting to previous stable version

**ETA**: 2-3 minutes
**Updates**: Will provide update when rollback complete

---

**ROLLBACK COMPLETE**

**Time**: [UTC timestamp]
**Version**: v1.1.0 restored
**Status**: ✅ Services healthy

**Verification**:
- ✅ Health checks passing
- ✅ Login functional
- ✅ Homepage loading
- ✅ API responding

**Next Steps**:
- Monitor for 30 minutes
- Investigate root cause
- Plan fix and redeployment
```

## Planned Rollback

### Scenario: Non-Emergency Controlled Rollback

**Use when**: Issues found post-deployment but system is still functional

**Planning Phase (10 minutes):**

1. **Document Issues**:
   - List all known problems
   - Assess user impact
   - Determine if rollback is necessary

2. **Identify Rollback Point**:
   ```bash
   # Review git history
   git log --oneline -20

   # Check available tags
   git tag -l

   # Verify previous version in container registry
   docker pull ghcr.io/elogioseancoras-gif/villas-boats/backend:v1.1.0
   ```

3. **Plan Communication**:
   - Notify team
   - Prepare user communication (if needed)
   - Schedule rollback window

**Execution Phase (15 minutes):**

1. **Create Rollback Tag** (recommended):
   ```bash
   git checkout main
   git checkout <previous-stable-commit>

   git tag -a v1.1.1 -m "Rollback: Version v1.1.1 (rollback from v1.2.0)

   Reason for rollback:
   - Performance degradation in booking system
   - Intermittent Redis connection failures
   - Search functionality returning incorrect results

   This version restores the stable v1.1.0 codebase.

   Issues will be fixed and redeployed after thorough testing."

   git push origin v1.1.1
   ```

2. **Deploy via Standard Process**:
   - GitHub Actions workflow triggered by tag
   - Manual approval (review rollback justification)
   - Portainer update (automatic via webhook)

3. **Monitor Deployment**:
   ```bash
   # Watch GitHub Actions
   gh run watch

   # Monitor health
   watch -n 5 'curl -s https://api.villasboats.com/actuator/health'
   ```

**Verification Phase (10 minutes):**

- [ ] Health checks pass
- [ ] Critical functionality tested
- [ ] Performance metrics normal
- [ ] Error rates back to baseline
- [ ] User reports monitored

## Database Rollback

### ⚠️ WARNING

Database rollbacks are complex and risky. Consider:
- **Data loss**: Reverting migrations may lose data
- **Incompatibility**: Old code may not work with new schema
- **Downtime**: Database rollbacks require application downtime

### Strategy 1: Application Rollback Only (Preferred)

**Use when**: New code is incompatible but database changes are backward-compatible

**Steps**:

1. Rollback application to previous version (methods above)
2. Leave database schema as-is (no migration rollback)
3. Verify old application works with new schema

**Advantage**: No data loss, minimal risk

### Strategy 2: Flyway Migration Undo (Careful)

**Use when**: Database changes must be reverted

**Prerequisites**:
- Flyway undo migrations exist (V1.1__undo_something.sql)
- Database backup available
- Testing completed in staging

**Steps**:

1. **Backup Database First**:
   ```bash
   # Export current production database
   docker exec villas-boats-postgres-production \
     pg_dump -U villasboats villas_boats > backup-pre-rollback.sql

   # Copy backup to safe location
   cp backup-pre-rollback.sql /backup/$(date +%Y%m%d-%H%M%S)-pre-rollback.sql
   ```

2. **Application Downtime** (required):
   ```bash
   # Stop backend to prevent writes
   docker stop villas-boats-backend-production
   ```

3. **Run Flyway Undo**:
   ```bash
   # Connect to backend container or run locally
   cd backend

   # Undo last migration
   ./mvnw flyway:undo -Dflyway.target=<previous_version>

   # Verify migration status
   ./mvnw flyway:info
   ```

4. **Deploy Previous Application Version**:
   ```bash
   # Update VERSION in Portainer to previous version
   # This will restart backend automatically
   ```

5. **Verify Database Consistency**:
   ```sql
   -- Check critical tables
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM boats;
   SELECT COUNT(*) FROM bookings;

   -- Verify data integrity
   -- Check for orphaned records
   -- Verify foreign key constraints
   ```

**Duration**: 15-30 minutes
**Downtime**: 10-20 minutes

### Strategy 3: Database Restore from Backup (Nuclear Option)

**Use when**: Database corruption or critical data issues

**⚠️ EXTREME CAUTION**: This loses all data since backup

**Steps**:

1. **Confirm Backup Availability**:
   ```bash
   # List available backups
   ls -lh /backup/*.sql

   # Verify backup integrity
   head -20 /backup/backup-pre-v1.2.0.sql
   ```

2. **Application Downtime**:
   ```bash
   # Stop all services
   docker stop villas-boats-backend-production
   docker stop villas-boats-frontend-production
   ```

3. **Restore Database**:
   ```bash
   # Drop and recreate database
   docker exec -it villas-boats-postgres-production psql -U villasboats -c "DROP DATABASE villas_boats;"
   docker exec -it villas-boats-postgres-production psql -U villasboats -c "CREATE DATABASE villas_boats;"

   # Restore from backup
   docker exec -i villas-boats-postgres-production \
     psql -U villasboats villas_boats < /backup/backup-pre-v1.2.0.sql
   ```

4. **Deploy Previous Application Version**:
   ```bash
   # Update VERSION in Portainer
   # Restart all services
   ```

5. **Data Loss Assessment**:
   - Identify what data was lost (time window)
   - Notify affected users
   - Plan data recovery if possible

**Duration**: 30-60 minutes
**Downtime**: 30-60 minutes
**Data Loss**: All changes since backup

## Verification After Rollback

### Automated Checks

```bash
# Health check
curl https://api.villasboats.com/actuator/health
# Expected: {"status":"UP"}

# Version verification
curl https://api.villasboats.com/actuator/info | jq '.build.version'
# Expected: Previous version number

# Basic functionality
curl -I https://villasboats.com
# Expected: HTTP/2 200
```

### Manual Testing Checklist

**Critical Functionality** (5 minutes):

- [ ] Homepage loads
- [ ] User login works
- [ ] Boat search functions
- [ ] Booking creation works
- [ ] Admin dashboard accessible
- [ ] API responds to requests

**Performance** (5 minutes):

- [ ] Response times back to normal (<2s for pages)
- [ ] API latency acceptable (<500ms)
- [ ] No timeout errors
- [ ] Database queries performing well

**Data Integrity** (10 minutes):

- [ ] User accounts intact
- [ ] Bookings display correctly
- [ ] Boat listings complete
- [ ] Images load properly
- [ ] No data corruption visible

### Monitoring (30 minutes)

Monitor these metrics after rollback:

```bash
# Error rates (should drop to near-zero)
# Check backend logs for exceptions

# Response times (should normalize)
# Homepage: < 2 seconds
# API: < 500ms

# Resource usage (should stabilize)
# CPU: < 50%
# Memory: Within limits
# Database connections: Stable
```

## Post-Rollback Analysis

### Immediate Actions (Within 1 Hour)

1. **Document Incident**:
   ```markdown
   ## Incident Report: v1.2.0 Rollback

   **Date**: 2024-XX-XX
   **Duration**: X minutes downtime
   **Versions**: Rolled back v1.2.0 → v1.1.0

   **Timeline**:
   - XX:XX - Deployment of v1.2.0 completed
   - XX:XX - Issues first reported
   - XX:XX - Decision to rollback made
   - XX:XX - Rollback initiated
   - XX:XX - Services restored

   **Issues**:
   - [Detailed description of problems]

   **Root Cause**:
   - [Analysis of what went wrong]

   **Impact**:
   - Users affected: [number]
   - Downtime: [duration]
   - Data lost: [if any]
   ```

2. **Team Communication**:
   - Notify all stakeholders of rollback completion
   - Explain what happened and why
   - Outline next steps

3. **User Communication** (if needed):
   - Acknowledge the issue
   - Explain resolution (without technical details)
   - Apologize for inconvenience

### Investigation Phase (Within 24 Hours)

1. **Root Cause Analysis**:
   - Review code changes between versions
   - Analyze logs and error messages
   - Reproduce issue in staging
   - Identify what was missed in testing

2. **Prevention Planning**:
   - What tests would have caught this?
   - What monitoring would have detected it sooner?
   - What deployment practices need improvement?

3. **Fix Planning**:
   - Develop fix for original issue
   - Plan additional testing
   - Schedule redeployment

### Documentation Updates

Update these documents based on learnings:

- [ ] [production-deployment.md](./production-deployment.md): Add verification steps
- [ ] [developer-workflow.md](./developer-workflow.md): Update testing requirements
- [ ] This file (rollback-procedures.md): Add new scenarios or improvements
- [ ] Project CHANGELOG.md: Document the rollback

### Lessons Learned Template

```markdown
## Lessons Learned: v1.2.0 Rollback

### What Went Well
- Quick detection of issues (X minutes)
- Fast rollback execution (X minutes)
- Clear communication with team
- No data loss

### What Could Be Improved
- Testing in staging didn't catch [issue]
- Monitoring didn't alert on [metric]
- Deployment checklist missing [step]

### Action Items
1. [ ] Add [specific test] to test suite
2. [ ] Implement monitoring for [metric]
3. [ ] Update deployment checklist with [item]
4. [ ] Document [edge case] in testing guide

### Prevention Measures
- Enhanced staging testing protocol
- Additional monitoring alerts
- Extended soak testing period
- Load testing requirements
```

## Rollback Decision Matrix

Use this to decide between rollback vs. fix-forward:

| Severity | User Impact | Data Risk | Recommendation | Method |
|----------|-------------|-----------|----------------|---------|
| Critical | All users | High | Immediate Rollback | Portainer (2 min) |
| Critical | All users | Low | Immediate Rollback | Portainer (2 min) |
| Major | >50% users | High | Rollback | GitHub Actions (10 min) |
| Major | >50% users | Low | Rollback or Fix | Assess fix time |
| Major | <50% users | High | Rollback | GitHub Actions (10 min) |
| Major | <50% users | Low | Fix Forward | Hotfix deployment |
| Minor | Any | High | Rollback | Planned rollback |
| Minor | Any | Low | Fix Forward | Hotfix deployment |

## Best Practices

### Rollback Readiness

1. ✅ Always know previous stable version
2. ✅ Have rollback commands documented and tested
3. ✅ Maintain recent database backups
4. ✅ Test rollback procedure in staging regularly
5. ✅ Keep Portainer credentials accessible
6. ✅ Document decision criteria for rollback

### During Rollback

1. ✅ Communicate clearly and promptly
2. ✅ Follow documented procedures
3. ✅ Verify each step before proceeding
4. ✅ Monitor continuously during and after
5. ✅ Document everything
6. ✅ Preserve logs and evidence

### After Rollback

1. ✅ Conduct thorough post-mortem
2. ✅ Update documentation with learnings
3. ✅ Fix root cause before redeploying
4. ✅ Add tests to prevent recurrence
5. ✅ Review deployment process
6. ✅ Share lessons with team

## References

- [Production Deployment Guide](./production-deployment.md)
- [Deployment Strategy](./deployment-strategy.md)
- [Developer Workflow](./developer-workflow.md)
- [Main Deployment Documentation](../DEPLOYMENT.md)
