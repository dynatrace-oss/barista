import { Input, ChangeDetectionStrategy, Component } from '@angular/core';
import { DtMicroChartSeriesSVG } from './series';
import { DtMicroChartBarDataPoint } from '../business-logic/core/bar';

@Component({
  selector: 'g[dt-micro-chart-bar-series]',
  host: {
    class: 'dt-micro-chart-series, dt-micro-chart-bar-series',
  },
  templateUrl: './bar.html',
  styleUrls: ['./bar.scss'],
  inputs: ['color'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DtMicroChartSeriesSVG, useExisting: DtMicroChartBarSeriesSVG },
  ],
})
export class DtMicroChartBarSeriesSVG extends DtMicroChartSeriesSVG {
  /** Points to render in the bar chart series. */
  @Input() points: DtMicroChartBarDataPoint[];
}
