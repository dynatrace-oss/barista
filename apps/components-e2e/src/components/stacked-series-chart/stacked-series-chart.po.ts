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
export const chart = Selector('test-stacked-series-chart');
export const chartContainer = Selector('.dt-stacked-series-chart-container');
export const overlay = Selector('.dt-overlay-container');
export const columnChart = Selector('.dt-stacked-series-chart-column');
export const barChart = Selector('.dt-stacked-series-chart-bar');

export const trackWrapper = Selector('.dt-stacked-series-chart-track-wrapper');
export const tracks = Selector('.dt-stacked-series-chart-track');
export const slices = Selector('.dt-stacked-series-chart-slice');
export const labels = Selector(
  '.dt-stacked-series-chart-track-label:not(.dt-stacked-series-chart-track-label-default)',
);
export const valueAxis = Selector('.dt-stacked-series-chart-value-axis');
export const ticks = Selector('.dt-stacked-series-chart-axis-tick');
export const legend = Selector('.dt-stacked-series-chart-legend');
export const legendItems = Selector('dt-legend-item');
export const heatFieldWrapper = Selector(
  '.dt-stacked-series-chart-heat-field-wrapper',
);
export const getHeatFieldArea = trackWrapper.child(
  '.dt-stacked-series-chart-heat-field-area',
);
export const getHeatFieldTooltip = Selector('dt-overlay-container div');

export const getTrack = (track: number) => tracks.nth(track);
export const getSlice = (track: number, slice: number) =>
  getTrack(track).child('.dt-stacked-series-chart-slice').nth(slice);
export const getLabel = (label: number) => labels.nth(label);
export const getLegendItem = (item: number) =>
  Selector(`dt-legend-item`).nth(item);
export const getTick = (tick: number) =>
  Selector(`.dt-stacked-series-chart-axis-tick`).nth(tick);
export const getHeatFieldLevel = (level: number) =>
  heatFieldWrapper.child(`.dt-stacked-series-chart-heat-field-level-${level}`);
export const getHeatFieldItemByLevel = (level: number, item: number) =>
  getHeatFieldLevel(level).nth(item);

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

export const fullLabelAxisModeBtn = Selector('#chart-full-label-axis-mode');
export const compactLabelAxisModeBtn = Selector(
  '#chart-compact-label-axis-mode',
);
export const autoLabelAxisModeBtn = Selector('#chart-auto-label-axis-mode');

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

export const chartWidth1200Btn = Selector('#chart-width-1200');
export const chartWidth800Btn = Selector('#chart-width-800');
export const chartWidth400Btn = Selector('#chart-width-400');

export const selectionModeNode = Selector('#chart-selection-mode-node');
export const selectionModeStack = Selector('#chart-selection-mode-stack');

export const continuousAxisTypeNone = Selector(
  '#chart-continuous-axis-type-none',
);
export const continuousAxisTypeLinear = Selector(
  '#chart-continuous-axis-type-linear',
);
export const continuousAxisTypeDate = Selector(
  '#chart-continuous-axis-type-date',
);

export const continuousAxisIntervalFiveMin = Selector(
  '#chart-continuous-axis-interval-five-min',
);
export const continuousAxisIntervalHalfHour = Selector(
  '#chart-continuous-axis-interval-half-hour',
);
export const continuousAxisIntervalHour = Selector(
  '#chart-continuous-axis-interval-hour',
);

export const continuousAxisFormatShort = Selector(
  '#chart-continuous-axis-format-short',
);
export const continuousAxisFormatLong = Selector(
  '#chart-continuous-axis-format-long',
);

export const continuousAxisFormat2f = Selector(
  '#chart-continuous-axis-format-2f',
);
export const continuousAxisFormat7f = Selector(
  '#chart-continuous-axis-format-7f',
);

export const heatFieldTypeNone = Selector('#chart-heat-field-none');
export const heatFieldTypeNormal = Selector('#chart-heat-field-normal');
export const heatFieldTypeOverlap = Selector('#chart-heat-field-overlap');
