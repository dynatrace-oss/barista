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

import { Selector, t, ClientFunction } from 'testcafe';

export const errorBox = Selector('.dt-filter-field-error');
export const filterField = Selector('.dt-filter-field');
export const options = Selector('.dt-option');
export const option = (nth: number) => Selector(`.dt-option:nth-child(${nth})`);
export const multiSelectOption = (nth: number) =>
  Selector(`.dt-option:nth-child(${nth}) input`);
export const multiSelectApply = Selector(`.dt-filter-field-multi-select-apply`);
export const clearAll = Selector('.dt-filter-field-clear-all-button');
export const filterTags = Selector('dt-filter-field-tag');
export const tagOverlay = Selector('.dt-overlay-container');
export const filterFieldRangePanel = Selector('.dt-filter-field-range-panel');
export const multiSelectPanel = Selector('.dt-filter-field-multi-select-panel');

/** Selector for the delete button (x) on a filter with a specific text */
export const tagDeleteButton = (filterText: string) =>
  Selector('dt-filter-field-tag')
    .withText(filterText)
    .child('.dt-filter-field-tag-button');

export const input = Selector('input');

export const switchToFirstDatasource = Selector('#switchToFirstDatasource');
export const switchToSecondDatasource = Selector('#switchToSecondDatasource');
export const setupSecondTestScenario = Selector('#setupSecondTestScenario');
export const setupMultiselectEditScenario = Selector(
  '#setupMultiselectEditScenario',
);
export function clickOption(
  nth: number,
  testController?: TestController,
): TestControllerPromise {
  const controller = testController || t;

  return controller
    .click(filterField, { speed: 0.4 })
    .click(option(nth), { speed: 0.4 });
}
export function clickMultiSelectOption(
  nth: number,
  testController?: TestController,
): TestControllerPromise {
  const controller = testController || t;

  return controller
    .click(filterField, { speed: 0.4 })
    .click(multiSelectOption(nth), { speed: 0.4 });
}

/** Focus the input of the filter field to send key events to it. */
export const focusFilterFieldInput = ClientFunction(() => {
  (document.querySelector('#filter-field input') as HTMLElement).focus();
});

/** Retrieve all set tags in the filter field and their values. */
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
