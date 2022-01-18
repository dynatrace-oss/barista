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

import { waitForAngular, resetWindowSizeToDefault } from '../../utils';
import { Selector } from 'testcafe';

const sliderContainer = Selector('.dt-slider-flex-container');

fixture('Slider')
  .page('http://localhost:4200/slider')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

// TODO: implement proper tests here, this is just a dummy test to show e2e test works
// issue link: https://github.com/dynatrace-oss/barista/issues/836
test('slider', async (testController: TestController) => {
  await testController
    .expect(await sliderContainer.getAttribute('class'))
    .contains('dt-slider-flex-container');
});
