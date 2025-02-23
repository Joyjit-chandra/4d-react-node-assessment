import { test as baseTest } from '@playwright/test';
import { HomePage } from './home.page';
import { FormPage } from './form.page';
import { ResultsPage } from './results.page';

export const pageFixtures = baseTest.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  formPage: async ({ page }, use) => {
    await use(new FormPage(page));
  },
  resultsPage: async ({ page }, use) => {
    await use(new ResultsPage(page));
  },
});

export interface PageFixtures {
  homePage: HomePage;
  formPage: FormPage;
  resultsPage: ResultsPage;
}

export type AnyPage = PageFixtures[keyof PageFixtures];

export { expect } from '@playwright/test';
