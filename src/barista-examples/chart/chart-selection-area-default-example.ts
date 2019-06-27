// tslint:disable no-magic-numbers
import { Component } from '@angular/core';
import { generateData } from './chart-data-utils';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-chart [options]="options" [series]="series">
      <dt-chart-timestamp
        aria-label-close="close the selection"
      ></dt-chart-timestamp>
      <dt-chart-range
        aria-label-close="close the selection"
        aria-label-left-handle="The left handle to update the selection"
        aria-label-right-handle="The right handle to update the selection"
        aria-label-selected-area="The selected time-frame"
        (valid)="rangeValidChanges($event)"
      >
        <button
          aria-label="Apply the selection"
          dt-button
          dtChartSelectionAreaAction
          [disabled]="!validRange"
          i18n
        >
          Apply
        </button>
      </dt-chart-range>
    </dt-chart>
  `,
})
export class ChartSelectionAreaDefaultExample {
  validRange = false;
  rangeValidChanges(valid: boolean): void {
    this.validRange = valid;
  }
  /** Chart options and series */
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
  ];
}
