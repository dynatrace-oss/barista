import { DtMicroChartSeries, DtMicroChartBarSeries, DtMicroChartColumnSeries } from '../public-api';
import { Constructor } from '@dynatrace/angular-components/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CanStackSeries {
  /** Whether the series can be stacked. */
  stacked: boolean;
  stack(): void;
  unstack(): void;
  readonly _stackedChange: Observable<boolean>;
}

/** Mixin to augment a class with a `stacked` property. */
export function mixinStackedSeries<T extends Constructor<DtMicroChartSeries>>(base: T):
  Constructor<CanStackSeries & DtMicroChartSeries> & T {
  return class extends base {
    private _stacked = false;

    get stacked(): boolean { return this._stacked; }
    set stacked(value: boolean) {
      const coerced = coerceBooleanProperty(value);
      if (coerced !== this._stacked) {
        this._stacked = coerced;
        this._stackedChange.next(this._stacked);
      }
    }

    stack(): void {
      this._stacked = true;
      // TODO: check if cd needs to run
      // this._changeDetectorRef.markForCheck();
    }

    unstack(): void {
      this._stacked = false;
      // TODO: check if cd needs to run
      // this._changeDetectorRef.markForCheck();
    }

    readonly _stackedChange = new BehaviorSubject<boolean>(this._stacked);

    // tslint:disable-next-line
    constructor(...args: any[]) { super(...args); }
  };
}

export function canStackSeries(series: DtMicroChartSeries): boolean {
  switch(series.constructor) {
    case DtMicroChartBarSeries:
    case DtMicroChartColumnSeries:
      return true;
    default:
      return false;
  }
}