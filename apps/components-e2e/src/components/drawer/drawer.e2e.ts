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
import { Selector } from 'testcafe';

const openCount = Selector('#open-count');
const closeCount = Selector('#close-count');
const open = Selector('#open');
const close = Selector('#close');

fixture('Drawer').page('http://localhost:4200/drawer');

test('should open drawer on button click', async (testController: TestController) => {
  await testController.expect(await openCount.textContent).eql('0');
  await testController.click(open);
  // wait the 500 ms til the open animation is finished
  await testController.wait(500);
  await testController.expect(await openCount.textContent).eql('1');
});

test('should close drawer on button click', async (testController: TestController) => {
  await testController.click(open);
  await testController.expect(await closeCount.textContent).eql('0');
  await testController.click(close);
  await testController.expect(await closeCount.textContent).eql('1');
});
