// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { DtChartSeries, DtChartOptions } from '@dynatrace/angular-components';
import { map } from 'rxjs/operators';
import { generateData } from './data';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-micro-chart [options]="options" [series]="series$">
      <dt-chart-tooltip>
        <ng-template let-tooltip>
          {{ tooltip.y | dtCount }}
        </ng-template>
      </dt-chart-tooltip>
    </dt-micro-chart>
  `,
})
export class MicroChartStreamExample {
  options: DtChartOptions = {
    chart: {
      type: 'column',
    },
  };
  series$: Observable<DtChartSeries> = timer(1000, 5000).pipe(
    map(() => ({
      name: 'Requests',
      type: 'column',
      data: generateData(40, 0, 200, 1370304000000, 900000),
    }))
  );
}
