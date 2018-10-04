// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { MicroChartService } from './docs-chart.service';
import { DtChartOptions, DtMicroChartSeries } from '@dynatrace/angular-components';

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
  series$: DtMicroChartSeries;

  constructor(private _chartService: MicroChartService) {
    this.series$ = this._chartService.getSingleStreamedChartdata();
  }
}
