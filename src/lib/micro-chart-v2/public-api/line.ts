import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { DtMicroChartSeries } from './series';

@Component({
  selector: 'dt-micro-chart-line-series',
  templateUrl: './line.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'dtMicroChartLineSeries',
  providers: [{ provide: DtMicroChartSeries, useExisting: DtMicroChartLineSeries }],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMicroChartLineSeries extends DtMicroChartSeries {
  readonly type = 'line';

  @Input() data: [number, number];
}
