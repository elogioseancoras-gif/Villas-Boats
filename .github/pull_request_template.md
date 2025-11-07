# Pull Request

## Summary

<!-- Provide a concise summary of the changes in this PR -->

## Type of Change

<!-- Check the relevant option(s) -->

- [ ] 🚀 **Feature** - New functionality
- [ ] 🐛 **Bug fix** - Fixes an issue
- [ ] 🧹 **Chore** - Maintenance, dependencies, refactoring
- [ ] 📚 **Documentation** - Documentation updates only
- [ ] 🧪 **Test** - Adding or updating tests
- [ ] ⚡ **Performance** - Performance improvement

## Changes Made

<!-- List the specific changes in this PR -->

-
-
-

## Testing

<!-- Describe how this was tested -->

### Test Scenarios Verified

- [ ] Happy path tested and working
- [ ] Error cases tested and handled
- [ ] Edge cases considered and tested
- [ ] Existing functionality not broken

### Test Commands Run

```bash
# Backend tests (if applicable)
cd backend && mvn test

# Frontend tests (if applicable)
cd frontend && pnpm test

# E2E tests (if applicable)
cd frontend && pnpm exec playwright test
```

## Screenshots (if applicable)

<!-- Add screenshots for UI changes -->

### Before

<!-- Screenshot showing old behavior -->

### After

<!-- Screenshot showing new behavior -->

## Database Changes

<!-- Check if applicable -->

- [ ] No database changes
- [ ] Database migration included
- [ ] Database changes documented

## Environment Variables

<!-- Check if applicable -->

- [ ] No new environment variables
- [ ] New variables added to `.env.example`
- [ ] Variables documented in README

## Breaking Changes

<!-- Check if applicable -->

- [ ] No breaking changes
- [ ] Breaking changes documented below

<!-- If breaking changes, describe impact and migration path -->

## Related Issues

<!-- Link to related issues/tickets -->

Closes #
Related to #

## Deployment Notes

<!-- Any special considerations for deployment? -->

- [ ] No special deployment steps needed
- [ ] Special deployment steps documented below

<!-- If special steps needed, list them -->

## Checklist

### Code Quality

- [ ] Code follows project style guidelines
- [ ] Self-review performed
- [ ] Comments added for complex logic
- [ ] No console.log or debugging code left
- [ ] No commented-out code left

### Documentation

- [ ] Documentation updated (if needed)
- [ ] API documentation updated (if API changes)
- [ ] CHANGELOG updated (if applicable)

### Testing

- [ ] Tests added for new functionality
- [ ] Tests updated for modified functionality
- [ ] All tests passing locally
- [ ] No test coverage decrease

### Security

- [ ] No sensitive data (passwords, keys, tokens) committed
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Authentication/authorization working correctly

### Performance

- [ ] No significant performance degradation
- [ ] Database queries optimized
- [ ] No N+1 query problems

## Additional Notes

<!-- Any additional information for reviewers -->



---

<!--
For reviewers:
- Check code quality and adherence to standards
- Verify testing coverage
- Test the changes locally if possible
- Provide constructive feedback
- Approve only when confident in changes
-->
