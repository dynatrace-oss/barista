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

export const body = Selector('body');
export const chartTypePie = Selector('#chart-type-pie');
export const chartTypeDonut = Selector('#chart-type-donut');
export const overlay = Selector('.dt-overlay-container');

const getBrowserSelectors = (nth: number) => ({
  pie: Selector(`.dt-radial-chart-series-group:nth-of-type(${nth})`),
  piePath: Selector(
    `.dt-radial-chart-series-group:nth-of-type(${nth}) .dt-radial-chart-series`,
  ),
  legend: Selector(`dt-legend-item:nth-of-type(${nth})`),
  legendSymbol: Selector(
    `dt-legend-item:nth-of-type(${nth}) .dt-radial-chart-legend-symbol`,
  ),
});

export const chrome = getBrowserSelectors(1);
export const safari = getBrowserSelectors(2);
export const firefox = getBrowserSelectors(3);
export const edge = getBrowserSelectors(4);

export const pieSelected = Selector('.dt-radial-chart-path-selected');

// interaction

export const absoluteBtn = Selector('#chart-value-mode-absolute');
export const percentBtn = Selector('#chart-value-mode-percent');

export const selectableBtn = Selector('#chart-selectable');
export const nonSelectableBtn = Selector('#chart-non-selectable');

export const setSelectBtn = Selector('#chart-set-select');
