// tslint:disable:no-magic-numbers

import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { DtChartSeries, Colors } from '@dynatrace/angular-components';
import { generateData } from './chart-data-utils';

@Injectable({providedIn: 'root'})
export class ChartService {
  getStreamedChartdata(): Observable<DtChartSeries[]> {
    return timer(1000, 5000)
      .pipe(map(() =>
        [
          {
            name: 'Requests',
            type: 'column',
            color: Colors.PURPLE_400,
            data: generateData(40, 0, 200, 1370304000000, 900000),
          },
          {
            name: 'Failed requests',
            type: 'column',
            color: Colors.PURPLE_700,
            data: generateData(40, 0, 15, 1370304000000, 900000),
          },
        ]));
  }
  getSingleStreamedChartdata(): Observable<DtChartSeries> {
    return timer(1000, 5000)
      .pipe(map(() => ({
          name: 'Requests',
          type: 'column',
          data: generateData(40, 0, 200, 1370304000000, 900000),
        })));
  }
}

// tslint:enable:no-magic-numbers
