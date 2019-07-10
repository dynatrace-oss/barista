import {
  SimpleChanges,
  TemplateRef,
  Input,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  unifySeriesData,
  DtMicroChartDataPoint,
} from '../business-logic/core/chart';
import { DtMicroChartStackContainer } from './stacked-container';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export type DtMicroChartSeriesType = 'line' | 'column' | 'bar';
export interface DtMicroChartRenderDataBase {
  type: DtMicroChartSeriesType;
  publicSeriesId: string;
  color: string;
  data: Array<number | null> | Array<[number, number | null]>;
}

export interface DtMicroChartRenderDataExtremes {
  highlightExtremes: boolean;
  // tslint:disable-next-line:no-any
  _minLabelTemplate: TemplateRef<any>;
  // tslint:disable-next-line:no-any
  _maxLabelTemplate: TemplateRef<any>;
}

let uniqueId = 1;

export abstract class DtMicroChartSeries implements OnChanges, OnDestroy {
  readonly type: DtMicroChartSeriesType;

  private _data: Array<number | null> | Array<[number, number | null]>;

  @Input()
  get data(): Array<number | null> | Array<[number, number | null]> {
    return this._data;
  }
  set data(value: Array<number | null> | Array<[number, number | null]>) {
    if (value) {
      this._transformedData = unifySeriesData(value);
    }
    this._data = value;
  }

  private _skipNullValues = false;

  /**
   * Whether null values should be skipped or interpolated. Defaults to false.
   */
  @Input()
  get skipNullValues(): boolean {
    return this._skipNullValues;
  }
  set skipNullValues(value: boolean) {
    this._skipNullValues = coerceBooleanProperty(value);
  }

  /** This might be temporary */
  @Input()
  color: string;

  /** @internal Assign unique id to the series. */
  _id = `series${uniqueId++}`;

  /**
   * @internal
   * Stores the transformed series data to unify datastream.
   */
  _transformedData: DtMicroChartDataPoint[];

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

  ngOnChanges(_changes: SimpleChanges): void {
    this._stateChanges.next(this);
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }
}

export abstract class DtMicroChartStackableSeries extends DtMicroChartSeries {
  get isStacked(): boolean {
    return !!this._stackedContainer && !this._stackedContainer.disabled;
  }

  constructor(public _stackedContainer: DtMicroChartStackContainer) {
    super();
  }
}
