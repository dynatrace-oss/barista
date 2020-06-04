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

fixture('Scroll Spy - CHART').page('http://localhost:4200/components/chart');

test('should highlight correct headline after scrolling', async (testController: TestController) => {
  await testController
    .wait(200)
    .click('a[id="imports"')
    .wait(200)
    .expect(
      Selector('a.ba-toc-item.ba-toc-item-active').getStyleProperty(
        'background-color',
      ),
    )
    .eql('rgb(82, 108, 255)');

  await testController
    .wait(200)
    .click('a[id="legend"')
    .wait(200)
    .expect(Selector('a[id="legend"]').getStyleProperty('background-color'))
    .eql('rgb(82, 108, 255)');
});
