// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { Colors } from '@dynatrace/angular-components/theming';
import { BarChartSeriesOptions } from 'highcharts';
import { generateData } from '../chart-data-utils';
import { DtChartSeries } from '@dynatrace/angular-components/chart';

@Component({
  template: `<button dt-button (click)="toggleData()">toggle data</button>
  <dt-chart [options]="options" [series]="series"></dt-chart>`,
})
export class ChartLoadingExampleComponent {

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
    tooltip: {
      formatter(): string | boolean {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
  };

  series: DtChartSeries | null;

  toggleData(): void {
    const dummyData = [{
      name: 'Failure rate',
      type: 'line',
      color: Colors.ROYALBLUE_700,
      data: generateData(40, 0, 20, 1370304000000, 900000),
    }];
    this.series = !this.series ? dummyData : null;
  }
}

// tslint:enable:no-magic-numbers
