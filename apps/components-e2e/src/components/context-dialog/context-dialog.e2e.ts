/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
  contextDialog,
  contextDialogPanel,
  disableToggle,
  getActiveElementAriaLabel,
  closeButton,
} from './context-dialog.po';

import { getActiveElementText } from '../overlay/overlay.po';

fixture('Context Dialog').page('http://localhost:4200/context-dialog');

test('should open the context dialog when not disabled', async (testController: TestController) => {
  await testController.click(contextDialog);
  await testController.expect(await contextDialogPanel.exists).ok();
  await testController.expect(await contextDialogPanel.visible).ok();
});

test('should not execute click handlers when disabled', async (testController: TestController) => {
  await testController.click(disableToggle);
  await testController.click(contextDialog);
  await testController.expect(await contextDialogPanel.exists).notOk();
});

test('should trap the focus inside the overlay', async (testController: TestController) => {
  await testController.click(contextDialog);
  await testController.expect(await getActiveElementText()).eql('Edit');

  await testController.pressKey('tab');
  await testController.expect(await getActiveElementAriaLabel()).eql('close');

  await testController.pressKey('tab');
  await testController.expect(await getActiveElementText()).eql('Edit');
});

test('should open and close the context dialog', async (testController: TestController) => {
  await testController.click(contextDialog);
  await testController.expect(await contextDialogPanel.exists).ok();
  await testController.expect(await contextDialogPanel.visible).ok();
  await testController.click(closeButton);
  await testController.expect(await contextDialogPanel.exists).notOk();
});
