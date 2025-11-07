# Contributing to Villas Boats

Welcome! This guide helps you understand our development workflow and contribution process.

## 📋 Table of Contents

- [Branch Structure](#branch-structure)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Getting Help](#getting-help)

---

## 🌳 Branch Structure

We use a simplified Gitflow model optimized for our 2-developer team:

```
main (legacy HTML site - DO NOT TOUCH)
  |
develop (primary application branch)
  |
  ├── feature/*   - New features
  ├── hotfix/*    - Bug fixes
  └── chore/*     - Maintenance tasks
```

### Important Notes

- **`main` branch**: Contains legacy HTML site. Never merge application code here.
- **`develop` branch**: Primary application code. All work branches from here.
- **Working branches**: Always create `feature/`, `hotfix/`, or `chore/` branches for your work.

---

## 🚀 Development Workflow

### Starting New Work

1. **Ensure you're up-to-date:**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create a working branch:**
   ```bash
   # For new features
   git checkout -b feature/descriptive-name

   # For bug fixes
   git checkout -b hotfix/issue-description

   # For maintenance
   git checkout -b chore/task-description
   ```

3. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "type: description of changes"
   ```

4. **Push your branch:**
   ```bash
   git push -u origin your-branch-name
   ```

5. **Create a Pull Request** on GitHub targeting `develop`

### Branch Naming Examples

**Features:**
- `feature/admin-dashboard`
- `feature/boat-calendar-view`
- `feature/payment-integration`
- `feature/user-profile-settings`

**Hotfixes:**
- `hotfix/booking-form-validation`
- `hotfix/auth-token-refresh`
- `hotfix/database-connection-timeout`

**Chores:**
- `chore/upgrade-spring-boot`
- `chore/update-frontend-deps`
- `chore/cleanup-unused-imports`
- `chore/improve-error-logging`

---

## 💬 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for consistent, parseable commit messages.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- **`feat:`** - New feature
- **`fix:`** - Bug fix
- **`chore:`** - Maintenance (dependencies, config, cleanup)
- **`docs:`** - Documentation only
- **`test:`** - Adding or updating tests
- **`refactor:`** - Code restructuring (no behavior change)
- **`perf:`** - Performance improvements
- **`style:`** - Code formatting (no logic change)

### Scopes (Optional)

- `backend` - Java/Spring Boot code
- `frontend` - Next.js/React code
- `api` - REST API changes
- `db` - Database schema/migrations
- `auth` - Authentication/authorization
- `admin` - Admin dashboard
- `booking` - Booking system

### Examples

```bash
# Simple commit
git commit -m "feat(admin): add boat management interface"

# Bug fix
git commit -m "fix(booking): resolve date validation error"

# Maintenance
git commit -m "chore(backend): upgrade Spring Boot to 3.5.8"

# Multi-line commit
git commit -m "feat(booking): implement calendar view

- Add monthly calendar component
- Add date range selection
- Integrate with booking API
- Add responsive design for mobile devices"
```

### Guidelines

- ✅ Use present tense ("add feature" not "added feature")
- ✅ Use imperative mood ("move cursor" not "moves cursor")
- ✅ Keep first line under 72 characters
- ✅ Reference issue numbers when applicable
- ❌ Don't capitalize first letter of description
- ❌ Don't end description with a period

---

## 🔄 Pull Request Process

### Creating a PR

1. **Push your branch** to GitHub
2. **Navigate to the repository** on GitHub
3. **Click "New Pull Request"**
4. **Set base branch** to `develop`
5. **Fill in the PR template** (automatically populated)
6. **Request review** from team member
7. **Wait for approval** before merging

### PR Title Format

Use the same format as commit messages:

```
feat(admin): add boat CRUD interface
fix(booking): resolve calendar date selection bug
chore(deps): upgrade Next.js to 16.1
```

### PR Description

Your PR should include:

- **Summary**: What does this PR do?
- **Type**: Feature / Bug fix / Chore
- **Changes**: List specific changes made
- **Testing**: How was this tested?
- **Screenshots**: For UI changes (optional)
- **Related Issues**: Link to issue numbers if applicable

### Review Process

- **Reviewer**: Check code quality, test coverage, documentation
- **Author**: Address feedback and update PR
- **Merge**: After approval, merge using GitHub's "Squash and merge" (preferred)
- **Cleanup**: Delete feature branch after merge

---

## 🧹 Code Standards

### Backend (Java/Spring Boot)

- **Java 25** with latest Spring Boot 3.x
- **Maven** for dependency management
- **Checkstyle** for code formatting (run before commit)
- **Lombok** for boilerplate reduction
- **MapStruct** for entity-DTO mapping

```bash
# Run checkstyle
cd backend
mvn checkstyle:check

# Run tests
mvn test

# Build
mvn clean install
```

### Frontend (Next.js/React)

- **Next.js 16** with React 19
- **TypeScript** strict mode enabled
- **TailwindCSS 4** for styling
- **pnpm** for package management
- **ESLint** and **Prettier** for code quality

```bash
# Install dependencies
cd frontend
pnpm install

# Lint code
pnpm lint

# Format check
pnpm format:check

# Run dev server
pnpm dev

# Build for production
pnpm build
```

### General Guidelines

- ✅ Write meaningful variable and function names
- ✅ Add comments for complex logic
- ✅ Write tests for new features
- ✅ Keep functions small and focused
- ✅ Follow DRY (Don't Repeat Yourself)
- ✅ Remove console.log statements before commit
- ❌ Don't commit commented-out code
- ❌ Don't commit `.env` files or secrets
- ❌ Don't leave TODO comments without issue references

---

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Exact steps that trigger the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, versions
6. **Screenshots**: If applicable
7. **Error Messages**: Console errors or stack traces

### Feature Requests

When requesting features, include:

1. **Problem**: What problem does this solve?
2. **Solution**: Proposed solution or approach
3. **Alternatives**: Other solutions considered
4. **Impact**: Who benefits and how?

---

## 🧪 Testing

### Running Tests

**Backend:**
```bash
cd backend
mvn test
```

**Frontend:**
```bash
cd frontend
pnpm test
```

**E2E Tests:**
```bash
cd frontend
pnpm exec playwright test
```

### Writing Tests

- Write tests for new features
- Update tests when modifying existing features
- Aim for >80% code coverage
- Test happy path AND error cases
- Use descriptive test names

---

## 📚 Documentation

### What to Document

- **API Changes**: Update API documentation
- **New Features**: Add user-facing documentation
- **Configuration**: Document environment variables
- **Architecture**: Update architecture diagrams if changed
- **Breaking Changes**: Clearly document in PR and CHANGELOG

### Where to Document

- **Code Comments**: For complex logic
- **README.md**: Project setup and overview
- **docs/** folder: Detailed documentation
- **API Documentation**: OpenAPI/Swagger specs
- **This File**: Contribution process updates

---

## 🆘 Getting Help

### Resources

- **GitHub Issues**: Report bugs and request features
- **Pull Requests**: Review existing PRs for examples
- **Documentation**: Check `docs/` folder and README
- **Commit History**: `git log` shows examples of good commits

### Questions?

- Open a GitHub Discussion
- Ask in pull request comments
- Reach out to team members directly

---

## 🎯 Quick Reference

### Daily Workflow

```bash
# Start of day
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# During work
git add .
git commit -m "feat: add feature"

# End of day
git push origin feature/my-feature
# Create PR on GitHub
```

### Common Commands

```bash
# Switch branches
git checkout develop
git checkout -b feature/new-feature

# Update current branch with develop
git checkout develop
git pull origin develop
git checkout feature/my-feature
git merge develop

# Check status
git status
git branch -a

# View commit history
git log --oneline --graph --decorate

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
git clean -fd
```

---

## 📝 Version History

- **2025-11-07**: Initial version with simplified Gitflow for 2-developer team

---

**Thank you for contributing to Villas Boats!** 🚤

If you have suggestions for improving this guide, please open a PR or issue.
