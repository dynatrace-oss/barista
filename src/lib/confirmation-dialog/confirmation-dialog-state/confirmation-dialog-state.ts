import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { DT_CONFIRMATION_FADE_DURATION } from '../confirmation-dialog-constants';

@Component({
  moduleId: module.id,
  selector: 'dt-confirmation-dialog-state',
  templateUrl: './confirmation-dialog-state.html',
  styleUrls: ['./confirmation-dialog-state.scss'],
  exportAs: 'dtConfirmationDialogState',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    '[attr.aria-hidden]': '!_isActive',
  },
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          `${DT_CONFIRMATION_FADE_DURATION}ms ease-in-out`,
          style({ opacity: 1 }),
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(
          `${DT_CONFIRMATION_FADE_DURATION}ms ease-in-out`,
          style({ opacity: 0 }),
        ),
      ]),
    ]),
  ],
})
export class DtConfirmationDialogState {
  /** The name of this particular state. */
  @Input() name: string;

  /**
   * @internal
   * Apply or remove the aria-hidden attribute to the host element.
   */
  _isActive = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /** @internal updates the _isActive property on the state */
  _updateActive(value: boolean): void {
    this._isActive = value;
    this._changeDetectorRef.markForCheck();
  }
}
