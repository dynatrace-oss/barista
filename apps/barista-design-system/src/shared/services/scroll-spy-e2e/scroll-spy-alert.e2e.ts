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

import { Selector, ClientFunction } from 'testcafe';

fixture('Scroll Spy - ALERT').page('http://localhost:4200/components/alert');

const scroll = ClientFunction(function (x: number): void {
  window.scrollBy(0, x);
});

test('should highlight the first toc item when first toc anchor is clicked', async (testController: TestController) => {
  await testController
    .click('a[id="imports"]')
    .wait(1000)
    .expect(
      Selector('li.ba-toc-item:first-child').hasClass('ba-toc-item-active'),
    )
    .ok();
});

test('should highlight the last toc item after click on last toc item anchor', async (testController: TestController) => {
  await testController
    .click('a[id="do-s-and-don-ts"')
    .expect(
      Selector('li.ba-toc-item:last-child').hasClass('ba-toc-item-active'),
    )
    .ok();
});

test('should highlight the second item after scrolling down', async (testController: TestController) => {
  await testController
    .wait(1000)
    .navigateTo('http://localhost:4200/components/alert#initialization')
    .expect(
      Selector('li.ba-toc-item:nth-child(2)').hasClass('ba-toc-item-active'),
    )
    .ok();
});

test('should highlight the last toc item after scrolling to the very bottom of the page', async (testController: TestController) => {
  await testController.wait(500);
  await scroll(100000);
  await testController
    .expect(
      Selector('li.ba-toc-item:last-child').hasClass('ba-toc-item-active'),
    )
    .ok();
});
