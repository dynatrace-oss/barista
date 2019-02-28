import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DtMicroChartSeriesSVG } from './series';

@Component({
  selector: 'g[dt-micro-chart-column-series]',
  host: {
    class: 'dt-micro-chart-series, dt-micro-chart-column-series',
  },
  templateUrl: 'column.html',
  styleUrls: ['column.scss'],
  inputs: ['stacked'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DtMicroChartSeriesSVG, useExisting: DtMicroChartColumnSeriesSVG },
  ],
})
export class DtMicroChartColumnSeriesSVG extends DtMicroChartSeriesSVG {

  @Input() points: { x: number; y: number; height: number; width: number; }[];
}
