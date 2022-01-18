/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
