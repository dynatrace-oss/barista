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

import { tile, clickCounter } from './tile.po';
import { resetWindowSizeToDefault, waitForAngular } from '../../utils';

fixture('Tile')
  .page('http://localhost:4200/tile')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should execute click handlers when not disabled', async (testController: TestController) => {
  await testController.click(tile);

  const count = await clickCounter.textContent;
  await testController.expect(count).eql('1');
});
