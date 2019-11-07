import { ClientFunction, Selector, t } from 'testcafe';

export const trigger = Selector('#trigger');
export const disableButton = Selector('#disable-toggle');
export const overlay = Selector('.dt-overlay-container');

export async function toggleDisable(
  testController?: TestController,
): Promise<void> {
  const controller = testController || t;
  return controller.click(disableButton);
}

export const getActiveElementText = ClientFunction(() => {
  const element = document.activeElement;

  if (!element) {
    return '';
  }
  return element.textContent || '';
});
