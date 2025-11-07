# E2E Testing Setup

## Status

✅ **Completed:**
- Playwright package installed (`@playwright/test v1.56.1`)
- Chromium browser binary downloaded
- Playwright configuration created (`playwright.config.ts`)
- Comprehensive e2e test suite created (`e2e/booking-flow.spec.ts`)

## System Dependencies Required

The browser needs system libraries to run. Install them with:

```bash
sudo pnpm exec playwright install-deps
```

Or manually with apt:

```bash
sudo apt-get install libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libatspi2.0-0 libx11-6 libxcomposite1 libxdamage1 libxext6 libxfixes3 \
  libxrandr2 libgbm1 libxcb1 libxkbcommon0 libasound2
```

## Test Suite

The e2e test suite includes 4 test scenarios:

### 1. **Full Booking Flow** (`should complete full booking inquiry flow`)
Tests the complete user journey:
- Navigate to boat detail page
- Fill booking form (dates, guests, contact info)
- Submit inquiry
- Verify redirect to confirmation page
- Verify booking reference displayed
- Take screenshot for verification

### 2. **Form Validation** (`should validate required fields`)
- Attempts form submission without required fields
- Verifies validation errors are shown
- Ensures form doesn't submit with invalid data

### 3. **Multi-language Support** (`should work in all supported languages`)
Tests all 4 languages:
- English (`/en/`)
- Brazilian Portuguese (`/pt-BR/`)
- European Portuguese (`/pt-PT/`)
- Spanish (`/es/`)

Verifies:
- Pages load in correct language
- Booking widget is visible
- URL contains correct locale

### 4. **Pricing Calculation** (`should calculate correct pricing with/without captain`)
- Tests price calculation logic
- Verifies price changes when captain option is toggled
- Ensures pricing accuracy

## Running Tests

Once system dependencies are installed:

```bash
# Run all tests
pnpm exec playwright test

# Run specific test file
pnpm exec playwright test e2e/booking-flow.spec.ts

# Run in headed mode (see browser)
pnpm exec playwright test --headed

# Run specific test
pnpm exec playwright test -g "should complete full booking inquiry flow"

# View test report
pnpm exec playwright show-report
```

## Test Data

Tests use the following boat:
- **Slug:** `luxury-catamaran-algarve`
- **ID:** `850e8400-e29b-41d4-a716-446655440001`

Test contact information:
- **Name:** E2E Test User
- **Email:** e2etest@example.com
- **Phone:** +351912345678

## Screenshots

Failed test screenshots are saved to: `e2e/screenshots/`

Successful booking confirmation screenshot: `e2e/screenshots/booking-confirmation.png`

## Integration with Backend

Tests hit the real backend API at `http://localhost:8080/api`:
- **Endpoint:** `POST /bookings/inquiries`
- **Expected Response:** HTTP 201 with booking reference

Ensure backend server is running before executing tests.

## Next Steps

1. Install system dependencies (requires sudo)
2. Run tests: `pnpm exec playwright test`
3. View HTML report at `http://localhost:9323`
4. Fix any test failures
5. Add additional test scenarios as needed

## Known Issues

- **System Dependencies:** WSL/Ubuntu requires additional packages to run browser
- **Playwright MCP:** MCP server configured for Chrome (not Chromium), requires different setup
- **Manual Testing Alternative:** Can test manually in browser until dependencies are installed
