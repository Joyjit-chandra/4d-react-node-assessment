# WebDriverIO Test Suite for Document Management

## Directory Structure

tests/e2e/wdio/
├── test/
│ ├── specs/
│ │ └── api/
│ │ ├── documentManagement.test.ts
│ │ └── results.spec.ts
│ └── tsconfig.json
├── wdio.conf.js
└── README.md

## Configuration (wdio.conf.js)

### Test Directory & Execution

typescript
{
specs: [
'./test/specs/**/*.ts'
],
maxInstances: 10,
capabilities: [{
maxInstances: 5,
browserName: 'chrome',
acceptInsecureCerts: true
}]
}
`

### Environment Settings

typescript
{
baseUrl: 'http://localhost:5173',
waitforTimeout: 10000,
connectionRetryTimeout: 120000,
connectionRetryCount: 3
}

### Framework Configuration

typescript
{
services: ['chromedriver'],
framework: 'mocha',
reporters: ['spec'],
mochaOpts: {
ui: 'bdd',
timeout: 60000
}
}

### TypeScript Support

typescript
{
autoCompileOpts: {
autoCompile: true,
tsNodeOpts: {
transpileOnly: true,
project: './tests/e2e/wdio/test/tsconfig.json'
}
}
}

## Test Implementation

### Document Management Test

- Form submission flow
  - Navigate to landing page
  - Click "Start Managing Documents"
  - Fill form with test data
  - Submit form
  - Verify navigation to results page
  - Validate submitted data in results table
    [Note - API error validation failing as 200 response is being returned instead of any error code]

### Validation Testing

- Empty form submission
- Invalid data formats
- API response validation

## Running Tests

### Local Development

cd tests/e2e/wdio

# Run all tests

npx wdio run ./wdio.conf.js

# Run specific test

npx wdio run ./wdio.conf.js --spec test/specs/api/documentManagement.test.ts
