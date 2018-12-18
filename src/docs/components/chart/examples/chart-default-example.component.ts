// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { generateData } from './chart-data-utils';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  template: `
  <dt-chart [options]="options" [series]="series">
    <dt-chart-tooltip>
      <ng-template let-tooltip>
        <dt-key-value-list style="min-width: 100px">
          <dt-key-value-list-item *ngFor="let data of tooltip.points" [key]="data.series.name" [value]="data.point.y">
          </dt-key-value-list-item>
        </dt-key-value-list>
      </ng-template>
    </dt-chart-tooltip>
  </dt-chart>`,
})
@OriginalClassName('ChartDefaultExampleComponent')
export class ChartDefaultExampleComponent {
  options = {
    chart: {
      type: 'line',
      height: 150,
      marginBottom: 30,
      marginTop: 15,
      plotBorderWidth: 0,
      spacingBottom: 0,
      spacingTop: 0,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
    yAxis: {
      visible: false,
    },
  };

  series = [{
    data: [
      [1536747600000, 2.6],
      [1536748500000, 2.2],
    ],
    name: 'Avg. fetch states duration',
  }];
}

// tslint:enable:no-magic-numbers
