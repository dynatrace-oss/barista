import { Input, ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { DtMicroChartSeriesSVG } from './series';

@Component({
  selector: 'g[dt-micro-chart-line-series]',
  host: {
    class: 'dt-micro-chart-series, dt-micro-chart-line-series',
  },
  templateUrl: './line.html',
  styleUrls: ['line.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DtMicroChartSeriesSVG, useExisting: DtMicroChartLineSeriesSVG }],
})
export class DtMicroChartLineSeriesSVG extends DtMicroChartSeriesSVG {

  @Input() points: { x: number; y: number }[];
  @Input() path: string;
}
