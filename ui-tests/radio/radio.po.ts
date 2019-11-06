import { Selector, t } from 'testcafe';

export const radioWater = Selector('#water');
export const radioLeaf = Selector('#leaf');
export const inputWater = Selector('#water-input');
export const inputLeaf = Selector('#leaf-input');

export const isRadioChecked = (item: Selector) =>
  item.hasClass('dt-radio-checked');

export const isRadioDisabled = (item: Selector) =>
  item.hasClass('dt-radio-disabled');

export async function toggleDisable(
  testController?: TestController,
): Promise<void> {
  const controller = testController || t;
  return controller.click(Selector('#toggle-disable'));
}
