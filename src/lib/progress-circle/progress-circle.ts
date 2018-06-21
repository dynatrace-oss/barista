import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { mixinColor, CanColor } from '../core/index';
import { coerceNumberProperty } from '@angular/cdk/coercion';

/** Circumference for the path data in the html file - this does not change unless the path is changed */
const CIRCLE_CIRCUMFERENCE = 328;

export interface DtProgressCircleChange {
  newValue: number;
  oldValue: number;
}

// Boilerplate for applying mixins to DtProgressCircle.
export class DtProgressCircleBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _DtProgressCircleMixinBase = mixinColor(DtProgressCircleBase, 'main');

@Component({
  moduleId: module.id,
  selector: 'dt-progress-circle',
  templateUrl: 'progress-circle.html',
  styleUrls: ['progress-circle.scss'],
  exportAs: 'dtProgressCircle',
  host: {
    'class': 'dt-progress-circle',
    'role': 'progressbar',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuenow]': 'value',
  },
  inputs: ['color'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtProgressCircle extends _DtProgressCircleMixinBase implements CanColor {
  /** Value of the progress circle. */
  @Input()
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
      this._calculateViewParams();
    }
  }

  /** The maximum value that the progress circle can have. */
  @Input()
  get max(): number { return this._max; }
  set max(v: number) {
    this._max = coerceNumberProperty(v, this._max);
    this._calculateViewParams();
  }

  /** The minimum value that the slider can have. */
  @Input()
  get min(): number { return this._min; }
  set min(v: number) {
    this._min = coerceNumberProperty(v, this._min);
    this._calculateViewParams();
  }

  @Output() readonly valueChange = new EventEmitter<DtProgressCircleChange>();

  /** The percentage of the progress circle that coincides with the value. */
  get percent(): number { return clamp(this._percent); }

  /** Dash offset base on the values percentage */
  _dashOffset: number = CIRCLE_CIRCUMFERENCE;

  private _value: number | null = null;
  private _percent = 0;
  private _min = 0;
  private _max = 100;

  constructor(
    elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
      super(elementRef);
    }

  /** Updates all view parameters */
  private _calculateViewParams(): void {
    this._percent = this._calculatePercentage(this.value);
    this._dashOffset = this._calculateDashOffset(this._percent);

    // Since this also modifies the percentage and dashOffset,
    // we need to let the change detection know.
    this._changeDetectorRef.markForCheck();
  }

  /** Calculates the percentage of the progress circle that a value is. */
  private _calculatePercentage(value: number | null): number {
    // tslint:disable-next-line: no-magic-numbers
    return ((value || 0) - this.min) / (this.max - this.min) * 100;
  }

  /** Calculates the dash offset of the progress circle based on the calculated percent */
  private _calculateDashOffset(percent: number): number {
    // tslint:disable-next-line: no-magic-numbers
    return CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE / 100 * percent);
  }
}

/** Clamps a value to be between two numbers, by default 0 and 100. */
function clamp(v: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, v));
}
