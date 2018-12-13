// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';

@Component({
  template: '<dt-chart [options]="options" [series]="series"></dt-chart>',
})
export class ChartCategorizedExampleComponent {
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
