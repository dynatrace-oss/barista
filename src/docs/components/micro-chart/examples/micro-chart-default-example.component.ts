// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { Options } from 'highcharts';
import { DtChartSeries } from '@dynatrace/angular-components';
import { generateData } from '../../chart/examples/chart-data-utils';

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
  };
  series: DtChartSeries = {
    name: 'Requests',
    data: generateData(40, 1000, 2000, 1370304000000, 900000),
  };
}
