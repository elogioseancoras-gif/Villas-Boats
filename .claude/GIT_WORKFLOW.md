# Git Workflow for Claude Code

**Purpose**: Self-guidance prompt for Claude's version control behavior in the Villas Boats project

**Last Updated**: 2025-11-07

---

## Repository Structure

### Branch Model (Simplified Gitflow for 2 Developers)

```
main (remote only)
  └─ HTML legacy site (NEVER TOUCH - preserved content)

develop (primary application branch)
  ├─ feature/* (new features)
  ├─ hotfix/* (urgent bug fixes)
  └─ chore/* (maintenance tasks)
```

### Critical Rules

1. **NEVER commit to or merge into `main` branch** - It contains legacy HTML site
2. **ALWAYS work from `develop` branch** - This is the application codebase
3. **ALWAYS create feature/hotfix/chore branches** for ANY work
4. **NEVER commit directly to `develop`** - Use PRs for all changes

---

## When to Create Commits

### Auto-Commit Scenarios (Commit Without Asking)

✅ **Documentation updates** - README, docs, markdown files
✅ **Minor code fixes** - Typos, formatting, comments
✅ **Dependency updates** - package.json, pom.xml, lockfiles
✅ **Configuration tweaks** - Small config changes (<10 lines)
✅ **Test additions** - Adding tests without modifying app code

### Ask-First Scenarios (Get User Approval Before Commit)

⚠️ **Feature implementations** - New functionality, components, API endpoints
⚠️ **Refactoring** - Structural changes, file moves, renames
⚠️ **Breaking changes** - API changes, schema updates, interface modifications
⚠️ **Multiple-file changes** - Changes affecting >5 files
⚠️ **Security-related** - Auth, permissions, data protection changes

---

## Workflow Patterns

### Pattern 1: Feature Development

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/descriptive-name

# Work on feature (multiple commits OK)
git add [files]
git commit -m "feat: implement feature part 1"
git commit -m "feat: complete feature implementation"
git commit -m "test: add feature tests"

# Push feature branch
git push -u origin feature/descriptive-name

# Create PR to develop (inform user of PR URL)
```

**Branch naming examples:**
- `feature/admin-dashboard`
- `feature/boat-crud-interface`
- `feature/booking-calendar`
- `feature/payment-integration`

### Pattern 2: Bug Fixes (Hotfix)

```bash
# Start hotfix from develop
git checkout develop
git pull origin develop
git checkout -b hotfix/issue-description

# Fix bug
git add [files]
git commit -m "fix: resolve [specific issue]"
git commit -m "test: verify fix with test"

# Push and create PR
git push -u origin hotfix/issue-description
```

**Branch naming examples:**
- `hotfix/auth-token-expiry`
- `hotfix/booking-form-validation`
- `hotfix/database-connection-leak`

### Pattern 3: Maintenance Tasks

```bash
# Start chore branch
git checkout develop
git pull origin develop
git checkout -b chore/task-description

# Perform maintenance
git add [files]
git commit -m "chore: update dependencies"
# or
git commit -m "chore: improve code formatting"

# Push and create PR
git push -u origin chore/task-description
```

**Branch naming examples:**
- `chore/upgrade-dependencies`
- `chore/cleanup-unused-code`
- `chore/improve-logging`
- `chore/refactor-api-client`

---

## Commit Message Format

### Convention: Conventional Commits

**Format**: `<type>(<scope>): <description>`

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance (deps, config, cleanup)
- `docs:` - Documentation only
- `test:` - Tests only
- `refactor:` - Code restructuring (no behavior change)
- `perf:` - Performance improvement
- `style:` - Code style/formatting

**Scopes** (optional):
- `backend` - Backend Java/Spring code
- `frontend` - Frontend Next.js/React code
- `api` - API changes
- `db` - Database changes
- `auth` - Authentication/authorization
- `admin` - Admin dashboard
- `booking` - Booking system

**Examples:**
```bash
git commit -m "feat(backend): add boat CRUD endpoints"
git commit -m "fix(frontend): correct booking form validation"
git commit -m "chore(backend): upgrade Spring Boot to 3.5.8"
git commit -m "docs: update API documentation"
git commit -m "test(frontend): add E2E tests for booking flow"
```

### Multi-line Commit Messages

For significant changes, use detailed commit messages:

```bash
git commit -m "feat(admin): implement boat management interface

- Add boat list view with pagination
- Add boat create/edit forms
- Add boat delete confirmation
- Integrate with backend CRUD endpoints
- Add responsive design for mobile

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Pull Request Creation

### When to Create PRs

**Always create PR for:**
- Feature branches → develop
- Hotfix branches → develop
- Chore branches → develop (if >3 files changed)

**Skip PR only for:**
- Urgent production hotfixes (with user approval)
- Documentation-only changes (user discretion)

### PR Description Template

```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Maintenance/Chore
- [ ] Documentation

## Changes Made
- Bullet list of specific changes
- What was added/modified/removed

## Testing
- How was this tested?
- Which scenarios were verified?

## Related Issues
Closes #123 (if applicable)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### PR Title Format

Use same convention as commits:
- `feat(admin): add boat management interface`
- `fix(booking): resolve date validation issue`
- `chore(deps): upgrade Next.js to 16.1`

---

## Sync and Update Patterns

### Daily Start (Beginning of Session)

```bash
# Always sync develop at session start
git checkout develop
git pull origin develop

