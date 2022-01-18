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

import {
  autocompleteInput,
  overlayPane,
  option1,
  option3,
  option2,
} from './autocomplete.po';
import { resetWindowSizeToDefault, waitForAngular } from '../../utils';

fixture('Autocomplete')
  .page('http://localhost:4200/autocomplete')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should propagate attribute to overlay', async (testController: TestController) => {
  await testController
    .click(autocompleteInput, { speed: 0.5 })
    .expect(overlayPane.getAttribute('dt-ui-test-id'))
    .contains('autocomplete-overlay');
});

test('should highlight the correct option after navigating using mouse and keyboard', async (testController: TestController) => {
  await testController
    .click(autocompleteInput, { speed: 0.5 })
    .pressKey('down')
    .expect(option1.classNames)
    .contains('dt-option-active')
    .hover(overlayPane)
    .expect(option1.classNames)
    .notContains('dt-option-active')
    .expect(option2.classNames)
    .contains('dt-option-active')
    .pressKey('down')
    .expect(option2.classNames)
    .notContains('dt-option-active')
    .expect(option3.classNames)
    .contains('dt-option-active');
});
