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

import { Component } from '@angular/core';
import {
  DtStackedSeriesChartNode,
  DtStackedSeriesChartSeries,
  DtStackedSeriesChartFillMode,
  DtStackedSeriesChartValueDisplayMode,
  DtStackedSeriesChartLegend,
  DtStackedSeriesChartMode,
} from '@dynatrace/barista-components/stacked-series-chart';
import { DtColors } from '@dynatrace/barista-components/theming';

@Component({
  selector: 'dt-e2e-stacked-series-chart',
  templateUrl: 'stacked-series-chart.html',
})
export class DtE2EStackedSeriesChart {
  selected: [DtStackedSeriesChartSeries, DtStackedSeriesChartNode] | [];
  selectable: boolean;
  valueDisplayMode: DtStackedSeriesChartValueDisplayMode;
  mode: DtStackedSeriesChartMode;
  fillMode: DtStackedSeriesChartFillMode;
  visibleValueAxis: boolean = true;
  visibleLegend: boolean = true;
  visibleLabel: boolean = true;
  visibleTrackBackground: boolean = true;
  maxTrackSize: number = 16;
  max: number | undefined;
  usedLegends: DtStackedSeriesChartLegend[] | undefined;

  series: DtStackedSeriesChartSeries[] = [
    {
      label: 'Espresso',
      nodes: [
        {
          value: 1,
          color: DtColors.SHAMROCKGREEN_700,
          label: 'Coffee',
        },
      ],
    },
    {
      label: 'Macchiato',
      nodes: [
        {
          value: 2,
          label: 'Coffee',
        },
        {
          value: 1,
          label: 'Milk',
        },
      ],
    },
    {
      label: 'Americano',
      nodes: [
        {
          value: 2,
          label: 'Coffee',
        },
        {
          value: 3,
          label: 'Water',
        },
      ],
    },
    {
      label: 'Mocha',
      nodes: [
        {
          value: 2,
          label: 'Coffee',
        },
        {
          value: 2,
          label: 'Chocolate',
        },
        {
          value: 1,
          label: 'Milk',
        },
      ],
    },
  ];

  legends: DtStackedSeriesChartLegend[] = [
    { label: 'Coffee', color: '#7c38a1', visible: false },
    { label: 'Milk', color: '#fff29a', visible: true },
    { label: 'Water', color: '#4fd5e0', visible: true },
    { label: 'Chocolate', color: '#debbf3', visible: true },
  ];

  usedSeries: DtStackedSeriesChartSeries[] = this.series;

  constructor() {
    this.reset();
  }

  reset() {
    this.selected = [];
    this.selectable;
    this.valueDisplayMode;
    this.mode = 'bar';
    this.fillMode = 'relative';
    this.visibleValueAxis = true;
    this.visibleLegend = true;
    this.visibleLabel = true;
    this.visibleTrackBackground = true;
    this.maxTrackSize = 16;
    this.max = undefined;
    this.usedLegends = undefined;
    // force recalculation of legends
    this.usedSeries = this.series.slice();
  }
}
