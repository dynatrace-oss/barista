// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { DtChartOptions, DtChartSeries } from '@dynatrace/angular-components';
import { generateData } from './docs-micro-chart.service';

@Component({
  template: '<dt-micro-chart [series]="series"></dt-micro-chart>',
})
@OriginalClassName('MicroChartDefaultExampleComponent')
export class MicroChartDefaultExampleComponent {
  series: DtChartSeries = {
    name: 'Requests',
    data: generateData(40, 1000, 2000, 1370304000000, 900000),
  };
}
