// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';

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
export class ChartAreaRangeExampleComponent {
  options: Highcharts.Options = {
    chart: {
      type: 'arearange',
    },
    xAxis: {
      type: 'datetime',
    },
  };

  series = [{
    name: 'Temperatures',
    data: [
      [1483232400000, 1.4, 4.7],
      [1483318800000, -1.3, 1.9],
      [1483405200000, -0.7, 4.3],
      [1483491600000, -5.5, 3.2],
      [1483578000000, -9.9, -6.6],
      [1483664400000, -9.6, 0.1],
      [1483750800000, -0.9, 4],
      [1483837200000, -2.2, 2.9],
      [1483923600000, 1.3, 2.3],
      [1484010000000, -0.3, 2.9],
      [1484096400000, 1.1, 3.8],
      [1484182800000, 0.6, 2.1],
      [1484269200000, -3.4, 2.5],
      [1484355600000, -2.9, 2],
      [1484442000000, -5.7, -2.6],
      [1484528400000, -8.7, -3.3],
      [1484614800000, -3.5, -0.3],
      [1484701200000, -0.2, 7],
      [1484787600000, 2.3, 8.5],
      [1484874000000, 5.6, 9.5],
      [1484960400000, 0.4, 5.8],
      [1485046800000, 0.1, 3.1],
      [1485133200000, 1.5, 4.1],
      [1485219600000, -0.2, 2.8],
      [1485306000000, 2.3, 10.3],
    ],
  }];
}

// tslint:enable:no-magic-numbers
