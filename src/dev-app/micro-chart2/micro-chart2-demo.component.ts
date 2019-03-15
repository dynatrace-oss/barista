import { Component } from '@angular/core';
import { generateData } from './micro-chart2-data';

@Component({
  selector: 'micro-chart-demo',
  templateUrl: './micro-chart2-demo.component.html',
  styleUrls: ['./micro-chart2-demo.component.scss'],
})
export class MicroChart2Demo {

  series = {
    data: [100, 200, 400, 100, 90],
  };

  series2 = {
    data: [1000, 75, 0, 100, 90],
  };

  series3 = {
    name: 'Requests',
    data: [240, null, 400, null, 150, 200],
  };

  series4 = {
    name: 'Requests',
    data: [[0, 240], [1, 350], [3, 150], [4, 150], [5, 100]],
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

  constructor() {
    console.log(generateData(5, 15, 2700, Date.now(), 5));
  }
}
