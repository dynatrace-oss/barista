import { Component } from '@angular/core';

import { generateData } from './chart-data-utils';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-chart [options]="options" [series]="series">
      <dt-chart-tooltip>
        <ng-template let-tooltip>
          <dt-key-value-list style="min-width: 100px">
            <dt-key-value-list-item *ngFor="let data of tooltip.points">
              <dt-key-value-list-key>
                {{ data.series.name }}
              </dt-key-value-list-key>
              <dt-key-value-list-value>
                {{ data.point.y }}
              </dt-key-value-list-value>
            </dt-key-value-list-item>
          </dt-key-value-list>
        </ng-template>
      </dt-chart-tooltip>
    </dt-chart>
  `,
})
export class ChartAreaExample {
  options: Highcharts.Options = {
    chart: {
      type: 'arearange',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: null,
        labels: {
          format: '{value} kbit/min',
        },
        tickInterval: 100,
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
      name: 'Area 1',
      type: 'area',
      yAxis: 0,
      data: generateData(40, 250, 500, 1370319300000, 450000),
      color: '#B4E5F9',
    },
    {
      name: 'Area 2',
      type: 'area',
      yAxis: 1,
      data: generateData(40, 20, 50, 1370319300000, 450000),
      color: '#008cdb',
    },
  ];
}
