import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation, ChangeDetectorRef, ElementRef,
} from '@angular/core';
import {DtProgressBase, DtProgressChange} from '../progress-base/progress-base';

/** Circumference for the path data in the html file - this does not change unless the path is changed */
const CIRCLE_CIRCUMFERENCE = 328;

export type DtProgressCircleChange = DtProgressChange;

@Component({
  moduleId: module.id,
  selector: 'dt-progress-circle',
  templateUrl: 'progress-circle.html',
  styleUrls: ['progress-circle.scss'],
  exportAs: 'dtProgressCircle',
  host: {
    class: 'dt-progress-circle',
    role: 'progressbar',
  },
  inputs: ['color'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtProgressCircle extends DtProgressBase<DtProgressCircleChange> {

  /** Dash offset base on the values percentage */
  _dashOffset: number = CIRCLE_CIRCUMFERENCE;

  constructor(
    elementRef: ElementRef,
    _changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef, _changeDetectorRef);
  }

  /** Updates all view parameters */
  protected _calculateViewParams(): void {
    this._dashOffset = this._calculateDashOffset(this._calculatePercentage(this.value));
    super._calculateViewParams();
  }

  /** Calculates the dash offset of the progress circle based on the calculated percent */
  private _calculateDashOffset(percent: number): number {
    // tslint:disable-next-line: no-magic-numbers
    return CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE / 100 * percent);
  }

  protected _emitValueChangeEvent(oldValue: number, newValue: number): void {
    this.valueChange.emit({oldValue, newValue});
  }
}
