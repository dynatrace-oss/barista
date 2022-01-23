/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
  stackedSeriesChartDemoData_2h,
  stackedSeriesChartDemoData_30m,
  stackedSeriesChartDemoData_7d,
} from '../stacked-series-chart-demo-data';
import { timeMinute, timeHour } from 'd3-time';
import {
  DtStackedSeriesChartSeries,
  DtStackedSeriesChartValueContinuousAxisMap,
  TimeInterval,
} from '@dynatrace/barista-components/stacked-series-chart';

enum TimeIntervalKey {
  fiveMin,
  halfHour,
  hour,
}
enum DataKey {
  conversionBounces,
  histogramThirtyMin,
  histogramSevenDays,
}

const conversionBouncesMap = ({ origin }) => {
  const [hours, minutes] = origin.label.split(':').map(Number);
  return new Date(0, 0, 0, hours, minutes, 0, 0);
};
const histogramMap = ({ origin }) => new Date(origin.timeDate);
@Component({
  selector: 'dt-example-stacked-series-chart-date-barista',
  templateUrl: './stacked-series-chart-date-example.html',
})
export class DtExampleStackedSeriesChartDate {
  mode: 'bar' | 'column' = 'column';

  enableTimeInterval = false;
  timeIntervalKey = TimeIntervalKey.fiveMin;
  timeIntervalEvery: { [key: string]: TimeInterval | null } = {
    [TimeIntervalKey.fiveMin]: timeMinute.every(5),
    [TimeIntervalKey.halfHour]: timeMinute.every(30),
    [TimeIntervalKey.hour]: timeHour.every(1),
  };
  dataKey = DataKey.conversionBounces;
  dataByKey: {
    [key: string]: {
      series: DtStackedSeriesChartSeries[];
      continuousAxisMap: DtStackedSeriesChartValueContinuousAxisMap;
    };
  } = {
    [DataKey.conversionBounces]: {
      series: stackedSeriesChartDemoData_2h,
      continuousAxisMap: conversionBouncesMap,
    },
    [DataKey.histogramThirtyMin]: {
      series: stackedSeriesChartDemoData_30m,
      continuousAxisMap: histogramMap,
    },
    [DataKey.histogramSevenDays]: {
      series: stackedSeriesChartDemoData_7d,
      continuousAxisMap: histogramMap,
    },
  };
  continuousAxisInterval = timeMinute.every(5);
  continuousAxisFormat = '%H:%M';

  DataKey = DataKey;
  TimeIntervalKey = TimeIntervalKey;
}
