import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, OnChanges, OnDestroy } from '@angular/core';
import { DtMicroChartSeries, DtMicroChartSeriesType } from './series';

@Component({
  selector: 'dt-micro-chart-bar-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'dtMicroChartBarSeries',
  inputs: ['stacked'],
  providers: [{ provide: DtMicroChartSeries, useExisting: DtMicroChartBarSeries }],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMicroChartBarSeries extends DtMicroChartSeries implements OnChanges, OnDestroy {
  readonly type: DtMicroChartSeriesType = 'bar';

}
