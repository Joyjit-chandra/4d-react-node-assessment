import { test as base } from '@playwright/test';
import { BaseApi } from './base.api';

type APIs = {
  baseApi: BaseApi;
};

export const test = base.extend<APIs>({
  baseApi: async ({ request }, use) => {
    await use(new BaseApi(request));
  },
});

export { expect } from '@playwright/test';
