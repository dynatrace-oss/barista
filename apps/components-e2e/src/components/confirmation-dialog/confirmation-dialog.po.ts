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

import { Selector } from 'testcafe';

export const openDialogButton = Selector('.open-dialog-button');
export const enableBackdropButton = Selector('.enable-backdrop-button');
export const clearButton = Selector('#clear-button');
export const saveButton = Selector('#save-button');
export const successDialog = Selector(
  '#state-success>.dt-confirmation-dialog-state-container',
);
export const dirtyDialog = Selector(
  '#state-dirty>.dt-confirmation-dialog-state-container',
);
export const overlayPane = Selector('.cdk-overlay-pane');
