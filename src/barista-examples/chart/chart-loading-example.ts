// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { DtColors, DtChartSeries } from '@dynatrace/angular-components';
import { generateData } from './chart-data-utils';

@Component({
  selector: 'barista-demo',
  template: `
    <button dt-button (click)="toggleData()">toggle data</button>
    <dt-chart
      [options]="options"
      [series]="series"
      loading-text="Loading..."
    ></dt-chart>
  `,
})
export class ChartLoadingExample {
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
    ],
  };

  series: DtChartSeries[] | null;

  toggleData(): void {
    const dummyData = [
      {
        name: 'Failure rate',
        type: 'line',
        color: DtColors.ROYALBLUE_700,
        data: generateData(40, 0, 20, 1370304000000, 900000),
      },
    ];
    this.series = !this.series ? dummyData : null;
  }
}

// tslint:enable:no-magic-numbers
