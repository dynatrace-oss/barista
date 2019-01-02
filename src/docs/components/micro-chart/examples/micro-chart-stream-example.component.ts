// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { Observable } from 'rxjs';
import { DtChartOptions, DtChartSeries } from '@dynatrace/angular-components';
import { MicroChartService } from './docs-micro-chart.service';

@Component({
  template: `
  <dt-micro-chart [options]="options" [series]="series$">
    <dt-chart-tooltip>
      <ng-template let-tooltip>
        {{tooltip.y | dtCount}}
      </ng-template>
    </dt-chart-tooltip>
  </dt-micro-chart>`,
})
@OriginalClassName('MicroChartStreamExampleComponent')
export class MicroChartStreamExampleComponent {
  options: DtChartOptions = {
    chart: {
      type: 'column',
    },
  };
  series$: Observable<DtChartSeries>;

  constructor(private _chartService: MicroChartService) {
    this.series$ = this._chartService.getSingleStreamedChartdata();
  }
}
