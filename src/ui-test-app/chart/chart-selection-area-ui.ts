import {Component, ViewEncapsulation} from '@angular/core';
import { DtChartOptions, DtChartSeries } from '@dynatrace/angular-components/chart';
import { DtSelectionAreaChange } from '@dynatrace/angular-components/selection-area';

@Component({
  moduleId: module.id,
  selector: 'dt-chart-selection-area-ui',
  templateUrl: 'chart-selection-area-ui.html',
  // tslint:disable-next-line use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  styles: [
    '.highcharts-plot-background: { fill: red }',
  ],
})
export class ChartSelectionAreaUI {
  left: number;
  right: number;

  options: DtChartOptions = {
    chart: {
      type: 'line',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      min: 100,
      max: 200,
    },
  };
  series: DtChartSeries[] = [
    {
      name: 'Actions/min',
      id: 'someMetricId',
      // tslint:disable-next-line no-magic-numbers
      data: [[1370304000000, 140], [1370390400000, 120]],
    },
  ];

  handleChange(ev: DtSelectionAreaChange): void {
    this.left = ev.left;
    this.right = ev.right;
  }
}
