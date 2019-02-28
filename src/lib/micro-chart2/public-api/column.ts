import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnChanges, OnDestroy } from '@angular/core';
import { DtMicroChartSeries, DtMicroChartSeriesType } from './series';

@Component({
  selector: 'dt-micro-chart-column-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'dtMicroChartColumnSeries',
  inputs: ['stacked'],
  providers: [{ provide: DtMicroChartSeries, useExisting: DtMicroChartColumnSeries }],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMicroChartColumnSeries extends DtMicroChartSeries implements OnChanges, OnDestroy {
  readonly type: DtMicroChartSeriesType = 'column';

}
