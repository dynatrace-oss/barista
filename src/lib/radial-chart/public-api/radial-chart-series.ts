import { Directive, Input, OnInit } from '@angular/core';

// let uniqueId = 1;

@Directive({
  selector: 'dt-radial-chart-series',
  exportAs: 'dtRadialChartSeries',
  host: {
    class: 'dt-radial-chart-series',
  },
})
export class DtRadialChartSeries implements OnInit {
  @Input() value: number;
  @Input() name: string;
  @Input() color: string;

  constructor() {
    console.log('constructor of radial chart series (public api)');
  }

  ngOnInit(): void {
    console.log('init dt-radial-chart-series');
    console.log(this.value);
    console.log(this.name);
    console.log(this.color);
  }
}
