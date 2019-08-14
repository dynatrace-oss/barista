import { DtMicroChartConfig } from '../micro-chart-config';
import { DtMicroChartSeries } from '../public-api/series';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

export abstract class DtMicroChartSeriesSVG extends DtMicroChartSeries
  implements OnDestroy {
  /** @internal Destroy subject that fires when the component gets destroyed */
  protected _destroy = new Subject<void>();

  /** Represents the color of the SVG series. */
  color: string;

  /** @internal Configuration object for the SVG series. */
  _config: DtMicroChartConfig;

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
