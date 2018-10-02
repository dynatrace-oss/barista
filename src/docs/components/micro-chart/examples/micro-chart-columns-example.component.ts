// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { Options } from 'highcharts';
import {DtChartSeries} from '@dynatrace/angular-components';
import {generateData} from "../../chart/examples/chart-data-utils";

@Component({
  template: '<dt-micro-chart [options]="options" [series]="series"></dt-micro-chart>',
})
@OriginalClassName('MicroChartColumnsExampleComponent')
export class MicroChartColumnsExampleComponent {
  options: Options = {
    chart: {
      type: 'column',
    },
    tooltip: {
      formatter(): string | boolean {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
  };

  series: DtChartSeries = {
    name: 'Requests',
    data: generateData(40, 200000, 300000, 1370304000000, 900000),
  };
}
