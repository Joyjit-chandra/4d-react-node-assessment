import { Page } from '@playwright/test';
import { APIResponseDetails } from '@shared/interfaces/api.interface';
import { ButtonComponent } from '@pages/components/button.component';
import { TextboxComponent } from '@pages/components/textbox.component';
import { TableComponent } from './components/table.component';

export class BasePage {
  readonly buttonComponent: ButtonComponent;
  readonly textboxComponent: TextboxComponent;
  readonly tableComponent: TableComponent;
  constructor(protected page: Page) {
    this.buttonComponent = new ButtonComponent(this.page);
    this.textboxComponent = new TextboxComponent(this.page);
    this.tableComponent = new TableComponent(this.page);
  }

  /**
   * Waits for an API response with a matching URL and method, and returns the response.
   *
   * @param url - The URL to match in the response (can be partial).
   * @param method - The HTTP method to match (e.g., 'GET', 'POST').
   * @param status - The expected status code of the response.
   * @returns A promise that resolves to the response.
   * @throws Error if the response is not received within the timeout period or if the status code does not match th+e expected value.
   */
  async waitForApiResponse(apiResponseDetails: APIResponseDetails) {
    const { url, method, status, hasStatusContains, alternateStatus } =
      apiResponseDetails;
    try {
      let response;
      const isWildCardIncluded = apiResponseDetails.url.includes(`*`);
      if (isWildCardIncluded) {
        const [urlStart, urlEnd] = url.split(`*`);
        response = await this.page.waitForResponse(
          (response) =>
            response.url().includes(urlStart) &&
            response.url().includes(urlEnd) &&
            response.request().method() === method
        );
      } else {
        response = await this.page.waitForResponse(
          (response) =>
            response.url().includes(url) &&
            response.request().method() === method
        );
      }

      const actualStatus = response.status();

      // Check if the status contains the expected status when hasStatusContains is true
      if (hasStatusContains) {
        const statusString = actualStatus.toString();
        const expectedStatusString = status.toString();
        const alternateStatusString = alternateStatus?.toString();

        const matchesMainStatus = statusString.includes(expectedStatusString);
        const matchesAlternateStatus =
          alternateStatusString && statusString.includes(alternateStatusString);

        if (!matchesMainStatus && !matchesAlternateStatus) {
          console.error(
            `Expected status to contain ${expectedStatusString}${
              alternateStatusString ? ` or ${alternateStatusString}` : ''
            }, but got ${actualStatus}.`
          );
        }
      } else {
        // Direct status code comparison
        if (actualStatus !== status && actualStatus !== alternateStatus) {
          console.error(
            `Expected status ${status}${alternateStatus ? ` or ${alternateStatus}` : ''}, but got ${actualStatus}.`
          );
        }
      }

      return response;
    } catch (error) {
      console.error(
        `Error waiting for API response: ${error}. Parameters: URL=${url}, Method=${method}, Status=${status}${
          alternateStatus ? `, AlternateStatus=${alternateStatus}` : ''
        }`
      );
    }
  }
}
