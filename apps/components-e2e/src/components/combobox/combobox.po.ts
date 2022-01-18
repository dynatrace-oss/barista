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

export const combobox = Selector('.dt-combobox');
export const comboboxInput = Selector(
  '.dt-autocomplete-trigger.dt-combobox-input',
);
export const comboboxOverlayPane = Selector('.cdk-overlay-pane');

export const option = comboboxOverlayPane.find('.dt-option');

export const loadingIndicator = Selector(
  '.dt-combobox-postfix.dt-combobox-spinner',
);

export const resetValueButton = Selector('#resetValue');
