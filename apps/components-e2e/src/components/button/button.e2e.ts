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

import { button, clickCounter, disableButton } from './button.po';

fixture('Button').page('http://localhost:4200/button');

test('should execute click handlers when not disabled', async (testController: TestController) => {
  await testController.click(button);

  const count = await clickCounter.textContent;
  await testController.expect(count).eql('1');
});

test('should not execute click handlers when disabled', async (testController: TestController) => {
  await testController.click(disableButton);

  await testController.expect(button.hasAttribute('disabled')).ok();

  await testController.click(button);
  await testController.expect(await clickCounter.textContent).eql('0');
});
