import {
  Input,
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  NgZone,
} from '@angular/core';
import { DtMicroChartSeriesSVG } from './series';
import { DtMicroChartLineDataPoint } from '../business-logic/core/line';
import { DtMicroChartExtremeSeriesSVG } from './series-extreme';

@Component({
  selector: 'g[dt-micro-chart-line-series]',
  host: {
    class: 'dt-micro-chart-series, dt-micro-chart-line-series',
  },
  templateUrl: './line.html',
  styleUrls: ['line.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DtMicroChartSeriesSVG, useExisting: DtMicroChartLineSeriesSVG },
  ],
})
export class DtMicroChartLineSeriesSVG extends DtMicroChartExtremeSeriesSVG<
  DtMicroChartLineDataPoint
> {
  /** Points to render in the line series. */
  @Input() points: DtMicroChartLineDataPoint[];

  /** Svg path string representing data as a line. */
  @Input() path: string;

  /** Svg path string representing the interpolated values. */
  @Input() interpolatedPath: string;

  /** @internal Radius for the point markers. */
  _markerRadius = 4;

  /** @internal Radius for the point markers. */
  _extremeRadius = 6;

  constructor(viewContainerRef: ViewContainerRef, zone: NgZone) {
    super(viewContainerRef, zone);
  }
}
