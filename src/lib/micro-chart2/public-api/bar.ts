import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnChanges, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { DtMicroChartSeries, DtMicroChartSeriesType } from './series';
import { DtMicroChartStackedContainer } from './stacked-container';
import { isDefined } from '@dynatrace/angular-components/core';

@Component({
  selector: 'dt-micro-chart-bar-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'dtMicroChartBarSeries',
  inputs: ['stacked'],
  providers: [{ provide: DtMicroChartSeries, useExisting: DtMicroChartBarSeries }],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMicroChartBarSeries extends DtMicroChartSeries implements OnChanges, OnDestroy {
  readonly type: DtMicroChartSeriesType = 'bar';

  get _isStacked(): boolean {
    return isDefined(this._stackedContainer);
  }

  constructor(@Optional() @SkipSelf() private _stackedContainer: DtMicroChartStackedContainer) {
    super();
  }
}
