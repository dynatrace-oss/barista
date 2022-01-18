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
import {
  disableButton,
  getActiveElementText,
  overlay,
  toggleDisable,
  trigger,
} from './overlay.po';
import { resetWindowSizeToDefault, waitForAngular } from '../../utils';

fixture('Overlay')
  .page('http://localhost:4200/overlay')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should open the overlay when not disabled', async (testController: TestController) => {
  await testController.hover(trigger);
  await testController.expect(await overlay.exists).ok();
});

test('should not open when disabled', async (testController: TestController) => {
  await toggleDisable();
  await testController.hover(trigger);
  await testController.expect(await overlay.exists).notOk();
});

test('should open the overlay on mouseover and close on mouseout', async (testController: TestController) => {
  await testController.hover(trigger);
  await testController.expect(await overlay.exists).ok();
  await testController.hover(disableButton);
  await testController.expect(await overlay.exists).notOk();
});

test('should trap the focus inside the overlay', async (testController: TestController) => {
  await testController.click(trigger);
  await testController.expect(await overlay.exists).ok();

  await testController.expect(await getActiveElementText()).eql('Focus me');

  await testController.pressKey('tab');

  await testController
    .expect(await getActiveElementText())
    .eql('Focus me next');

  await testController.pressKey('tab');

  await testController.expect(await getActiveElementText()).eql('Focus me');
});
