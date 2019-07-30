import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'g[dt-radial-chart-series]',
  templateUrl: 'radial-chart-series.html',
  styleUrls: ['radial-chart-series.scss'],
  host: {
    class: 'dt-radial-chart-series',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtRadialChartSeriesSVG {
  @Input() path: string;
  @Input() color: string;
  @Input() name: string;
}
