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

import { Selector } from 'testcafe';

// tslint:disable-next-line: dt-no-focused-tests
fixture
  .only('Scroll Spy - ALERT')
  .page('http://localhost:4200/components/alert');

/**
 * * TESTCASES TO COVER:
 * - Highlight the first toc item when clicked on the first.
 * - Highlight the second item when scrolled to the second.
 * - Highlight the last item when scrolled to the bottom.
 * - Highlight sub item when scrolled + clicked on that item.
 */

test('should highlight correct headline after scrolling', async (testController: TestController) => {
  await testController
    .wait(200)
    .click('a[id="do-s-and-don-ts"')
    .wait(200)
    .expect(
      Selector('a.ba-toc-item.ba-toc-item-active').getStyleProperty(
        'background-color',
      ),
    )
    .eql('rgb(82, 108, 255)');
});
