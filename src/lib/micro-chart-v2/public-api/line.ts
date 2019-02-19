import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ChangeDetectorRef, SimpleChanges, OnDestroy, OnChanges } from '@angular/core';
import { DtMicroChartSeries, DtMicroChartSeriesType } from './series';

@Component({
  selector: 'dt-micro-chart-line-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'dtMicroChartLineSeries',
  providers: [{ provide: DtMicroChartSeries, useExisting: DtMicroChartLineSeries }],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMicroChartLineSeries extends DtMicroChartSeries implements OnChanges, OnDestroy {
  readonly type: DtMicroChartSeriesType = 'line';

  @Input() data: number[];

}
