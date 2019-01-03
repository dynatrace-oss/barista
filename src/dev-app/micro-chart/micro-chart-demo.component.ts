import { Component } from '@angular/core';
import { DtChartSeries } from '@dynatrace/angular-components/chart';
import { generateData } from '../chart/chart-data';

@Component({
  selector: 'micro-chart-demo',
  templateUrl: './micro-chart-demo.component.html',
  styleUrls: ['./micro-chart-demo.component.scss'],
})
export class MicroChartDemo {
  series: DtChartSeries = {
    name: 'Requests',
    data: generateData(40, 1000, 2000, 1370304000000, 900000),
  };
}
