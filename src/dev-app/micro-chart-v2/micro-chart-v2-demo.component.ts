import { Component } from '@angular/core';
import { DtChartSeries } from '@dynatrace/angular-components/chart';
import { generateData } from './micro-chart-v2-data';

@Component({
  selector: 'micro-chart-demo',
  templateUrl: './micro-chart-v2-demo.component.html',
  styleUrls: ['./micro-chart-v2-demo.component.scss'],
})
export class MicroChartV2Demo {
  series: DtChartSeries = {
    name: 'Requests',
    data: generateData(40, 900, 2000, 1370304000000, 900000),
  };
}