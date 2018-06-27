import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input, ChangeDetectorRef, Output, EventEmitter, ElementRef,
} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import { DtProgressChange, HasProgressValues, mixinHasProgress} from '@dynatrace/angular-components/progress-base';
import { mixinColor, CanColor } from '@dynatrace/angular-components/core';

export type DtProgressBarChange = DtProgressChange;

export class DtProgressBarBase {
  constructor(public _elementRef: ElementRef) { }
}

export const _DtProgressBar = mixinHasProgress(mixinColor(DtProgressBarBase, 'main'));

@Component({
  moduleId: module.id,
  selector: 'dt-progress-bar',
  templateUrl: 'progress-bar.html',
  styleUrls: ['progress-bar.scss'],
  exportAs: 'dtProgressBar',
  host: {
    'class': 'dt-progress-bar',
    'role': 'progressbar',
    '[class.dt-progress-bar-right]': 'rightAligned',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuenow]': 'value',
  },
  inputs: ['color', 'value', 'min', 'max'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtProgressBar extends _DtProgressBar implements CanColor, HasProgressValues {

  /** If the progress bar element is aligned to the right */
  @Input()
  get rightAligned(): boolean { return this._rightAligned; }
  set rightAligned(v: boolean) {
    this._rightAligned = coerceBooleanProperty(v);
  }

  @Output()
  readonly valueChange = new EventEmitter<DtProgressBarChange>();

  private _rightAligned = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef, public _elementRef: ElementRef) {
    super(_elementRef);
  }

  /** Updates all view parameters */
  _updateValues(): void {
    super._updateValues();
    this._changeDetectorRef.markForCheck();
  }

  _emitValueChangeEvent(oldValue: number, newValue: number): void {
    this.valueChange.emit({oldValue, newValue});
  }
}
