/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { groupItem, isDisabled, isChecked, labelText } from './button-group.po';

fixture('Button Group').page('http://localhost:4200/button-group');

test('should execute click handlers when not disabled', async (testController: TestController) => {
  await testController.click(groupItem(1));
  await testController.expect(await labelText(1)).match(/Value 1/);

  await testController.click(groupItem(0));
  await testController.expect(await labelText(1)).match(/Value 0/);
});

test('should have styles', async (testController: TestController) => {
  await testController.click(groupItem(0));
  await testController.expect(await isChecked(groupItem(0))).ok();
  await testController.expect(await isChecked(groupItem(1))).notOk();

  await testController.click(groupItem(1));
  await testController.expect(await isChecked(groupItem(0))).notOk();
  await testController.expect(await isChecked(groupItem(1))).ok();
});

test('should not execute click handlers when disabled', async (testController: TestController) => {
  await testController.expect(await isDisabled(groupItem(1, 2))).ok();
  await testController.expect(await labelText(2)).eql('');
});

test('should not execute click handlers when item disabled', async (testController: TestController) => {
  await testController.expect(await isDisabled(groupItem(1, 3))).ok();
  await testController.expect(await labelText(3)).eql('Value 0');
});
