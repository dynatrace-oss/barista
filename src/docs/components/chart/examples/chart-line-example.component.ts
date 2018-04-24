import { Component } from '@angular/core';

@Component({
  template: '<dt-chart [options]="options" [series]="series"></dt-chart>',
})
export class ChartLineExampleComponent {
  options: Highcharts.Options = {
    xAxis: {
       type: 'datetime',
    },
    yAxis: {
      min: 100,
      max: 200,
    },
  };

  series: Highcharts.IndividualSeriesOptions[] = [{
    name: 'Actions/min',
    id: 'SomeMetricId',
    type: 'line',
    data: [
      [
        1370304000000,
        140,
      ],
      [
        1370390400000,
        120,
      ],
    ],
  }];
}
