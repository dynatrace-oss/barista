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
import { stackedSeriesChartDemoDataConvertedBouncedDates } from '../stacked-series-chart-demo-data';
import { timeMinute, timeHour } from 'd3-time';
import { TimeInterval } from '@dynatrace/barista-components/stacked-series-chart';

// eslint-disable-next-line no-shadow
enum TimeIntervalKey {
  fiveMin,
  halfHour,
  hour,
}
@Component({
  selector: 'dt-example-stacked-series-chart-date-barista',
  templateUrl: './stacked-series-chart-date-example.html',
})
export class DtExampleStackedSeriesChartDate {
  series = stackedSeriesChartDemoDataConvertedBouncedDates;
  mode: 'bar' | 'column' = 'column';

  enableTimeInterval = false;
  timeIntervalKey = TimeIntervalKey.fiveMin;
  timeIntervalEvery: { [key: string]: TimeInterval | null } = {
    [TimeIntervalKey.fiveMin]: timeMinute.every(5),
    [TimeIntervalKey.halfHour]: timeMinute.every(30),
    [TimeIntervalKey.hour]: timeHour.every(1),
  };
  continuousAxisInterval = timeMinute.every(5);
  continuousAxisFormat = '%H:%M';

  TimeIntervalKey = TimeIntervalKey;

  continuousAxisMap = ({ origin }) => {
    const [hours, minutes] = origin.label.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes, 0, 0);
  };
}
