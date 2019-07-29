import { Component } from '@angular/core';

@Component({
  selector: 'radial-chart-demo',
  templateUrl: 'radial-chart-demo.component.html',
})
export class RadialChartDemo {
  type = 'pie'; // pie | donut
  background = '#cccccc'; // background color if circle is not full (?)
  maxValue = 360; // can be any number, defines 100%; if not given, all series data adds to max
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
}
