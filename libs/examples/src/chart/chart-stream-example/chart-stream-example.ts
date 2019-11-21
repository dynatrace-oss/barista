/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

// tslint:disable:no-magic-numbers
import { Component } from '@angular/core';
import { IndividualSeriesOptions } from 'highcharts';
import { Observable } from 'rxjs';

import { DtChartExampleDataService } from '../chart-example-data.service';

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
        title: null,
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
      formatter(): string | boolean {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
  };

  series$: Observable<IndividualSeriesOptions[]>;

  constructor(private _chartService: DtChartExampleDataService) {
    this.series$ = this._chartService.getStreamedChartdata();
  }
}

// tslint:enable:no-magic-numbers
