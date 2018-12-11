// tslint:disable:no-magic-numbers
import { Component } from '@angular/core';
import { ChartService } from './docs-chart.service';
import { IndividualSeriesOptions } from 'highcharts';
import { Observable } from 'rxjs';

@Component({
  template: '<dt-chart [options]="options" [series]="series$" loading-text="Loading..."></dt-chart>',
})
@OriginalClassName('ChartStreamExampleComponent')
export class ChartStreamExampleComponent {

  options: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: null,
        labels: {
          format: '{value}/min',
        },
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
    tooltip: {
      formatter(): string | boolean {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
  };

  series$: Observable<IndividualSeriesOptions[]>;

  constructor(private _chartService: ChartService) {
    this.series$ = this._chartService.getStreamedChartdata();
  }
}

// tslint:enable:no-magic-numbers
