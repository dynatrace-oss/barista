// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { generateData } from './chart-data-utils';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-chart [options]="options" [series]="series"></dt-chart>
  `,
})
export class ChartLineWithGapsExample {
  options: Highcharts.Options = {
    chart: {
      type: 'line',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: null,
        type: 'linear',
        tickInterval: 25,
        labels: {
          format: '{value} %',
        },
      },
    ],
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
  };

  series: Highcharts.LineChartSeriesOptions[] = [
    {
      name: 'Requests',
      data: generateData(40, 0, 75, 1370304000000, 600000, true),
    },
    {
      name: 'Failed requests',
      data: generateData(40, 0, 75, 1370304000000, 600000, true),
    },
    {
      name: 'Failure rate',
      data: generateData(40, 0, 75, 1370304000000, 600000, true),
    },
  ];
}
