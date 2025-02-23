import { EmployeeDetailsTableColumns } from '@pages/results.page';
import { sampleEmployeeData } from '@testData/sample-employee.data';
import { test, expect } from '@utilities/basetest';

test.describe('Document Management Application E2E Tests', () => {
  test('complete form submission journey', async ({
    page,
    homePage,
    formPage,
  }) => {
    // Navigate from landing page
    await homePage.navigateToHomePage();
    //click on start managing documents button
    await homePage.clickStartManagingDocumentsButton();
    // Verify navigation to form page
    await expect(page).toHaveURL(/.*\/form/);

    // Fill in the form
    await formPage.fillForm(sampleEmployeeData);
    // approve the concent
    await formPage.getPrivecyCheckbox().check();
    // Submit the form
    await formPage.submitForm();

    // Verify successful submission and navigation to results page
    await expect(page).toHaveURL(/.*\/results/);
  });

  test('search functionality on results page', async ({ resultsPage }) => {
    // Navigate to results page (assuming we need to submit form first)
    await resultsPage.navigateToResultsPage();

    // Test successful search
    await resultsPage.searchEmployeeDetail(
      `${sampleEmployeeData.firstName} ${sampleEmployeeData.lastName}`
    );

    // Verify search results appear
    expect(
      await resultsPage.isEmployeeDetailExist({
        value: `${sampleEmployeeData.firstName} ${sampleEmployeeData.lastName}`,
        col: EmployeeDetailsTableColumns.EMPLOYEE_NAME,
      })
    ).toBe(true);
    // Test no results scenario
    await resultsPage.searchEmployeeDetail('NonexistentEntry123');

    // Verify "No results found" message
    await expect(
      resultsPage.tableComponent.getCellByValue('No matching documents found')
    ).toBeVisible();
  });
});
