// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-chart [options]="options" [series]="series"></dt-chart>
  `,
})
export class ChartDonutExample {
  options: Highcharts.Options = {
    chart: {
      type: 'pie',
      plotBorderWidth: 0,
    },
    legend: {
      align: 'right',
      enabled: true,
      layout: 'vertical',
      symbolRadius: 0,
      verticalAlign: 'middle',
      floating: true,
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
  series: Highcharts.PieChartSeriesOptions[] = [
    {
      data: [
        {
          name: 'Canada',
          y: 55,
        },
        {
          name: 'Italy',
          y: 25,
        },
        {
          name: 'United States',
          y: 15,
        },
        {
          name: 'France',
          y: 5,
        },
      ],
    },
  ];
}
