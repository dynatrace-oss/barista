// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';

@Component({
  selector: 'barista-demo',
  template: `
  <dt-chart [options]="options" [series]="series">
    <dt-chart-tooltip>
      <ng-template let-tooltip>
        <dt-key-value-list style="min-width: 100px">
        <dt-key-value-list-item *ngFor="let data of tooltip.points">
          <dt-key-value-list-key>{{data.series.name}}</dt-key-value-list-key>
          <dt-key-value-list-value>{{data.point.y}}</dt-key-value-list-value>
        </dt-key-value-list-item>
        </dt-key-value-list>
      </ng-template>
    </dt-chart-tooltip>
  </dt-chart>`,
})
export class ChartCategorizedExample {
  options: Highcharts.Options = {
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: [
      {
        title: null,
        labels: {
          format: '{value}',
        },
        tickInterval: 10,
      },
    ],
    plotOptions: {
      column: {
        stacking: 'normal',
      },
      series: {
        marker: {
          enabled: false,
        },
      },
    },
    tooltip: {
      formatter(): string | boolean {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
  };

  series: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Requests',
      type: 'column',
      data: [100, 80, 130, 90, 80, 60, 120, 100, 30, 90, 110, 120],
    }];
}

// tslint:enable:no-magic-numbers
