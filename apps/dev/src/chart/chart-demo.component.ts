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

// eslint-disable  no-magic-numbers, @typescript-eslint/no-explicit-any, max-lines
import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  DtChartRange,
  DtChartSeriesVisibilityChangeEvent,
} from '@dynatrace/barista-components/chart';

import { chartOptions } from './chart-options';
import { dataBig, dataSmall } from './data-service';

@Component({
  selector: 'chart-dev-app-demo',
  templateUrl: './chart-demo.component.html',
  styleUrls: ['./chart-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartDemo {
  @ViewChild(DtChartRange) dtChartRange: DtChartRange;

  validRange = false;
  options = chartOptions;
  series = new BehaviorSubject(dataSmall);

  dataSet = 'small';

  lastTimeframe: [number, number];

  constructor(private _zone: NgZone) {}

  switchData(): void {
    if (this.dataSet === 'small') {
      this.series.next(dataBig);
      this.dataSet = 'large';
      return;
    }
    this.series.next(dataSmall);
    this.dataSet = 'small';
  }

  simulateLoading(): void {
    console.log('[LOADING]');

    this._zone.onStable.pipe(take(1)).subscribe(() => {
      if (
        !!this.lastTimeframe &&
        this.lastTimeframe.length === 2 &&
        (this.lastTimeframe[0] > 0 || this.lastTimeframe[1] > 0)
      ) {
        this.dtChartRange.value = this.lastTimeframe;
      }
    });
  }

  onTimeframeValidChanges(valid: boolean): void {
    this.validRange = valid;
  }

  closed(): void {
    this.lastTimeframe = [0, 0];
  }

  onTimeframeChanges(timeframe: [number, number] | number): void {
    console.log('Value changes', timeframe);

    if (Array.isArray(timeframe)) {
      this.lastTimeframe = timeframe;
    }
  }

  seriesVisibilityChanged(event: DtChartSeriesVisibilityChangeEvent): void {
    console.log(event);
  }

  setTimeframe(): void {
    this.lastTimeframe = [
      this.lastTimeframe[0] - 100_000,
      this.lastTimeframe[1] + 100_000,
    ];
    this.dtChartRange.value = this.lastTimeframe;
  }
}
