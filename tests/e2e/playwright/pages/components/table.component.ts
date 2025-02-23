import { Page, Locator } from '@playwright/test';

export class TableComponent {
  constructor(private page: Page) {}

  //locators
  readonly getTable = () => this.page.locator('table');
  readonly getBody = () => this.getTable().locator('tbody');

  //methods
  /**
   * Gets a cell locator by column name and value
   * @param col Column name (e.g., "Name", "Employee ID")
   * @param value Cell value to find
   * @returns Locator for the matching cell
   */
  async getCellByColumnAndValue({
    col,
    value,
  }: {
    col: string;
    value: string;
  }): Promise<Locator> {
    const columnIndex = await this.getColumnIndex(col);
    return this.getBody()
      .locator(`tr td:nth-child(${columnIndex + 1})`)
      .filter({ hasText: value });
  }

  /**
   * Gets a cell locator by cell value
   * @param value Cell value to find
   * @returns Locator for the matching cell
   */
  getCellByValue(value: string): Locator {
    return this.getBody().getByRole('cell', { name: value });
  }

  /**
   * Gets the entire row that contains a specific cell value in the specified column
   * @param value Value to search for
   * @param col Column name to search in
   * @returns Locator for the matching row
   */
  async getRowByCell({
    value,
    col,
  }: {
    value: string;
    col: string;
  }): Promise<Locator> {
    const columnIndex = await this.getColumnIndex(col);
    return this.getBody()
      .locator('tr')
      .filter({
        has: this.page.locator(
          `td:nth-child(${columnIndex + 1}):text("${value}")`
        ),
      });
  }

  /**
   * Checks if a row exists with the specified value in the given column
   * @param col Column name to check
   * @param value Value to search for
   * @returns Promise<boolean> indicating if the row exists
   */
  async isRowExist({
    col,
    value,
  }: {
    col: string;
    value: string;
  }): Promise<boolean> {
    const row = await this.getRowByCell({ value, col });
    return (await row.count()) > 0;
  }

  /**
   * Helper method to get the index of a column by its name
   * @param columnName Name of the column
   * @returns Promise<number> index of the column (0-based)
   */
  private async getColumnIndex(columnName: string): Promise<number> {
    // This assumes there's a header row above the tbody
    const headers = await this.page.locator('thead tr th').allInnerTexts();
    const index = headers.findIndex((header) => header.trim() === columnName);
    if (index === -1) {
      throw new Error(`Column "${columnName}" not found in table headers`);
    }
    return index;
  }
}
