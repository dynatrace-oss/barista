import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnChanges,
  OnDestroy,
  Optional,
  SkipSelf,
} from '@angular/core';
import {
  DtMicroChartSeries,
  DtMicroChartSeriesType,
  DtMicroChartStackableSeries,
} from './series';
import { DtMicroChartStackContainer } from './stacked-container';

@Component({
  selector: 'dt-micro-chart-bar-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'dtMicroChartBarSeries',
  providers: [
    { provide: DtMicroChartSeries, useExisting: DtMicroChartBarSeries },
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMicroChartBarSeries extends DtMicroChartStackableSeries
  implements OnChanges, OnDestroy {
  /** Defines the type of the microchart series. */
  readonly type: DtMicroChartSeriesType = 'bar';

  constructor(
    @Optional()
    @SkipSelf()
    public _stackedContainer: DtMicroChartStackContainer,
  ) {
    super(_stackedContainer);
  }
}
