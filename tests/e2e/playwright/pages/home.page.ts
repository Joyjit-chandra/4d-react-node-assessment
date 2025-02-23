import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ButtonLabels } from '@utilities/shared/enums/button-labels.enums';
import { NavigationEndpoints } from '@utilities/shared/enums/endpoints.enums';

/**
 * class to drive the home page
 */
export class HomePage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }

  //locators
  readonly getStartManagingDocumentsButton = () =>
    this.buttonComponent.getButtonByLabel(
      ButtonLabels.START_MANAGING_DOCUMENTS
    );

  //methods
  async navigateToHomePage() {
    await this.page.goto('/');
  }
  /**
   * Click the start managing documents button
   * @returns {Promise<void>}
   */
  async clickStartManagingDocumentsButton() {
    await Promise.all([
      this.page.waitForURL(NavigationEndpoints.FORM_PAGE),
      this.getStartManagingDocumentsButton().click(),
    ]);
  }
}
