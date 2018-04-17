import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { DtChartSeries } from '@dynatrace/angular-components/chart';

@Injectable()
export class ChartService {
  getStreamedChartdata(): Observable<DtChartSeries> {
    return timer(0, 5000)
    .pipe(map(() => {
      const data: Array<[number, number]> = [];
      for (let i = 0; i < 10; i++) {
        const now = new Date();
        data.push([
          Math.floor(now.getTime() + Math.random() * 100000),
          Math.floor(Math.random() * 100 + 100),
        ]);
      }

      data.sort((a, b) => a[0] - b[0]);

      return [{
        name: 'Actions/min',
        id: `MetricId-${Math.floor(Math.random() * 100)}`,
        data,
      }];
    }));
  }
}
