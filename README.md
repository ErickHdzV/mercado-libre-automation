# Mercado Libre Test Automation take home challenge

## Author

- **Erick Hernández Velazco** - [GitHub](https://github.com/ErickHdzV)
- **Website** - [codebyerick.com](https://codebyerick.com/)
- **Email** - erick.hv@codebyerick.com

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Visual Testing](#visual-testing)
- [Reporting](#reporting)
- [Project Structure](#project-structure)

## Tech stack

- **TypeScript** - Programming language
- **Playwright** - Testing framework specialized in end-to-end automation

## Overview

This project provides automated testing capabilities for Mercado Libre website, focusing on searching features, filtering, sorting, and data extraction functionalities. The framework is built using modern testing practices with TypeScript and Playwright.

## Features

- **Cross-browser testing** - Supports Chromium, Firefox, and WebKit browsers
- **Visual regression testing** - Automated screenshot comparison and validation
- **Robust element selection** - Multiple selector fallback strategies for reliable element detection
- **Product data extraction** - Automated extraction of product titles and prices
- **Responsive design testing** - Tests across different viewport sizes
- **Parallel test execution** - Optimized for fast test execution
- **Comprehensive reporting** - HTML reports with detailed test results and screenshots
- **Error handling** - Graceful handling of popup dialogs and dynamic content

## Architecture

The test suite follows a modular architecture with the following principles:

- **Helper Functions** - Reusable utility functions for common operations
- **Constants Management** - Centralized configuration for selectors and test data
- **Type Safety** - Full TypeScript implementation for better maintainability

## Prerequisites

- **Node.js** - Version 18.x or higher
- **npm** - Version 8.x or higher

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ErickHdzV/mercado-libre-automation.git
cd mercado-libre-automation
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## Configuration

The test configuration is managed through `playwright.config.ts`. Key configurations include:

- **Test Directory**: `./e2e` - Contains all test files
- **Parallel Execution**: Enabled for faster test runs
- **Retries**: Setted to 1 for CI environments
- **Trace Collection**: Enabled on test failures
- **Reporter**: HTML reporter for comprehensive test results

### Browser Configuration

Currently configured for:

- ✅ **Chromium** (Desktop Chrome)
- ⚪ Firefox (commented out - can be enabled)
- ⚪ WebKit (commented out - can be enabled)

## Running Tests

### Run All Tests

The project just have one test file, so you can run all tests with:

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test e2e/test-mercado-libre.spec.ts
```

### Run Tests with UI Mode

```bash
npx playwright test --ui
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Generate and View Reports

```bash
npx playwright show-report
```

## Test Structure

### Main Test Files

#### `test-mercado-libre.spec.ts`

### Test Flow

1. **Site Setup**

   - Navigate to Mercado Libre homepage
   - Select México as the target country
   - Handle cookie consent and promotional popups

2. **Product Search**

   - Search for "PlayStation 5" using the search functionality
   - Validate search input and execution

3. **Filter Application**

   - Apply "Nuevos" (New items) filter
   - Verify filter application and results update

4. **Result Sorting**

   - Sort results by "Menor precio" (Lowest price)
   - Validate sorting functionality

5. **Data Extraction**
   - Extract product titles and prices from search results
   - Log extracted data for verification
   - Handle missing or incomplete data gracefully

## Visual Testing

### Screenshot Validation Points

- `1-landing-page.png` - Homepage initial load
- `2-mexico-landing-page.png` - México country selection
- `3-playstation-search.png` - Search term input
- `4-results-without-filter.png` - Initial search results
- `5-results-with-new-filter.png` - Results after applying "Nuevos" filter
- `6-sort-options.png` - Sort dropdown menu
- `7-results-sorted-by-price.png` - Final sorted results

### Visual Test Management

- Screenshots are stored in `screenshots/` directory
- The screenshots are updated all the time when the test runs
- Playwright offers visual comparison and generates diff images in `test-results/` **(No activated for this project)**

## Reporting

### HTML Reports

- Generated automatically after test execution
- Located in `playwright-report/`
- Includes test results, screenshots, and failure details
- View with `npx playwright show-report`

### Test Results

- Detailed logs in `test-results/` directory
- Screenshots for failed tests
- Trace files for debugging

## Project Structure

```
take-home-challenge/
├── e2e/                                    # Test files
│   ├── test-mercado-libre.spec.ts          # Main test file
├── playwright-report/                     # HTML test reports
├── playwright.config.ts                   # Playwright configuration
├── package.json                          # Project dependencies
└── README.md                              # Project documentation
```

### Adding New Tests

1. Create test files in the `e2e/` directory
2. Follow the established helper function pattern
3. Include visual validations with `expect().toHaveScreenshot()`
4. Add appropriate error handling
5. Update this documentation
