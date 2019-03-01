import { Component } from '@angular/core';
import { DtChartSeries } from '@dynatrace/angular-components/chart';
import { generateData } from './micro-chart2-data';

@Component({
  selector: 'micro-chart-demo',
  templateUrl: './micro-chart2-demo.component.html',
  styleUrls: ['./micro-chart2-demo.component.scss'],
})
export class MicroChart2Demo {
  series: DtChartSeries = {
    name: 'Requests',
    data: [240, 350, 400, 150, 150, 200],
  };

  series2 = {
    data: [1000, 75, 0, 100, 90],
  };

  timeseries = {
    data: generateData(5, 15, 2700, Date.now(), 5),
  };

  toggleSeries = false;
  toggleExtremes = true;
  toggleAxis = true;

  yAxisMin = 0;

  updateData(): void {
    const data = [...(this.series.data || [])];
    const value = data.shift() as number;
    data.push(value);
    this.series.data = data;
  }
}
