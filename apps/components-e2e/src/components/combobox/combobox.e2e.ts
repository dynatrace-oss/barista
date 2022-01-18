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

import { resetWindowSizeToDefault, waitForAngular } from '../../utils';
import {
  comboboxOverlayPane,
  comboboxInput,
  option,
  loadingIndicator,
  resetValueButton,
} from './combobox.po';

fixture('Combobox')
  .page('http://localhost:4200/combobox')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should render with an initial value', async (testController: TestController) => {
  await testController.expect(comboboxInput.value).eql('Value 1');
});

test('should open the auto complete panel when focussing the combobox', async (testController: TestController) => {
  await testController
    .click(comboboxInput)
    .expect(comboboxOverlayPane.exists)
    .ok();
});

test('should list all available options when focussing the combobox', async (testController: TestController) => {
  await testController
    .click(comboboxInput)
    .expect(comboboxOverlayPane.exists)
    .ok()
    // Expect the options count to prevent anticipating more than the
    // checked below options
    .expect(option.count)
    .eql(3)
    // Check all options and rendered values
    .expect(option.nth(0).textContent)
    .contains('Value 1')
    .expect(option.nth(1).textContent)
    .contains('Value 2')
    .expect(option.nth(2).textContent)
    .contains('Value 3');
});

test('should show the loading indicator when loading is triggered', async (testController: TestController) => {
  await testController
    .click(comboboxInput)
    .expect(comboboxOverlayPane.exists)
    .ok()
    // Remove content from the combobox filter
    .pressKey('backspace backspace backspace backspace')
    .expect(loadingIndicator.exists)
    .ok()
    // Wait the time of the arbitrary delay of the timer query
    .wait(1500)
    // Afterwards the loadingIndicator should be gone again
    .expect(loadingIndicator.exists)
    .notOk();
});

test('should filter the correct values and not rewrite the input', async (testController: TestController) => {
  await testController
    .click(comboboxInput)
    .expect(comboboxOverlayPane.exists)
    .ok()
    // Remove content from the combobox filter
    .pressKey('backspace 2')
    // Wait for the options loader to update
    .expect(loadingIndicator.exists)
    .ok()
    .wait(1500)
    .expect(loadingIndicator.exists)
    .notOk()

    // Expect the options count to prevent anticipating more than the
    // checked below options
    .expect(option.count)
    .eql(1)
    // Check all options and rendered values
    .expect(option.nth(0).textContent)
    .contains('Value 2');
});

test('should not reset the value when hitting continuously typing the backspace key', async (testController: TestController) => {
  await testController
    .click(comboboxInput)
    .expect(comboboxOverlayPane.exists)
    .ok()
    .pressKey(
      'backspace backspace backspace backspace backspace backspace backspace',
    )
    // Wait for the options loader to update
    .expect(loadingIndicator.exists)
    .ok()
    .wait(1500)
    .expect(loadingIndicator.exists)
    .notOk()

    // Expect the options count to prevent anticipating more than the
    // checked below options
    .expect(option.count)
    .eql(3)
    // Check all options and rendered values
    .expect(option.nth(0).textContent)
    .contains('Value 1')
    // Check all options and rendered values
    .expect(option.nth(1).textContent)
    .contains('Value 2')
    // Check all options and rendered values
    .expect(option.nth(2).textContent)
    .contains('Value 3');
});

test('should reset the value when setting the value programmatically to null', async (testController: TestController) => {
  await testController
    .expect(comboboxInput.value)
    .eql('Value 1')
    .click(resetValueButton)
    .expect(comboboxInput.value)
    .eql('');
});
