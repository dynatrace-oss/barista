// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-chart [options]="options" [series]="series"></dt-chart>
  `,
})
export class ChartBarExample {
  options: Highcharts.Options = {
    chart: {
      type: 'bar',
    },
    xAxis: {
      title: {
        text: null,
      },
      categories: [
        'First item',
        'Second item',
        'Third item',
        'Fourth item',
        'Fifth item',
      ],
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        format: '{value} %',
      },
    },
    plotOptions: {
      pie: {
        showInLegend: true,
        shadow: false,
        innerSize: '80%',
        borderWidth: 0,
      },
    },
  };
  series: Highcharts.BarChartSeriesOptions[] = [
    {
      name: 'Metric',
      data: [60, 86, 25, 43, 28],
    },
  ];
}
