import { test as baseTest, mergeTests } from '@playwright/test';
import { pageFixtures, PageFixtures } from '@pages/page.fixture';

export interface TestFixtures extends PageFixtures {}

const fixtures = mergeTests(baseTest, pageFixtures);

export const test = fixtures.extend<TestFixtures>({});

export { expect } from '@playwright/test';
