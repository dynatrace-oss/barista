import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-radial-chart type="donut">
      <dt-radial-chart-series
        *ngFor="let s of _chartSeries"
        [value]="s.value"
        [name]="s.name"
        [color]="s.color"
      >
      </dt-radial-chart-series>
    </dt-radial-chart>
  `,
})
export class RadialChartCustomColorsExample {
  _chartSeries = [
    {
      name: 'Chrome',
      value: 43,
      color: '#006bba',
    },
    {
      name: 'Safari',
      value: 31,
      color: '#b4e5f9',
    },
    {
      name: 'Firefox',
      value: 17,
      color: '#2ab6f4',
    },
    {
      name: 'Microsoft Edge',
      value: 9,
    },
    {
      name: 'Internet Explorer 11',
      value: 2,
    },
  ];
}
