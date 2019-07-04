import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  OnDestroy,
  OnChanges,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { DtMicroChartSeries, DtMicroChartSeriesType, DtMicroChartRenderDataBase, DtMicroChartRenderDataExtremes } from './series';
import { DtMicroChartMinLabel, DtMicroChartMaxLabel } from './extreme-label';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'dt-micro-chart-line-series',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  exportAs: 'dtMicroChartLineSeries',
  providers: [{ provide: DtMicroChartSeries, useExisting: DtMicroChartLineSeries }],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMicroChartLineSeries extends DtMicroChartSeries implements OnChanges, OnDestroy {
  private _highlightExtremes;
  readonly type: DtMicroChartSeriesType = 'line';

  // tslint:disable-next-line:no-any
  @ContentChild(DtMicroChartMinLabel, { static: true, read: TemplateRef }) _minLabelTemplate: TemplateRef<any>;
  // tslint:disable-next-line:no-any
  @ContentChild(DtMicroChartMaxLabel, { static: true, read: TemplateRef }) _maxLabelTemplate: TemplateRef<any>;

  /**
   * Whether the autocomplete is disabled. When disabled, the element will
   * act as a regular input and the user won't be able to open the panel.
   */
  @Input()
  get highlightExtremes(): boolean { return this._highlightExtremes; }
  set highlightExtremes(value: boolean) {
    this._highlightExtremes = coerceBooleanProperty(value);
  }

  get _renderData(): DtMicroChartRenderDataBase & DtMicroChartRenderDataExtremes {
    return {
      type: this.type,
      publicSeriesId: this._id,
      color: this.color,
      data: this.data,
      highlightExtremes: this._highlightExtremes,
      _minLabelTemplate: this._minLabelTemplate,
      _maxLabelTemplate: this._maxLabelTemplate,
    };
  }
}
