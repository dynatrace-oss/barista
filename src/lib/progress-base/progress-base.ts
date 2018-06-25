import {ChangeDetectorRef, ElementRef, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import { mixinColor, CanColor } from '../core/index';
import {coerceNumberProperty} from '@angular/cdk/coercion';

export class DtProgressBaseBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _DtProgressMixinBase = mixinColor(DtProgressBaseBase, 'main');

export interface DtProgressChange {
  newValue: number;
  oldValue: number;
}

export abstract class DtProgressBase<EVENT_TYPE extends DtProgressChange> extends _DtProgressMixinBase implements CanColor {

  private _value: number | null = null;
  private _min = 0;
  private _max = 100;
  private _percent = 0;

  @Output() readonly valueChange = new EventEmitter<EVENT_TYPE>();

  /** Value of the progress component. */
  @Input()
  @HostBinding('attr.aria-valuenow')
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
      this._emitValueChangeEvent(coerceNumberProperty(this.value), coerceNumberProperty(clamp(v)));
      this._value = coerceNumberProperty(v);
      this._calculateViewParams();
    }
  }

  /** The maximum value that the progress component can have. */
  @Input()
  @HostBinding('attr.aria-valuemax')
  get max(): number {
    return this._max;
  }

  set max(v: number) {
    this._max = coerceNumberProperty(v, this._max);
    this._calculateViewParams();
  }

  /** The minimum value that the slider can have. */
  @Input()
  @HostBinding('attr.aria-valuemin')
  get min(): number {
    return this._min;
  }

  set min(v: number) {
    this._min = coerceNumberProperty(v, this._min);
    this._calculateViewParams();
  }

  /** The percentage of the progress component that coincides with the value. */
  get percent(): number {
    return clamp(this._percent);
  }

  protected constructor(
    elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef);
  }

  /** Calculates the percentage of the progress component that a value is. */
  protected _calculatePercentage(value: number | null): number {
    // tslint:disable-next-line: no-magic-numbers
    return ((value || 0) - this.min) / (this.max - this.min) * 100;
  }

  /** Updates all view parameters */
  protected _calculateViewParams(): void {
    this._percent = this._calculatePercentage(this.value);

    // Since this also modifies the percentage and dashOffset,
    // we need to let the change detection know.
    this._changeDetectorRef.markForCheck();
  }

  protected abstract _emitValueChangeEvent(oldValue: number, newValue: number): void;

}

/** Clamps a value to be between two numbers, by default 0 and 100. */
function clamp(v: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, v));
}
