import {Component, DoCheck, ViewEncapsulation} from '@angular/core';
import { DtChartOptions, DtChartSeries } from '@dynatrace/angular-components/chart';

@Component({
  moduleId: module.id,
  selector: 'dt-chart-ui',
  styles: ['.dt-chart { border: 1px solid black; } .dt-chart:hover { border: 1px solid red; }'],
  templateUrl: 'chart-ui.html',
  // tslint:disable-next-line use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class ChartUI implements DoCheck {
  changedetectionCounter = 0;

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

  ngDoCheck(): void {
    this.changedetectionCounter += 1;
  }
}
