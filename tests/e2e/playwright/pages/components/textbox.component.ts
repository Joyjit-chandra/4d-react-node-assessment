import { Page } from '@playwright/test';
import { TextboxLabels } from '@utilities/shared/enums/textbox-labels.enums';

export class TextboxComponent {
  constructor(readonly page: Page) {}

  readonly getTextboxByLabel = (label: TextboxLabels) =>
    this.page.getByRole('textbox', { name: label });
}
