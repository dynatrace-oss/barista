// tslint:disable:no-magic-numbers

import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { DtChartSeries } from '@dynatrace/angular-components';
import { generateData } from '../../chart/examples/chart-data-utils';

@Injectable({providedIn: 'root'})
export class MicroChartService {
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
