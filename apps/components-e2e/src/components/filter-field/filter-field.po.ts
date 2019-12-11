/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

export const errorBox = Selector('.dt-filter-field-error');
export const filterField = Selector('#filter-field');
export const option = (nth: number) => Selector(`.dt-option:nth-child(${nth})`);
export const clearAll = Selector('.dt-filter-field-clear-all-button');
export const filterTags = Selector('dt-filter-field-tag');

export const input = Selector('input');

export async function clickOption(
  nth: number,
  testController?: TestController,
): Promise<void> {
  const controller = testController || t;

  await controller.click(filterField);
  await controller.click(option(nth));
}
