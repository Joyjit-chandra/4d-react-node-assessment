import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { TextboxLabels } from '@utilities/shared/enums/textbox-labels.enums';

export class ResultsPage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }

  //methods

  async navigateToResultsPage() {
    await this.page.goto('/results');
  }
  /**
   * Searches for an employee detail by full name
   * @param value The full name to search for
   */
  async searchEmployeeDetail(value: string) {
    await this.textboxComponent
      .getTextboxByLabel(TextboxLabels.SEARCH_BY_FULL_NAME)
      .fill(value);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Checks if an employee detail exists in the table
   * @param value The value to search for
   * @param col The column to search in
   * @returns True if the employee detail exists, false otherwise
   */
  async isEmployeeDetailExist({
    value,
    col,
  }: {
    value: string;
    col: EmployeeDetailsTableColumns;
  }): Promise<boolean> {
    return await this.tableComponent.isRowExist({ value, col });
  }
}

export enum EmployeeDetailsTableColumns {
  EMPLOYEE_NAME = 'Employee Name',
  EMPLOYEE_ID = 'Employee ID',
  START_DATE = 'Start Date',
  COST_CENTER = 'Cost Center',
  PROJECT_CODE = 'Project Code',
  SUPERVISOR_EMAIL = 'Supervisor Email',
}
