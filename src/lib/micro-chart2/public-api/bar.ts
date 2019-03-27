import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnChanges, OnDestroy, Optional, SkipSelf, Input } from '@angular/core';
import { DtMicroChartSeries, DtMicroChartSeriesType, DtMicroChartStackableSeries } from './series';
import { DtMicroChartStackContainer } from './stacked-container';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

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
  private _skipNullValues: boolean;

  /**
   * Whether the autocomplete is disabled. When disabled, the element will
   * act as a regular input and the user won't be able to open the panel.
   */
  @Input('skipNullValues')
  get skipNullValues(): boolean { return this._skipNullValues; }
  set skipNullValues(value: boolean) {
    this._skipNullValues = coerceBooleanProperty(value);
  }

  constructor(@Optional() @SkipSelf() public _stackedContainer: DtMicroChartStackContainer) {
    super(_stackedContainer);
  }
}
