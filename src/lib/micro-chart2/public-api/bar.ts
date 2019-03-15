import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnChanges, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { DtMicroChartSeries, DtMicroChartSeriesType, DtMicroChartStackableSeries } from './series';
import { DtMicroChartStackContainer } from './stacked-container';
import { isDefined } from '@dynatrace/angular-components/core';

@Component({
  selector: 'dt-micro-chart-bar-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'dtMicroChartBarSeries',
  inputs: ['data', 'color'],
  providers: [{ provide: DtMicroChartSeries, useExisting: DtMicroChartBarSeries }],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMicroChartBarSeries extends DtMicroChartStackableSeries implements OnChanges, OnDestroy {
  readonly type: DtMicroChartSeriesType = 'bar';

  constructor(@Optional() @SkipSelf() public _stackedContainer: DtMicroChartStackContainer) {
    super(_stackedContainer);
  }
}
