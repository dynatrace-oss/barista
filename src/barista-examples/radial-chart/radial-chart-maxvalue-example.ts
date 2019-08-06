import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-radial-chart [maxValue]="_maxValue">
      <dt-radial-chart-series
        *ngFor="let s of _chartSeries"
        [value]="s.value"
        [name]="s.name"
      >
      </dt-radial-chart-series>
    </dt-radial-chart>
  `,
})
export class RadialChartMaxvalueExample {
  _maxValue = 100;
  _chartSeries = [
    {
      name: 'Chrome',
      value: 43,
    },
    {
      name: 'Safari',
      value: 22,
    },
    {
      name: 'Firefox',
      value: 15,
    },
    {
      name: 'Microsoft Edge',
      value: 9,
    },
  ];
}
