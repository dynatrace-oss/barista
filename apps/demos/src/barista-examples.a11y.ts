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

import { axeCheck, createReport } from 'axe-testcafe';
import { DT_DEMOS_EXAMPLE_NAV_ITEMS } from './nav-items';

const rules = require('../rules.a11y.json');
const BASEURL = `http://localhost:4200/`;

/** Blocklist default examples */
const BLOCKLIST: string[] = [
  // Disabled because the select in that example fails the a11y test
  // because a `listbox` role needs to contain `list` or `option` items
  // Since these are projected into an overlay, this is tricky.
  // https://github.com/dynatrace-oss/barista/issues/568
  'drawer-dynamic-example',
  'select-complex-value-example',
  'select-default-example',
  'select-disabled-example',
  'select-form-field-example',
  'select-forms-example',
  'select-groups-example',
  'select-value-example',
  'select-with-icons-example',
  'select-custom-value-template-example',

  // Disabled the filter field tests, because their `combobox` role does not
  // fulfil all requirements of a combobox.
  // https://github.com/dynatrace-oss/barista/issues/567
  'filter-field-async-example',
  'filter-field-clearall-example',
  'filter-field-default-search-example',
  'filter-field-disabled-example',
  'filter-field-distinct-example',
  'filter-field-partial-example',
  'filter-field-programmatic-filters-example',
  'filter-field-readonly-non-editable-tags-example',
  'filter-field-unique-example',
  'filter-field-validator-example',
  'filter-field-infinite-data-depth-example',
  'quick-filter-default-example',
  'quick-filter-custom-show-more-example',
  'quick-filter-custom-parser-example',

  // Combobox a11y test are also disabled
  // for similar reasons as the select and filter field
  // are disabled.
  'combobox-simple-example',
  'combobox-form-control-example',
  'combobox-custom-option-height-example',
];

DT_DEMOS_EXAMPLE_NAV_ITEMS.forEach((component) => {
  fixture(component.name);

  component.examples
    .filter((example) => !BLOCKLIST.includes(example.name))
    .forEach((example) => {
      test.page(`${BASEURL}${example.route}`)(
        example.name,
        async (testController: TestController) => {
          const axeContext = { include: [['.dt-demos-main']] };
          const check = await axeCheck(testController, axeContext, rules);
          const { error } = await testController.getBrowserConsoleMessages();

          await testController
            .expect(check.violations.length === 0)
            .ok(createReport(check.violations))
            .expect(error.length)
            .eql(0, error.join('\n'));
        },
      );
    });
});
