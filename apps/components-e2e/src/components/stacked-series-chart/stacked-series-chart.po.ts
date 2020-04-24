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
export const chart = Selector('test-stacked-series-chart');
export const overlay = Selector('.dt-overlay-container');
export const columnChart = Selector('.dt-stacked-series-chart-column');
export const barChart = Selector('.dt-stacked-series-chart-bar');

export const tracks = Selector('.dt-stacked-series-chart-track');
export const slices = Selector('.dt-stacked-series-chart-slice');
export const labels = Selector('.dt-stacked-series-chart-track-label');
export const valueAxis = Selector('.dt-stacked-series-chart-value-axis');
export const ticks = Selector('.dt-stacked-series-chart-axis-tick');
export const legend = Selector('.dt-stacked-series-chart-legend');
export const legendItems = Selector('dt-legend-item');

export const getTrack = (track: number) =>
  Selector(`.dt-stacked-series-chart-track `).nth(track);
export const getSlice = (track: number, slice: number) =>
  Selector('.dt-stacked-series-chart-track')
    .nth(track)
    .child('.dt-stacked-series-chart-slice')
    .nth(slice);
export const getLabel = (label: number) =>
  Selector(`.dt-stacked-series-chart-track-label`).nth(label);
export const getLegendItem = (item: number) =>
  Selector(`dt-legend-item`).nth(item);
export const getTick = (tick: number) =>
  Selector(`.dt-stacked-series-chart-axis-tick`).nth(tick);

// controls
export const resetBtn = Selector('#chart-reset');

export const barBtn = Selector('#chart-mode-bar');
export const columnBtn = Selector('#chart-mode-column');

export const noneBtn = Selector('#chart-value-mode-none');
export const absoluteBtn = Selector('#chart-value-mode-absolute');
export const percentBtn = Selector('#chart-value-mode-percent');

export const fullTrackBtn = Selector('#chart-fill-mode-full');
export const relativeTrackBtn = Selector('#chart-fill-mode-relative');

export const multiTrackBtn = Selector('#chart-track-multi');
export const singleTrackBtn = Selector('#chart-track-single');

export const visibleValueAxisBtn = Selector('#chart-visible-value-axis');
export const nonVisibleValueAxisBtn = Selector('#chart-non-visible-value-axis');

export const visibleLegendBtn = Selector('#chart-visible-legend');
export const nonVisibleLegendBtn = Selector('#chart-non-visible-legend');

export const visibleLabelBtn = Selector('#chart-visible-label');
export const nonVisibleLabelBtn = Selector('#chart-non-visible-label');

export const visibleTrackBkgBtn = Selector('#chart-visible-track-background');
export const nonVisibleTrackBkgBtn = Selector(
  '#chart-non-visible-track-background',
);

export const smallTrackBtn = Selector('#chart-track-size-8');
export const bigTrackBtn = Selector('#chart-track-size-32');

export const noMaxBtn = Selector('#chart-no-max');
export const max10Btn = Selector('#chart-max-10');

export const setLegendsBtn = Selector('#chart-set-legends');
export const unsetLegendsBtn = Selector('#chart-unset-legends');

export const selectableBtn = Selector('#chart-selectable');
export const nonSelectableBtn = Selector('#chart-non-selectable');

export const selectBtn = Selector('#chart-select');
export const unselectBtn = Selector('#chart-unselect');
