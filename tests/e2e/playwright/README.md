# Playwright Test Suite for Document Management

## Directory Structure

tests/e2e/playwright/
├── pages/
│ ├── components/
│ │ ├── button.component.ts
│ │ ├── table.component.ts
│ │ └── textbox.component.ts
│ ├── base.page.ts
│ ├── form.page.ts
│ ├── home.page.ts
│ ├── page.fixture.ts
│ └── results.page.ts
├── test-data/
├── tests/
├── utilities/
│ ├── helpers/
│ └── shared/
│ ├── constants/
│ ├── enums/
│ └── interfaces/
└── README.md

## Configuration (playwright.config.ts)

### Test Directory & Execution

- Tests located in `./tests/e2e/playwright`
- Parallel execution enabled
- CI-specific configurations for retries and workers
- Prevents `.only` tests in CI

### Browser Configuration

typescript:tests/e2e/playwright/README.md
projects: [
{
name: 'chromium',
use: { ...devices['Desktop Chrome'] },
},
]

typescript
{
testDir: './tests/e2e/playwright',
fullyParallel: true,
forbidOnly: !!process.env.CI,
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : undefined,
}

- Currently running on Chrome/Chromium
- Firefox and WebKit configurations available but disabled

### Environment Settings

typescript
use: {
baseURL: 'http://localhost:5173',
trace: 'on-first-retry',
screenshot: 'only-on-failure',
}

typescript
webServer: {
command: 'npm run dev:full',
url: 'http://localhost:5173',
reuseExistingServer: !process.env.CI,
timeout: 120000,
}

## Page Objects

### Base Components

1. **Button Component** (`components/button.component.ts`)

   - Reusable button locators/methods

2. **Table Component** (`components/table.component.ts`)

   - Reusable table locators/methods

3. **Textbox Component** (`components/textbox.component.ts`)

   - Reusable textbox locators/methods

### Pages

1. **Base Page** (`base.page.ts`)

   - Common page functionality
   - Shared methods and properties

2. **Home Page** (`home.page.ts`)

   - Reusable home page locators/methods

3. **Form Page** (`form.page.ts`)

   - Reusable form page locators/methods

4. **Results Page** (`results.page.ts`)

   - Reusable results page locators/methods

### Fixtures

- **Page Fixture** (`page.fixture.ts`)
  - Test setup and teardown
  - Common test utilities
  - Shared test configurations
  #### usage in test file example
  test('navigate through application', async ({ homePage, formPage, resultsPage }) => {
  await homePage.navigate();
  await formPage.fillForm();
  await resultsPage.verifySubmission();
  });

## Notes

- Component-based architecture for reusability
- Page Object Model for maintainability
- Shared base page for common functionality
- Strong typing with TypeScript
- Modular component structure

## Running Tests

### Local Development

# Run all tests

npx playwright test

# Run with UI Mode

npx playwright test --ui

# Run specific test file

npx playwright test tests/specific.spec.ts

# Run with CI configuration

CI=true npx playwright test

## Notes

- HTML reporter enabled by default
- Automatic server management
- CI-specific configurations
- Type-safe page fixtures
- Screenshot and trace artifacts for debugging
