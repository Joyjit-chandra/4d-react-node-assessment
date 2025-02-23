import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { TextboxLabels } from '@utilities/shared/enums/textbox-labels.enums';
import { ButtonLabels } from '@utilities/shared/enums/button-labels.enums';
import {
  ApiEndpoints,
  NavigationEndpoints,
} from '@utilities/shared/enums/endpoints.enums';
import { APIMethod } from '@utilities/shared/enums/common.enum';
import { EmployeeData } from '@testData/employee-details-form.data';

/**
 * class to drive the form page
 */
export class FormPage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }
  //locators
  readonly getPrivecyCheckbox = () => this.page.locator('#privacyConsent');

  //methods
  /**
   * Fill the form with the employee details
   * @param {EmployeeData} employeeDetails - The employee details to fill in the form
   * @returns {Promise<void>}
   */
  async fillForm(employeeDetails: EmployeeData): Promise<void> {
    const {
      firstName,
      lastName,
      employeeId,
      phoneNumber,
      annualSalary,
      startDate,
      supervisorEmail,
      costCenter,
      projectCode,
    } = employeeDetails;
    try {
      await this.textboxComponent
        .getTextboxByLabel(TextboxLabels.FIRST_NAME)
        .fill(firstName);
      await this.textboxComponent
        .getTextboxByLabel(TextboxLabels.LAST_NAME)
        .fill(lastName);
      await this.textboxComponent
        .getTextboxByLabel(TextboxLabels.EMPLOYEE_ID)
        .fill(employeeId);
      await this.textboxComponent
        .getTextboxByLabel(TextboxLabels.PHONE_NUMBER)
        .fill(phoneNumber);
      await this.page
        .getByRole('spinbutton', { name: TextboxLabels.ANNUAL_SALARY })
        .fill(annualSalary.toString());
      await this.textboxComponent
        .getTextboxByLabel(TextboxLabels.START_DATE)
        .fill(startDate);
      await this.textboxComponent
        .getTextboxByLabel(TextboxLabels.SUPERVISOR_EMAIL)
        .fill(supervisorEmail);
      await this.textboxComponent
        .getTextboxByLabel(TextboxLabels.COST_CENTER)
        .fill(costCenter);
      await this.textboxComponent
        .getTextboxByLabel(TextboxLabels.PROJECT_CODE)
        .fill(projectCode);
    } catch (error) {
      console.error('Error filling form:', error);
    }
  }

  /**
   * Submit the  - click the submit button and wait for the api response
   * @returns {Promise<void>}
   */
  async submitForm(): Promise<void> {
    await Promise.all([
      this.buttonComponent
        .getButtonByLabel(ButtonLabels.SUBMIT_DOCUMENT)
        .click(),
      this.waitForApiResponse({
        url: ApiEndpoints.SUBMIT_FORM,
        method: APIMethod.POST,
        status: 200,
      }),
      this.page.waitForURL(NavigationEndpoints.RESULTS_PAGE),
    ]);
  }
}