# If already on feature branch
git checkout feature/current-work
git merge develop  # Or: git rebase develop
```

### Before Pushing

```bash
# Ensure feature is up-to-date with develop
git checkout develop
git pull origin develop
git checkout feature/current-work
git merge develop  # Resolve conflicts if any
git push origin feature/current-work
```

---

## Special Scenarios

### Scenario: User Requests "Commit This"

**If on develop branch:**
1. ⚠️ STOP and inform user: "We should create a feature branch first"
2. Create appropriate branch: `git checkout -b [type]/[name]`
3. Stage and commit changes
4. Push branch and inform user

**If on feature branch:**
1. ✅ Proceed with commit
2. Use appropriate commit message format
3. Push to remote

### Scenario: Merge Conflicts

**When conflicts occur:**
1. 🛑 STOP and inform user of conflict
2. Show conflicting files: `git status`
3. Ask user how to proceed:
   - Resolve manually (provide guidance)
   - Abort merge
   - Prefer develop or feature changes

**NEVER auto-resolve conflicts** without user awareness

### Scenario: User Wants to Discard Changes

**Options to present:**
1. `git stash` - Temporarily save changes
2. `git reset --hard` - Permanently discard (⚠️ destructive)
3. `git checkout -- [file]` - Discard specific file
4. Create backup branch first

**ALWAYS warn about destructive operations**

---

## Quality Checks Before Commit

### Pre-Commit Checklist

**Required checks:**
- [ ] No trailing whitespace in modified lines
- [ ] Code compiles without errors (if backend Java changes)
- [ ] No console errors (if frontend changes)
- [ ] Commit message follows convention
- [ ] Changes are on correct branch (NOT develop or main)

**If linter/formatter exists:**
```bash
# Backend
cd backend && mvn checkstyle:check

# Frontend
cd frontend && pnpm lint && pnpm format:check
```

### Pre-Push Checklist

**Before pushing:**
- [ ] All commits have proper messages
- [ ] Branch name follows convention
- [ ] Branch is up-to-date with develop
- [ ] Tests pass (if test suite exists)
- [ ] User is aware PR will be created

---

## Emergency Procedures

### If Committed to Wrong Branch

```bash
# If committed to develop by mistake
git log -1  # Note commit SHA
git reset --hard HEAD~1  # Remove commit
git checkout -b feature/proper-branch  # Create proper branch
git cherry-pick [commit-SHA]  # Apply commit
git push -u origin feature/proper-branch
```

### If Pushed to main by Mistake

⚠️ **STOP IMMEDIATELY**

1. Inform user of critical error
2. Do NOT attempt to fix automatically
3. User must manually revert on GitHub
4. Document what happened in incident report

### If Accidentally Deleted Remote Branch

```bash
# Find deleted branch in reflog
git reflog

# Recreate branch from SHA
git checkout -b [branch-name] [SHA]
git push -u origin [branch-name]
```

---

## Collaboration with User (Human Developer)

### When User Makes Commits

**If user commits to develop:**
1. Pull changes: `git pull origin develop`
2. Inform user of simplified Gitflow recommendation
3. Continue working from current state

**If user creates PR:**
1. Pull develop after merge: `git pull origin develop`
2. Update current feature branch: `git merge develop`
3. Continue work

### When Claude Creates PR

**After creating PR:**
1. Inform user: "PR created at [URL]"
2. Summarize changes in PR
3. Wait for user review
4. Do NOT merge PR automatically

**After user approves PR:**
1. Merge PR via GitHub (or ask user to merge)
2. Delete feature branch remotely
3. Switch to develop and pull:
   ```bash
   git checkout develop
   git pull origin develop
   git branch -d feature/branch-name  # Delete local
   ```

---

## Branch Lifecycle Management

### When to Delete Branches

**Delete after:**
- ✅ PR merged to develop
- ✅ Work abandoned/superseded
- ✅ Branch open for >30 days with no activity

**Keep if:**
- ⏸️ Work in progress
- ⏸️ Awaiting user review
- ⏸️ Experimental/R&D branch

### Cleanup Commands

```bash
# List all branches
git branch -a

# Delete local feature branch
git branch -d feature/old-branch

# Delete remote feature branch
git push origin --delete feature/old-branch

# Prune stale remote references
git fetch --prune
```

---

## Summary: Core Principles

1. ✅ **develop is primary** - All work branches from here
2. 🚫 **Never touch main** - Legacy HTML site preserved
3. 🌿 **Always use branches** - feature/hotfix/chore for all work
4. 💬 **Conventional commits** - Consistent, parseable messages
5. 🔄 **PRs for review** - All merges go through pull requests
6. 🧹 **Keep it clean** - Delete merged branches, stay organized
7. ⚠️ **Ask when unsure** - User approval for significant changes
8. 📋 **Track progress** - Use TodoWrite for multi-step tasks
9. 🔍 **Quality first** - Check, lint, test before commit
10. 🤝 **Communicate clearly** - Inform user of all git operations

---

**This document guides Claude's git behavior. Follow these rules consistently to maintain clean version control and smooth collaboration.**
