import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { DtMicroChartSeries } from './series';

@Component({
  selector: 'dt-micro-chart-column-series',
  templateUrl: './column.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'dtMicroChartColumnSeries',
  providers: [{ provide: DtMicroChartSeries, useExisting: DtMicroChartColumnSeries }],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMicroChartColumnSeries extends DtMicroChartSeries {
  readonly type = 'column';

  @Input() data: [number, number];
}
