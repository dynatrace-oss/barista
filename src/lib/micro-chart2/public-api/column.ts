import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnChanges, OnDestroy, ContentChild, TemplateRef, Input, Optional, SkipSelf } from '@angular/core';
import { DtMicroChartSeries, DtMicroChartSeriesType, DtMicroChartRenderDataBase, DtMicroChartRenderDataExtremes, DtMicroChartStackableSeries } from './series';
import { DtMicroChartMinLabel, DtMicroChartMaxLabel } from './extreme-label';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DtMicroChartStackContainer } from './stacked-container';
import { isDefined } from '@dynatrace/angular-components/core';

@Component({
  selector: 'dt-micro-chart-column-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'dtMicroChartColumnSeries',
  providers: [{ provide: DtMicroChartSeries, useExisting: DtMicroChartColumnSeries }],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMicroChartColumnSeries extends DtMicroChartStackableSeries implements OnChanges, OnDestroy {
  private _highlightExtremes;

  readonly type: DtMicroChartSeriesType = 'column';

  @ContentChild(DtMicroChartMinLabel, { read: TemplateRef }) _minLabelTemplate: TemplateRef<any>;
  @ContentChild(DtMicroChartMaxLabel, { read: TemplateRef }) _maxLabelTemplate: TemplateRef<any>;

  /**
   * Whether the autocomplete is disabled. When disabled, the element will
   * act as a regular input and the user won't be able to open the panel.
   */
  @Input('highlightExtremes')
  get hightlightExtremes(): boolean { return this._highlightExtremes; }
  set hightlightExtremes(value: boolean) {
    this._highlightExtremes = coerceBooleanProperty(value);
  }

  get _isStacked(): boolean {
    return isDefined(this._stackedContainer);
  }

  constructor(@Optional() @SkipSelf() public _stackedContainer: DtMicroChartStackContainer) {
    super(_stackedContainer);
  }

  get _renderData(): DtMicroChartRenderDataBase & DtMicroChartRenderDataExtremes {
    return {
      type: this.type,
      publicSeriesId: this._id,
      data: this.data,
      highlightExtremes: this._highlightExtremes,
      _minLabelTemplate: this._minLabelTemplate,
      _maxLabelTemplate: this._maxLabelTemplate,
    };
  }
}
