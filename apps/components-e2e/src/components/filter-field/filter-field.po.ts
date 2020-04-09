/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { Selector, t, ClientFunction } from 'testcafe';

export const errorBox = Selector('.dt-filter-field-error');
export const filterField = Selector('#filter-field');
export const option = (nth: number) => Selector(`.dt-option:nth-child(${nth})`);
export const clearAll = Selector('.dt-filter-field-clear-all-button');
export const filterTags = Selector('dt-filter-field-tag');
export const tagOverlay = Selector('.dt-overlay-container');
export const filterFieldRangePanel = Selector('.dt-filter-field-range-panel');

export const input = Selector('input');

export const switchToFirstDatasource = Selector('#switchToFirstDatasource');
export const switchToSecondDatasource = Selector('#switchToSecondDatasource');
export const setupSecondTestScenario = Selector('#setupSecondTestScenario');
export function clickOption(
  nth: number,
  testController?: TestController,
): TestControllerPromise {
  const controller = testController || t;

  return controller
    .click(filterField, { speed: 0.2 })
    .wait(250)
    .click(option(nth), { speed: 0.2 });
}

/** Focus the input of the filter field to send key events to it. */
export const focusFilterFieldInput = ClientFunction(() => {
  (document.querySelector('#filter-field input') as HTMLElement).focus();
});

/** Retreive all set tags in the filter field and their values. */
export const getFilterfieldTags = ClientFunction(() => {
  const filterFieldTags: HTMLElement[] = [].slice.call(
    document.querySelectorAll('.dt-filter-field-tag'),
  );
  const contents: string[] = [];
  for (const tag of filterFieldTags) {
    contents.push(tag.textContent || '');
  }
  return contents;
});
