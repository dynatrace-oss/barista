// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { generateData } from './chart-data-utils';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-chart [options]="options" [series]="series"></dt-chart>
  `,
})
export class ChartLineExample {
  options: Highcharts.Options = {
    chart: {
      type: 'line',
    },
    xAxis: {
      title: {
        text: null,
      },
      type: 'datetime',
    },
    yAxis: [
      {
        title: {
          text: null,
        },
        labels: {
          format: '{value} ms',
        },
        tickInterval: 25,
      },
    ],
  };
  series: Highcharts.LineChartSeriesOptions[] = [
    {
      name: 'Host 1',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      name: 'Host 2',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      name: 'Host 3',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      name: 'Host 4',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      name: 'Host 5',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
    {
      name: 'Host 6',
      data: generateData(10, 0, 45, 1370304000000, 900000),
    },
  ];
}
