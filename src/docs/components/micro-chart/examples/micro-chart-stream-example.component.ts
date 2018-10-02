// tslint:disable:no-magic-numbers

import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import {IndividualSeriesOptions, Options} from 'highcharts';
import {MicroChartService} from './docs-chart.service';
import {Observable} from 'rxjs';

@Component({
  template: '<dt-micro-chart [options]="options" [series]="series$"></dt-micro-chart>',
})
@OriginalClassName('MicroChartStreamExampleComponent')
export class MicroChartStreamExampleComponent {
  options: Options = {
    tooltip: {
      formatter(): string | boolean {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
  };
  series$: Observable<IndividualSeriesOptions>;

  constructor(private _chartService: MicroChartService) {
    this.series$ = this._chartService.getSingleStreamedChartdata();
  }
}
