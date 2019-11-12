// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';

import { DtChartSeries } from '@dynatrace/angular-components/chart';
import { formatCount } from '@dynatrace/angular-components/formatters';

import { generateData } from './data';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-micro-chart [series]="series" [labelFormatter]="_formatterFn">
      <dt-chart-tooltip>
        <ng-template let-tooltip>
          {{ tooltip.y | dtCount }}
        </ng-template>
      </dt-chart-tooltip>
    </dt-micro-chart>
  `,
})
export class MicroChartDefaultExample {
  series: DtChartSeries = {
    name: 'Requests',
    data: generateData(40, 1000, 2000, 1370304000000, 900000),
  };

  _formatterFn = (input: number) => formatCount(input).toString();
}
