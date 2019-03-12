import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewContainerRef,
  NgZone,
} from '@angular/core';
import { DtMicroChartSeriesSVG } from './series';
import { DtMicroChartColumnDataPoint } from '../business-logic/core/column';
import { DtMicroChartExtremeSeriesSVG } from './series-extreme';

let uniqueId = 0;

@Component({
  selector: 'g[dt-micro-chart-column-series]',
  host: {
    'class': 'dt-micro-chart-series dt-micro-chart-column-series',
    '[class.awesome]': 'id == 0',
  },
  templateUrl: 'column.html',
  styleUrls: ['column.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DtMicroChartSeriesSVG, useExisting: DtMicroChartColumnSeriesSVG },
  ],
})
export class DtMicroChartColumnSeriesSVG extends DtMicroChartExtremeSeriesSVG<DtMicroChartColumnDataPoint> {
  /** Points input to render columns. */
  @Input() points: DtMicroChartColumnDataPoint[];

  /** Datapoint to with certain offset to highlicht the minimum. */
  @Input() minHighlightRectangle: DtMicroChartColumnDataPoint;

  /** Datapoint to with certain offset to highlicht the maximum. */
  @Input() maxHighlightRectangle: DtMicroChartColumnDataPoint;

  id = uniqueId++;

  constructor(viewContainerRef: ViewContainerRef, zone: NgZone) {
    super(viewContainerRef, zone);
  }
}
