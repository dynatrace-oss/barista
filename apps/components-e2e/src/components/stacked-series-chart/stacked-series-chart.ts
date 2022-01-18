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

import { Component, ChangeDetectorRef } from '@angular/core';
import {
  DtStackedSeriesChartNode,
  DtStackedSeriesChartSeries,
  DtStackedSeriesChartFillMode,
  DtStackedSeriesChartValueDisplayMode,
  DtStackedSeriesChartLegend,
  DtStackedSeriesChartMode,
  DtStackedSeriesChartSelectionMode,
  DtStackedSeriesChartLabelAxisMode,
  DtStackedSeriesChartValueContinuousAxisMap,
  DtStackedSeriesChartValueContinuousAxisType,
  TimeInterval,
} from '@dynatrace/barista-components/stacked-series-chart';
import {
  stackedSeriesChartCoffeeMock,
  stackedSeriesChartConvertedBouncedDateHeatFieldMock,
  stackedSeriesChartConvertedBouncedDateHeatFieldOverlapMock,
  stackedSeriesChartConvertedBouncedDatesMock,
  stackedSeriesCoffeeHeatFieldMock,
  stackedSeriesCoffeeHeatFieldOverlapMock,
} from './stacked-series-chart.mocks';
import { timeHour, timeMinute } from 'd3-time';

@Component({
  selector: 'dt-e2e-stacked-series-chart',
  templateUrl: 'stacked-series-chart.html',
})
export class DtE2EStackedSeriesChart {
  selected: [DtStackedSeriesChartSeries, DtStackedSeriesChartNode] | [];
  selectionMode: DtStackedSeriesChartSelectionMode;
  continuousAxisType: DtStackedSeriesChartValueContinuousAxisType;
  continuousAxisInterval: TimeInterval | null;
  continuousAxisFormat: string | undefined;
  continuousAxisMap: DtStackedSeriesChartValueContinuousAxisMap | undefined;
  selectable: boolean;
  valueDisplayMode: DtStackedSeriesChartValueDisplayMode;
  mode: DtStackedSeriesChartMode;
  fillMode: DtStackedSeriesChartFillMode;
  visibleValueAxis = true;
  visibleLegend = true;
  visibleLabel = true;
  labelAxisMode: DtStackedSeriesChartLabelAxisMode = 'full';
  visibleTrackBackground = true;
  maxTrackSize = 16;
  max: number | undefined;
  usedLegends: DtStackedSeriesChartLegend[] | undefined;

  continuousAxisIntervals = [
    timeMinute.every(5),
    timeMinute.every(30),
    timeHour.every(1),
  ];
  continuousAxisFormatsByType = {
    linear: ['$.2f', '$.7f'],
    date: ['%H:%M', '%H:%M:%S:%L%p'],
  };

  continuousAxisMapByType = {
    linear: ({ origin }) =>
      this.usedSeries.reduce(
        (obj, { label }, index) => ({ ...obj, [label]: index * 0.5 }),
        {},
      )[origin.label],
    date: ({ origin }) => {
      const [hours, minutes] = origin.label.split(':').map(Number);
      return new Date(0, 0, 0, hours, minutes, 0, 0);
    },
  };
  heatFieldsByType = {
    none: {
      normal: stackedSeriesCoffeeHeatFieldMock,
      overlap: stackedSeriesCoffeeHeatFieldOverlapMock,
    },
    linear: {
      normal: stackedSeriesCoffeeHeatFieldMock,
      overlap: stackedSeriesCoffeeHeatFieldOverlapMock,
    },
    date: {
      normal: stackedSeriesChartConvertedBouncedDateHeatFieldMock,
      overlap: stackedSeriesChartConvertedBouncedDateHeatFieldOverlapMock,
    },
  };
  heatFieldType = 'none';

  series: DtStackedSeriesChartSeries[] = stackedSeriesChartCoffeeMock;
  usedSeries: DtStackedSeriesChartSeries[] = this.series;

  legends: DtStackedSeriesChartLegend[] = [
    { label: 'Coffee', color: '#7c38a1', visible: false },
    { label: 'Milk', color: '#fff29a', visible: true },
    { label: 'Water', color: '#4fd5e0', visible: true },
    { label: 'Chocolate', color: '#debbf3', visible: true },
  ];

  elementWidth = '800px';

  constructor(private changeDetector: ChangeDetectorRef) {
    this.reset();
  }

  reset(): void {
    this.selected = [];
    this.selectionMode = 'node';
    this.selectable = false;
    this.valueDisplayMode = 'none';
    this.mode = 'bar';
    this.fillMode = 'relative';
    this.visibleValueAxis = true;
    this.visibleLegend = true;
    this.visibleLabel = true;
    this.labelAxisMode = 'full';
    this.visibleTrackBackground = true;
    this.maxTrackSize = 16;
    this.max = undefined;
    this.usedLegends = undefined;
    // force recalculation of legends
    this.elementWidth = '800px';
    this.changeContinuousAxisType('none');
    this.continuousAxisInterval = null;
    this.continuousAxisFormat = undefined;
    this.heatFieldType = 'none';
  }

  setElementWidth(width: string): void {
    this.elementWidth = width;
    this.changeDetector.detectChanges();
  }

  changeContinuousAxisType(
    type: DtStackedSeriesChartValueContinuousAxisType,
  ): void {
    this.continuousAxisType = type;

    this.continuousAxisMap = this.continuousAxisMapByType[type];
    if (type === 'date') {
      this.series = stackedSeriesChartConvertedBouncedDatesMock;
    } else {
      this.series = stackedSeriesChartCoffeeMock;
    }

    const continuousAxisFormats = this.continuousAxisFormatsByType[type] || [];
    if (!continuousAxisFormats.includes(this.continuousAxisFormat)) {
      this.continuousAxisFormat = continuousAxisFormats[0];
    }

    this.usedSeries = this.series.slice();
  }
}
