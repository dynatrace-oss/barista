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

import { Selector } from 'testcafe';
import { resetWindowSizeToDefault, waitForAngular } from '../../utils';

const label = Selector('#dt-pagination-label-1');
const next = Selector('.dt-pagination-next button');
const clickPage = (page: number) =>
  Selector(`.dt-pagination-list li:nth-child(${page})`);

fixture('Pagination')
  .page('http://localhost:4200/pagination')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should have default select', async (testController: TestController) => {
  await testController.expect(await label.textContent).eql('1');
});

test('should go to next page', async (testController: TestController) => {
  await testController.click(next);
  await testController.expect(await label.textContent).eql('2');
});

test('should go to last page', async (testController: TestController) => {
  await testController.click(clickPage(8));
  await testController.expect(await label.textContent).eql('10');
});

test('should go through all pages', async (testController: TestController) => {
  for (let i = 2; i <= 10; i++) {
    await testController.click(next);
    await testController.expect(await label.textContent).eql(`${i}`);
  }
});
