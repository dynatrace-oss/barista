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

import { axeCheck, createReport } from 'axe-testcafe';
import { DT_DEMOS_EXAMPLE_NAV_ITEMS } from './nav-items';

const rules = require('../rules.a11y.json');
const BASEURL = `http://localhost:4200/`;

/** Blacklisted default examples */
const BLACKLIST = [
  'chart-selection-area-default-example',
  'chart-stream-example',
  'chart-loading-example',
];

DT_DEMOS_EXAMPLE_NAV_ITEMS.slice(0, 10).forEach(component => {
  fixture(component.name);

  component.examples
    .filter(example => !BLACKLIST.includes(example.name))
    .forEach(example => {
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
            .eql(0, 'Expect to have no console errors');
        },
      );
    });
});
