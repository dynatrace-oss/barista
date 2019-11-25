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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { clickOption, errorBox, input } from './filter-field.po';

fixture('Filter Field').page('http://localhost:4200/filter-field');

test('should not show a error box if there is no validator provided', async (testController: TestController) => {
  await clickOption(1);
  await testController.typeText(input, 'abc');
  await testController.expect(await errorBox.exists).notOk();
});

test('should show a error box if does not meet the validation function', async (testController: TestController) => {
  await clickOption(3);
  await testController.typeText(input, 'a');
  await testController.expect(await errorBox.exists).ok();
  await testController
    .expect(await errorBox.innerText)
    .match(/min 3 characters/gm);
});

// TODO: lukas.holzer investigate why this test is flaky on Browserstack
// tslint:disable-next-line: dt-no-focused-tests
test.skip('should show is required error when the input is dirty', async (testController: TestController) => {
  await clickOption(3);
  await testController.typeText(input, 'a');
  await testController.pressKey('backspace');
  await testController.expect(await errorBox.exists).ok();
  await testController
    .expect(await errorBox.innerText)
    .match(/field is required/gm);
});

test('should hide the error box when the node was deleted', async (testController: TestController) => {
  await clickOption(3);
  await testController.pressKey('backspace').pressKey('backspace');
  await testController.expect(await errorBox.exists).notOk();
});
