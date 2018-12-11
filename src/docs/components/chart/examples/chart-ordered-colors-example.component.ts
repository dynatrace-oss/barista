// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { generateData } from './chart-data-utils';

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
@OriginalClassName('ChartOrderdColorsExampleComponent')
export class ChartOrderdColorsExampleComponent {

  options: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: null,
        labels: {
          format: '{value}',
        },
        tickInterval: 10,
      },
      {
        title: null,
        labels: {
          format: '{value}/min',
        },
        opposite: true,
        tickInterval: 50,
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
  };

  series: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Requests',
      type: 'column',
      yAxis: 1,
      data: generateData(40, 0, 200, 1370304000000, 900000),
    },
    {
      name: 'Failed requests',
      type: 'column',
      yAxis: 1,
      data: generateData(40, 0, 15, 1370304000000, 900000),
    },
    {
      name: 'Failure rate',
      type: 'line',
      data: generateData(40, 0, 20, 1370304000000, 900000),
    },
    {
      name: 'Failure rate new',
      type: 'line',
      data: generateData(40, 0, 20, 1370304000000, 900000),
    }];
}

// tslint:enable:no-magic-numbers
