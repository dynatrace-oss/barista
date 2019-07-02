import { Component, ViewChild } from '@angular/core';
import { DtSelectionAreaChange, DtChart, DtSelectionArea } from '@dynatrace/angular-components';

@Component({
  selector: 'barista-demo',
  template: `
<dt-chart [options]="options" [series]="series" [dtChartSelectionArea]="area"></dt-chart>
<dt-selection-area #area="dtSelectionArea"
  (changed)="handleChange($event)"
  aria-label-selected-area="Text that describes the content of the selection area."
  aria-label-left-handle="Resize selection area to the left."
  aria-label-right-handle="Resize selection area to the right."
  aria-label-close-button="Close the selection area."
>
  {{left | date: 'MMM d, y - HH:mm':'GMT' }} - {{right | date: 'MMM d, y - HH:mm':'GMT'}}
  <dt-selection-area-actions>
    <button dt-button>Zoom in</button>
  </dt-selection-area-actions>
</dt-selection-area>
  `,
})
export class SelectionAreaChartExample {
  @ViewChild(DtChart, { static: true }) chart: DtChart;
  @ViewChild(DtSelectionArea, { static: true }) selectionArea: DtSelectionArea;

  left: number;
  right: number;

  options: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
      min: 1370302200000,
      startOnTick: true,
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
      data: generateData(40, 0, 20, 1370304000000, 900000),
    },
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
    }];

  handleChange(ev: DtSelectionAreaChange): void {
    this.left = ev.left;
    this.right = ev.right;
  }

}

export function randomize(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function generateData(
  amount: number,
  min: number,
  max: number,
  timestampStart: number,
  timestampTick: number
): Array<[number, number]> {
  return Array.from(Array(amount).keys())
    .map((v) => [
      timestampStart + (timestampTick * v),
      randomize(min, max),
    ] as [number, number]);
}
