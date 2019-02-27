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
    data: [40, 20, 400, 50, 50, 200],
  };

  series2 = {
    data: [1000, 75, 0, 100, 90],
  };

  timeseries = {
    data: generateData(5, 15, 2700, Date.now(), 5),
  };

  toggleSeries = false;
  toggleExtremes = true;

  updateData(): void {
    this.series.data = [1, 100, 20, 30, 50, 10, 70, 80, 90, 15.5].reverse();
  }
}
