// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { generateData } from './chart-data-utils';
import { OriginalClassName } from '../../../core/decorators';
import { IndividualSeriesOptions, Options } from 'highcharts';

@Component({
  template: '<dt-micro-chart [options]="options" [series]="series"></dt-micro-chart>',
})
@OriginalClassName('MicroChartDefaultExampleComponent')
export class MicroChartDefaultExampleComponent {
  options: Options = {
    tooltip: {
      formatter(): string | boolean {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
    xAxis: {
      type: 'datetime',
    },
  };

  series: IndividualSeriesOptions[] = [{
    name: 'Requests',
    data: generateData(40, 1000, 2000, 1370304000000, 900000),
  }];
}
