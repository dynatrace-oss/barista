import { Component, ViewChild } from '@angular/core';

import { DtChart } from '@dynatrace/angular-components/chart';
import {
  DtSelectionArea,
  DtSelectionAreaChange,
} from '@dynatrace/angular-components/selection-area';

import { generateData } from '../chart/chart-data';

@Component({
  selector: 'selection-area-dev-app-demo',
  templateUrl: './selection-area-demo.component.html',
  styleUrls: ['./selection-area-demo.component.scss'],
})
export class SelectionAreaDemo {
  @ViewChild(DtChart, { static: true }) chart: DtChart;
  // tslint:disable-next-line: deprecation
  @ViewChild(DtSelectionArea, { static: true }) selectionArea: DtSelectionArea;

  left: number;
  right: number;

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
    tooltip: {
      formatter(): string | boolean {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
  };

  series: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Failure rate',
      type: 'line',
      data: generateData(40, 0, 20, 1370304000000, 10000),
    },
    {
      name: 'Requests',
      type: 'column',
      yAxis: 1,
      data: generateData(40, 0, 200, 1370304000000, 10000),
    },
    {
      name: 'Failed requests',
      type: 'column',
      yAxis: 1,
      data: generateData(40, 0, 15, 1370304000000, 10000),
    },
  ];

  // tslint:disable-next-line: deprecation
  handleChange(ev: DtSelectionAreaChange): void {
    this.left = ev.left;
    this.right = ev.right;
  }
}
