// tslint:disable:no-magic-numbers

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { DtChartSeries } from '@dynatrace/angular-components/chart';
import { generateData } from './chart-data-utils';
import { Colors } from '@dynatrace/angular-components/theming';

@Injectable()
export class ChartService {
  getStreamedChartdata(): Observable<DtChartSeries> {
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
}

// tslint:enable:no-magic-numbers
