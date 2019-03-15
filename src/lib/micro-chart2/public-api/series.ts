import { SimpleChanges, Input, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { unifySeriesData, DtMicroChartUnifiedInputData } from '../business-logic/core/chart';
import { DtMicroChartStackContainer } from './stacked-container';

export type DtMicroChartSeriesType = 'line' | 'column' | 'bar';
export interface DtMicroChartRenderDataBase {
  type: DtMicroChartSeriesType;
  publicSeriesId: string;
  color: string;
  data: Array<number|null> | number[][];
}

export interface DtMicroChartRenderDataExtremes {
  highlightExtremes: boolean;
  _minLabelTemplate: TemplateRef<any>;
  _maxLabelTemplate: TemplateRef<any>;
}

let uniqueId = 1;

export abstract class DtMicroChartSeries {
  readonly type: DtMicroChartSeriesType;

  private _data: Array<number|null> | number[][];

  get data(): Array<number|null> | number[][] {
    return this._data;
  }
  set data(value: Array<number|null> | number[][]) {
    if (value) {
      this._transformedData = unifySeriesData(value);
    }
    this._data = value;
  }

  /** This might be temporary */
  color: string;

  /** @internal Assign unique id to the series. */
  _id = `series${uniqueId++}`;

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
      color: this.color,
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

export abstract class DtMicroChartStackableSeries extends DtMicroChartSeries {
  get isStacked(): boolean { return !!this._stackedContainer && !this._stackedContainer.disabled; }

  constructor(public _stackedContainer: DtMicroChartStackContainer) {
    super();
  }
}
