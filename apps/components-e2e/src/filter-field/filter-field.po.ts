import { Selector, t } from 'testcafe';

export const errorBox = Selector('.dt-filter-field-error');
export const filterField = Selector('#filter-field');
export const option = (nth: number) => Selector(`.dt-option:nth-child(${nth})`);

export const input = Selector('input');

export async function clickOption(
  nth: number,
  testController?: TestController,
): Promise<void> {
  const controller = testController || t;

  await controller.click(filterField);
  await controller.click(option(nth));
}
