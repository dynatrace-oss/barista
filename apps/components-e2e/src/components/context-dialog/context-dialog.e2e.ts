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
  contextDialog,
  contextDialogPanel,
  disableToggle,
  backdrop,
  overlayPane,
} from './context-dialog.po';

import { getActiveElementText } from '../overlay/overlay.po';
import { resetWindowSizeToDefault, waitForAngular } from '../../utils';

fixture('Context Dialog')
  .page('http://localhost:4200/context-dialog')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should open the context dialog when not disabled', async (testController: TestController) => {
  await testController
    .click(contextDialog, { speed: 0.3 })
    .expect(contextDialogPanel.exists)
    .ok()
    .expect(contextDialogPanel.visible)
    .ok();
});

test('should not execute click handlers when disabled', async (testController: TestController) => {
  await testController
    .click(disableToggle, { speed: 0.3 })
    .click(contextDialog)
    .expect(contextDialogPanel.exists)
    .notOk();
});

test('should trap the focus inside the overlay', async (testController: TestController) => {
  await testController
    .click(contextDialog, { speed: 0.3 })
    .expect(getActiveElementText())
    .eql('Edit')
    .pressKey('tab')
    .expect(getActiveElementText())
    .eql('');
});

test('should open and close the context dialog', async (testController: TestController) => {
  await testController
    .click(contextDialog, { speed: 0.3 })
    .expect(contextDialogPanel.exists)
    .ok()
    .expect(contextDialogPanel.visible)
    .ok()
    .click(backdrop, { speed: 0.3 })
    .expect(contextDialogPanel.exists)
    .notOk();
});

test('should propagate attribute to overlay', async (testController: TestController) => {
  await testController
    .click(contextDialog, { speed: 0.3 })
    .expect(overlayPane.getAttribute('dt-ui-test-id'))
    .contains('context-dialog-overlay');
});
