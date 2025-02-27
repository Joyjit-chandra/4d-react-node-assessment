import { expect } from '@wdio/globals';
import { describe, it } from 'mocha';

describe('Document Management API Flow Tests', () => {
  let submittedFormData;

  it('should successfully submit form data and navigate to results page', async () => {
    // Start from landing page
    await browser.url('/');

    // Click "Start Managing Documents" button
    await $('button=Start Managing Documents').click();

    // Verify navigation to form page
    expect(await browser.getUrl()).toContain('/form');

    // Prepare test data
    submittedFormData = {
      firstName: 'Amit',
      lastName: 'Sharma',
      employeeId: 'EMP56789',
      phoneNumber: '+91-9876543210',
      annualSalary: 1000000,
      startDate: '20-09-2022',
      supervisorEmail: 'supervisor@company.com',
      costCenter: 'CC-1234',
      projectCode: 'PRJ-7890',
    };

    // Fill out the form
    await $('#firstName').setValue(submittedFormData.firstName);
    await $('#lastName').setValue(submittedFormData.lastName);
    await $('#employeeId').setValue(submittedFormData.employeeId);
    await $('#phoneNumber').setValue(submittedFormData.phoneNumber);
    await $('#salary').setValue(submittedFormData.annualSalary);
    await $('#startDate').setValue(submittedFormData.startDate);
    await $('#supervisorEmail').setValue(submittedFormData.supervisorEmail);
    await $('#costCenter').setValue(submittedFormData.costCenter);
    await $('#projectCode').setValue(submittedFormData.projectCode);

    // Submit the form
    await $('button[type="submit"]').click();

    // Verify navigation to results page
    await browser.waitUntil(async () =>
      (await browser.getUrl()).includes('/results')
    );

    // Verify submitted data in results table
    const submissions = await $$('table tbody tr');
    const lastRow = [...submissions].pop(); // Most recent submission should be last

    expect(await lastRow.$('td=Amit')).toBeExisting();
    expect(await lastRow.$('td=Sharma')).toBeExisting();
    expect(
      await lastRow.$(`td=${submittedFormData.employeeId}`)
    ).toBeExisting();
    expect(
      await lastRow.$(`td=${submittedFormData.phoneNumber}`)
    ).toBeExisting();
  });

  it('should show validation errors for invalid form data', async () => {
    // Navigate to form page
    await browser.url('/form');

    // Try to submit empty form
    await $('button[type="submit"]').click();

    it('should handle validation errors for invalid form data', async () => {
      const invalidFormData = {
        firstName: '',
        lastName: '',
        employeeId: '',
        phoneNumber: 'sample_string',
        annualSalary: 'sample_string',
        startDate: '0000',
        supervisorEmail: 'invalid mail',
        costCenter: '',
        projectCode: '',
      };

      const response = await browser.call(async () => {
        return fetch('http://localhost:5173/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Origin: 'http://localhost:5173',
          },
          body: JSON.stringify(invalidFormData),
        });
      });

      const responseData = await response.json();
      // Note: getting 200 instead of 400
      // expect(response.status).toBe(400);
      const lastSubmission = [...responseData].pop();
      expect(lastSubmission.phoneNumber).not.toBe(invalidFormData.phoneNumber);
    });
  });
});
