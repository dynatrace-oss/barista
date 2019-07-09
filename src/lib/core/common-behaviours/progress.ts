import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Constructor } from './constructor';
import { clamp } from '../util/number-util';
import { EventEmitter } from '@angular/core';

export interface DtProgressChange {
  newValue: number;
  oldValue: number;
}

export interface HasProgressValues {
  /** The minimum value that the slider can have. */
  min: number;

  /** The maximum value that the progress component can have. */
  max: number;

  /** Value of the progress component. */
  value: number;

  /** The percentage of the progress component that coincides with the value. */
  percent: number;

  /** Emits valueChange event if the value of the progress is updated */
  valueChange: EventEmitter<DtProgressChange>;

  /** @internal */
  _updateValues(): void;
}

/** Mixin to augment a directive with a `disabled` property. */
export function mixinHasProgress<T extends Constructor<{}>>(
  base: T
): Constructor<HasProgressValues> & T {
  return class extends base {
    private _value: number | null = null;
    private _min = 0;
    private _max = 100;
    private _percent = 0;

    /** The maximum value that the progress component can have. */
    get max(): number {
      return this._max;
    }

    set max(v: number) {
      this._max = coerceNumberProperty(v, this._max);
      this._updateValues();
    }

    /** The minimum value that the slider can have. */
    get min(): number {
      return this._min;
    }

    set min(v: number) {
      this._min = coerceNumberProperty(v, this._min);
      this._updateValues();
    }

    /** Value of the progress component. */
    get value(): number {
      // If the value needs to be read and it is still uninitialized,
      // or if the value is smaller than the min set it to the min.
      if (this._value === null || this._value < this._min) {
        return this._min;
      }
      // Also check for the upper bound and set the value to the max
      if (this._value > this._max) {
        return this._max;
      }
      return this._value;
    }

    set value(v: number) {
      if (clamp(v) !== this.value) {
        this.valueChange.emit({
          oldValue: coerceNumberProperty(this.value),
          newValue: coerceNumberProperty(clamp(v)),
        });
        this._value = coerceNumberProperty(v);
        this._updateValues();
      }
    }

    /** The percentage of the progress component that coincides with the value. */
    get percent(): number {
      return this._percent;
    }

    /** Emits valueChange event if the value of the progress is updated */
    readonly valueChange = new EventEmitter<DtProgressChange>();

    // tslint:disable-next-line
    constructor(...args: any[]) {
      super(...args); // tslint:disable-line:no-inferred-empty-object-type
    }

    /** Calculates the percentage of the progress component that a value is. */
    private _calculatePercentage(value: number | null): number {
      // tslint:disable-next-line: no-magic-numbers
      return clamp((((value || 0) - this.min) / (this.max - this.min)) * 100);
    }

    /** @internal Updates all parameters */
    _updateValues(): void {
      this._percent = this._calculatePercentage(this.value);
    }
  };
}
