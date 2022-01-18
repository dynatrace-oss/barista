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
import { emptyStateItem, emptyStateHorizontalWrapper } from './empty-state.po';

fixture('Empty state')
  .page('http://localhost:4200/empty-state')
  .beforeEach(async () => {
    await waitForAngular();
    await resetWindowSizeToDefault();
  });

test('should show three items vertically aligned', async (testController: TestController) => {
  await testController
    .expect(emptyStateItem.count)
    .eql(3)
    .expect(emptyStateHorizontalWrapper.exists)
    .notOk();
});

test('should show three items horizontally aligned on smaller screens', async (testController: TestController) => {
  await testController
    .resizeWindow(570, 800)
    .expect(emptyStateItem.count)
    .eql(3)
    .expect(emptyStateHorizontalWrapper.exists)
    .ok();
});

test('should show three items vertically aligned on very small screens', async (testController: TestController) => {
  await testController
    .resizeWindow(250, 800)
    .expect(emptyStateItem.count)
    .eql(3)
    .expect(emptyStateHorizontalWrapper.exists)
    .notOk();
});
