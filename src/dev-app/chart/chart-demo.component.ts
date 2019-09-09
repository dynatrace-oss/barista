// tslint:disable no-magic-numbers no-any max-file-line-count
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
} from '@dynatrace/angular-components/chart';

import { chartOptions } from './chart-options';
import { dataBig, dataSmall } from './data-service';

@Component({
  selector: 'chart-dev-app-demo',
  templateUrl: './chart-demo.component.html',
  styleUrls: ['./chart-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartDemo {
  @ViewChild(DtChartRange, { static: false }) dtChartRange: DtChartRange;

  validRange = false;
  options = chartOptions;
  series = new BehaviorSubject(dataSmall);

  dataSet = 'small';

  private lastTimeframe: [number, number];

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

  onTimeframeChanges(timeframe: [number, number]): void {
    this.lastTimeframe = timeframe;
  }

  seriesVisibilityChanged(event: DtChartSeriesVisibilityChangeEvent): void {
    console.log(event);
  }
}
