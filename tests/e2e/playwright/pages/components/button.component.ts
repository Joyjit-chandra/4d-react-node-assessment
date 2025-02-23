import { Page } from '@playwright/test';
import { ButtonLabels } from '@utilities/shared/enums/button-labels.enums';

export class ButtonComponent {
  constructor(readonly page: Page) {}

  readonly getButtonByLabel = (label: ButtonLabels) =>
    this.page.getByRole('button', { name: label });
}
