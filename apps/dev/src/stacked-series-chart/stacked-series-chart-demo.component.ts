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

import { Component } from '@angular/core';
import {
  DtStackedSeriesChartFillMode,
  DtStackedSeriesChartMode,
  DtStackedSeriesChartNode,
  DtStackedSeriesChartSelectionMode,
  DtStackedSeriesChartSeries,
  DtStackedSeriesChartValueDisplayMode,
} from '@dynatrace/barista-components/stacked-series-chart';
import { stackedSeriesChartDemoData } from './stacked-series-chart-demo-data';

@Component({
  selector: 'stacked-series-chart-dev-app-demo',
  templateUrl: './stacked-series-chart-demo.component.html',
  styleUrls: ['./stacked-series-chart-demo.component.scss'],
})
export class StackedSeriesChartDemo {
  selectionMode: DtStackedSeriesChartSelectionMode = 'node';
  selectable = true;
  selected: [DtStackedSeriesChartSeries?, DtStackedSeriesChartNode?] = [
    stackedSeriesChartDemoData[3],
    stackedSeriesChartDemoData[3].nodes[1],
  ];
  valueDisplayMode: DtStackedSeriesChartValueDisplayMode = 'absolute';
  visibleLabel = true;
  visibleLegend = true;
  fillMode: DtStackedSeriesChartFillMode = 'relative';
  multiSeries = true;
  mode: DtStackedSeriesChartMode = 'column';
  maxTrackSize = 16;
  visibleTrackBackground = true;
  visibleValueAxis = true;
  labelAxisMode = 'auto';

  series = stackedSeriesChartDemoData;

  toggleSeries(multi: boolean): void {
    this.multiSeries = multi;
    this.series = multi
      ? stackedSeriesChartDemoData
      : [stackedSeriesChartDemoData[3]];
  }

  clearSelection(): void {
    this.selected = [];
  }
}
