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
  openDialogButton,
  clearButton,
  saveButton,
  successDialog,
  dirtyDialog,
  enableBackdropButton,
  overlayPane,
} from './confirmation-dialog.po';
import { resetWindowSizeToDefault, waitForAngular } from '../../utils';

fixture('Confirmation Dialog')
  .page('http://localhost:4200/confirmation-dialog')
  .beforeEach(async () => {
    await resetWindowSizeToDefault();
    await waitForAngular();
  });

test('should open popup after click start and close after click clear', async (testController: TestController) => {
  await testController
    .expect(saveButton.count)
    .eql(0)
    .click(openDialogButton)
    .expect(saveButton.count)
    .eql(1)
    .expect(clearButton.visible)
    .ok()
    .expect(saveButton.visible)
    .ok()
    .click(clearButton)
    .expect(saveButton.count)
    .eql(0);
});

test('should open popup after click start, swap after click save and close', async (testController: TestController) => {
  await testController
    .expect(saveButton.count)
    .eql(0)
    .expect(dirtyDialog.count)
    .eql(0)
    .expect(successDialog.count)
    .eql(0)
    .click(openDialogButton)
    .expect(saveButton.count)
    .eql(1)
    .expect(clearButton.visible)
    .ok()
    .expect(saveButton.visible)
    .ok()
    .expect(dirtyDialog.visible)
    .ok()
    .click(saveButton)
    .expect(saveButton.count)
    .eql(0)
    .expect(dirtyDialog.count)
    .eql(0)
    .expect(successDialog.count)
    .eql(1)
    .wait(2500)
    .expect(dirtyDialog.count)
    .eql(0)
    .expect(successDialog.count)
    .eql(0);
});

test('should propagate attribute to overlay', async (testController: TestController) => {
  await testController
    .expect(saveButton.count)
    .eql(0)
    .expect(dirtyDialog.count)
    .eql(0)
    .expect(successDialog.count)
    .eql(0)
    .click(openDialogButton)
    .expect(overlayPane.getAttribute('dt-ui-test-id'))
    .contains('confirmation-dialog-overlay');
});
