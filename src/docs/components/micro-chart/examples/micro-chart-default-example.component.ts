// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { DtChartSeries, formatCount } from '@dynatrace/angular-components';
import { generateData } from './docs-micro-chart.service';

@Component({
  template: '<dt-micro-chart [series]="series" [labelFormatter]="_formatterFn"></dt-micro-chart>',
})
@OriginalClassName('MicroChartDefaultExampleComponent')
export class MicroChartDefaultExampleComponent {
  series: DtChartSeries = {
    name: 'Requests',
    data: generateData(40, 1000, 2000, 1370304000000, 900000),
  };

  _formatterFn = (input: number) => formatCount(input).toString();
}
