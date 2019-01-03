// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { DtChartSeries } from '@dynatrace/angular-components';
import { generateData } from './data';

@Component({
  template: `
  <dt-micro-chart [series]="series" [labelFormatter]="_formatterFn">
    <dt-chart-tooltip>
      <ng-template let-tooltip>
        {{tooltip.y | dtCount}}
      </ng-template>
    </dt-chart-tooltip>
  </dt-micro-chart>
  `,
})
export class MicroChartDefaultExampleComponent {
  series: DtChartSeries = {
    name: 'Requests',
    data: generateData(40, 1000, 2000, 1370304000000, 900000),
  };

  _formatterFn = (input: number) => formatCount(input).toString();
}
