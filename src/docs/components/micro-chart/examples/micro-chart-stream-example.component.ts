// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { Observable } from 'rxjs';
import { DtChartOptions, DtChartSeries } from '@dynatrace/angular-components';
import { MicroChartService } from './docs-micro-chart.service';

@Component({
  template: '<dt-micro-chart [options]="options" [series]="series$"></dt-micro-chart>',
})
@OriginalClassName('MicroChartStreamExampleComponent')
export class MicroChartStreamExampleComponent {
  options: DtChartOptions = {
    tooltip: {
      formatter(): string | boolean {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
  };
  series$: Observable<DtChartSeries>;

  constructor(private _chartService: MicroChartService) {
    this.series$ = this._chartService.getSingleStreamedChartdata();
  }
}
