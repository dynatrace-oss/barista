import { SimpleChanges, Input, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { unifySeriesData, DtMicroChartUnifiedInputData } from '../business-logic/core/chart';

export type DtMicroChartSeriesType = 'line' | 'column' | 'bar';
export interface DtMicroChartRenderDataBase {
  type: DtMicroChartSeriesType;
  publicSeriesId: number;
  data: Array<number|null> | DtMicroChartUnifiedInputData;
}

export interface DtMicroChartRenderDataExtremes {
  highlightExtremes: boolean;
  _minLabelTemplate: TemplateRef<any>;
  _maxLabelTemplate: TemplateRef<any>;
}

let uniqueId = 1;

export abstract class DtMicroChartSeries {
  readonly type: DtMicroChartSeriesType;

  private _data: Array<number|null> | DtMicroChartUnifiedInputData;
  @Input()
  get data(): Array<number|null> | DtMicroChartUnifiedInputData {
    return this._data;
  }
  set data(value: Array<number|null> | DtMicroChartUnifiedInputData) {
    if (value) {
      this._transformedData = unifySeriesData(value);
    }
    this._data = value;
  }

  /** @internal Assign unique id to the series. */
  _id = uniqueId++;

  /**
   * @internal
   * Stores the transformed series data to unify datastream.
   */
  _transformedData: DtMicroChartUnifiedInputData;

  /**
   * @internal
   * Emits whenever some inputs change
   */
  _stateChanges = new BehaviorSubject<DtMicroChartSeries>(this);

  /** @internal */
  get _renderData(): DtMicroChartRenderDataBase {
    return {
      type: this.type,
      publicSeriesId: this._id,
      data: this.data,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._stateChanges.next(this);
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }
}
