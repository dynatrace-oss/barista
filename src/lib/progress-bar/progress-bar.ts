import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input, ChangeDetectorRef, ElementRef,
} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {DtProgressBase, DtProgressChange} from '../progress-base/progress-base';

export type DtProgressBarChange = DtProgressChange;

@Component({
  moduleId: module.id,
  selector: 'dt-progress-bar',
  templateUrl: 'progress-bar.html',
  styleUrls: ['progress-bar.scss'],
  exportAs: 'dtProgressBar',
  host: {
    'class': 'dt-progress-bar',
    'role': 'progressbar',
    '[class.dt-progress-bar-right]': 'right',
  },
  inputs: ['color'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtProgressBar extends DtProgressBase<DtProgressBarChange> {

  /** If the progress bar is used in RTL mode */
  @Input()
  get right(): boolean { return this._right; }
  set right(v: boolean) {
    this._right = coerceBooleanProperty(v);
  }

  private _right = false;

  constructor(
    elementRef: ElementRef,
    _changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef, _changeDetectorRef);
  }

  protected _emitValueChangeEvent(oldValue: number, newValue: number): void {
    this.valueChange.emit({oldValue, newValue});
  }
}
