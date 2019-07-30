import { Component } from '@angular/core';

@Component({
  selector: 'radial-chart-demo',
  templateUrl: 'radial-chart-demo.component.html',
  styleUrls: ['./radial-chart-demo.component.scss'],
})
export class RadialChartDemo {
  type = 'pie'; // pie | donut
  maxValuePreset = 55;
  maxValue: number | undefined = this.maxValuePreset;
  start = 0;

  series1 = {
    name: 'Chrome',
    color: '#00a1b2',
    value: 10,
  };

  series2 = {
    name: 'Safari',
    color: '#9355b7',
    value: 20,
  };

  series3 = {
    name: 'Edge',
    color: '#ef651f',
    value: 5,
  };

  showSeries3 = false;
  twoSeries = [this.series1, this.series2];
  allSeries = [...this.twoSeries, this.series3];
  renderedSeries = this.twoSeries;
  sorted = false;

  _toggleSeries() {
    this.renderedSeries =
      this.renderedSeries === this.twoSeries ? this.allSeries : this.twoSeries;
  }

  // _sortSeries() {
  //   this.renderedSeries = this.sorted
  //     ? this.renderedSeries
  //     : this.renderedSeries.sort((a, b) => a.value - b.value);
  //   this.sorted = !this.sorted;
  // }
}
