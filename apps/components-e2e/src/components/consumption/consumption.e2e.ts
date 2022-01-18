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

import {
  consumption,
  dummyContent,
  mouseoutArea,
  overlayPane,
} from './consumption.po';
import { resetWindowSizeToDefault, waitForAngular } from '../../utils';

fixture('Consumption')
  .page('http://localhost:4200/consumption')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should show an overlay containing custom content while hovering and hide it when the mouse leaves the element', async (testController: TestController) => {
  await testController.hover(consumption);
  await testController.expect(await dummyContent.exists).ok();

  await testController.hover(mouseoutArea);
  await testController.expect(await dummyContent.exists).notOk();
});

test('should propagate attribute to overlay', async (testController: TestController) => {
  await testController
    .hover(consumption, { speed: 0.1 })
    .expect(overlayPane.getAttribute('dt-ui-test-id'))
    .contains('consumption-overlay');
});
