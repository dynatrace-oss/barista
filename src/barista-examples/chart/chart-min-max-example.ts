// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';

import { generateAreaRangeData, generateData } from './chart-data-utils';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-chart [options]="options" [series]="series"></dt-chart>
  `,
})
export class ChartMinMaxExample {
  private _minMaxChartLineSeries = generateData(
    20,
    20,
    40,
    1370304000000,
    900000,
  );

  options: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: null,
      },
      type: 'datetime',
      labels: {
        format: '{value} ms',
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
      arearange: {
        lineWidth: 0,
        states: {
          hover: undefined,
        },
      },
    },
  };
  series: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Bar 1',
      type: 'column',
      data: generateData(20, 20, 40, 1370304000000, 900000),
    },
    {
      name: 'Area 1',
      type: 'arearange',
      data: generateAreaRangeData(this._minMaxChartLineSeries, 4, 8),
    },
    {
      name: 'Line 1',
      type: 'line',
      data: this._minMaxChartLineSeries,
    },
  ];
}
