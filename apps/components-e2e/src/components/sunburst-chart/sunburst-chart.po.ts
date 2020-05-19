/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

export const body = Selector('body');
export const chart = Selector('test-sunburst-chart');
export const overlay = Selector('.dt-sunburst-chart-overlay-panel');

export const centralLabel = Selector('.dt-sunburst-chart-selected-label');
export const centralValue = Selector('.dt-sunburst-chart-selected-value');

export const absoluteBtn = Selector('#chart-value-mode-absolute');
export const percentBtn = Selector('#chart-value-mode-percent');

export const segments = Selector('.dt-sunburst-chart-group');
export const sliceShephard = Selector(
  '.dt-sunburst-chart-group:nth-of-type(5) .dt-sunburst-chart-slice',
);
export const valueJack = Selector(
  '.dt-sunburst-chart-group:nth-of-type(8) .dt-sunburst-chart-slice-label',
);
