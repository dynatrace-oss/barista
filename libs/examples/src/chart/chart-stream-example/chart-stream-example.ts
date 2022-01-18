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

/* eslint-disable no-magic-numbers */
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { DtChartExampleDataService } from '../chart-example-data.service';
import { DtChartSeries } from '@dynatrace/barista-components/chart';

@Component({
  selector: 'dt-example-chart-stream',
  templateUrl: 'chart-stream-example.html',
})
export class DtExampleChartStream {
  options: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: undefined,
        labels: {
          format: '{value}/min',
        },
        tickInterval: 50,
      },
    ],
    plotOptions: {
      column: {
        stacking: 'normal',
      },
      series: {
        marker: {
          enabled: false,
        },
      },
    },
    tooltip: {
      formatter(): string {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
  };

  series$: Observable<DtChartSeries[]>;

  constructor(private _chartService: DtChartExampleDataService) {
    this.series$ = this._chartService.getStreamedChartdata();
  }
}

/* eslint-enable no-magic-numbers */
