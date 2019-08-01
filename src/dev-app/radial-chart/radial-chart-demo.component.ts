import { Component } from '@angular/core';

interface DemoChartData {
  name: string;
  color: string | null;
  value: number;
}
@Component({
  selector: 'radial-chart-demo',
  templateUrl: 'radial-chart-demo.component.html',
  styleUrls: ['./radial-chart-demo.component.scss'],
})
export class RadialChartDemo {
  type = 'pie'; // pie | donut
  maxValuePreset = 100;
  maxValue: number | null = this.maxValuePreset;
  start = 0;

  randomColors = [
    '#31339c',
    null,
    '#debbf3',
    null,
    '#2ab6f4',
    null,
    '#612c85',
    null,
    '#006bba',
  ];

  series1 = {
    name: 'Chrome',
    color: null,
    value: 10,
  };

  series2 = {
    name: 'Safari',
    color: null,
    value: 20,
  };

  series3 = {
    name: 'Edge',
    color: null,
    value: 5,
  };

  allSeries: DemoChartData[] = [this.series1, this.series2, this.series3];
  renderedSeries: DemoChartData[] = [...this.allSeries];
  sumAllSeries = this.allSeries.reduce((agg, cur) => agg + cur.value, 0);
  sorted = false;

  _toggleSorting(): void {
    this.sorted = !this.sorted;
    if (this.sorted) {
      this._sortSeries();
    } else {
      this.renderedSeries = [...this.allSeries];
    }
  }

  _sortSeries(): void {
    this.renderedSeries.sort((a, b) => b.value - a.value);
  }

  _addRandomDataToRenderedSeries(): void {
    const value = Math.floor(Math.random() * 50);
    const colorIdx = Math.floor(Math.random() * this.randomColors.length);
    const newSeries = {
      name: 'Series',
      color: this.randomColors[colorIdx],
      value,
    };
    this.allSeries.push(newSeries);
    this.sumAllSeries = this.sumAllSeries + value;
    this._updateRenderedSeries();
  }

  _removeLastSeries(): void {
    if (this.allSeries.length > 0) {
      this.sumAllSeries =
        this.sumAllSeries - this.allSeries[this.allSeries.length - 1].value;
      this.allSeries = this.allSeries.slice(0, -1);
      this._updateRenderedSeries();
    }
  }

  _updateRenderedSeries(): void {
    this.renderedSeries = [...this.allSeries];
    if (this.sorted) {
      this._sortSeries();
    }
  }
}
