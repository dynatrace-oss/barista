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

import { Selector, ClientFunction } from 'testcafe';

export const contextDialog = Selector('#context-dialog');
export const disableToggle = Selector('#disable-toggle');
export const contextDialogPanel = Selector('.dt-context-dialog-panel');
export const backdrop = Selector('.cdk-overlay-backdrop');
export const overlayPane = Selector('.cdk-overlay-pane');

export const getActiveElementText = ClientFunction(() => {
  const element = document.activeElement;

  if (!element) {
    return '';
  }
  return element.textContent || '';
});

export const getActiveElementAriaLabel = ClientFunction(() => {
  const element = document.activeElement;

  if (!element) {
    return '';
  }
  return element.getAttribute('aria-label') || '';
});
