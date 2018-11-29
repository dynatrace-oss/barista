import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { DtSelectionAreaChange, DtChart, DtSelectionArea } from '@dynatrace/angular-components';

@Component({
  template: `
  <dt-chart [options]="options" [series]="series"></dt-chart>
  <dt-selection-area (changed)="handleChange($event)">
    {{dynamic}} static
    <dt-selection-area-actions>
      <button dt-button>Zoom in</button>
    </dt-selection-area-actions>
  </dt-selection-area>
  `,
  styles: [
    '.origin { width: 100%; height: 400px; border: 1px solid #e6e6e6; }',
  ],
})
@OriginalClassName('SelectionAreaChartExample')
export class SelectionAreaChartExample implements AfterViewInit {
  @ViewChild(DtChart) chart: DtChart;
  @ViewChild(DtSelectionArea) selectionArea: DtSelectionArea;

  dynamic = '';

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
    }];

  ngAfterViewInit(): void {
    // this.chart._loaded.subscribe(() => {
    //   const plotbackground = this.chart.container.nativeElement.querySelector('.highcharts-plot-background');
    //   this.selectionArea.origin = plotbackground;
    // });
  }
  handleChange(ev: DtSelectionAreaChange): void {
    if (this.chart.highchartsOptions.tooltip!.enabled !== false) {
      // this.chart._toggleTooltip(false);
    }
    this.dynamic = `${ev.left}, ${ev.right} yeah so dynamic - ${ev.width}`;
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
