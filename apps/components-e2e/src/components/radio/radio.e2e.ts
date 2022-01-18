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
  inputLeaf,
  inputWater,
  isRadioChecked,
  isRadioDisabled,
  radioLeaf,
  radioWater,
  toggleDisable,
} from './radio.po';
import { resetWindowSizeToDefault, waitForAngular } from '../../utils';

fixture('Radio')
  .page('http://localhost:4200/radio')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should be checked when clicked', async (testController: TestController) => {
  await testController.click(radioWater);
  await testController.expect(await isRadioChecked(radioWater)).ok();
  await testController.expect(await inputWater.checked).ok();
  await testController.expect(await inputLeaf.checked).notOk();

  await testController.click(radioLeaf);
  await testController.expect(await isRadioChecked(radioLeaf)).ok();
  await testController.expect(await inputWater.checked).notOk();
  await testController.expect(await inputLeaf.checked).ok();
});

test('should be disabled when disable the radio group', async (testController: TestController) => {
  await toggleDisable();
  await testController.expect(await isRadioDisabled(radioWater)).ok();
  await testController.expect(await inputWater.hasAttribute('disabled')).ok();

  await testController.click(radioWater);
  await testController.expect(await inputWater.checked).notOk();

  await testController.expect(await isRadioDisabled(radioLeaf)).ok();
  await testController.expect(await inputLeaf.hasAttribute('disabled')).ok();

  await testController.click(radioLeaf);
  await testController.expect(await inputLeaf.checked).notOk();
});
