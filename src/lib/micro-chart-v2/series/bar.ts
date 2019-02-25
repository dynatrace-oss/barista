import { Input, ChangeDetectionStrategy, Component } from '@angular/core';
import { DtMicroChartSeriesSVG } from './series';

@Component({
  selector: 'g[dt-micro-chart-bar-series]',
  host: {
    class: 'dt-micro-chart-series, dt-micro-chart-bar-series',
  },
  templateUrl: './bar.html',
  styleUrls: ['bar.scss'],
  inputs: ['stacked'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DtMicroChartSeriesSVG, useExisting: DtMicroChartBarSeriesSVG }],
})
export class DtMicroChartBarSeriesSVG extends DtMicroChartSeriesSVG {
  @Input() points: Array<{ x: number; y: number; height: number; width: number }>;
}
