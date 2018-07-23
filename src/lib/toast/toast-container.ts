import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { DT_TOAST_MESSAGE, DT_TOAST_FADE_TIME } from './toast';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  moduleId: module.id,
  selector: 'dt-toast',
  exportAs: 'dtToast',
  template: '{{message}}',
  styleUrls: ['toast-container.scss'],
  host: {
    'class': 'dt-toast',
    '[@fade]': '_animationState',
    '(@fade.done)': '_animationDone($event)',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition('void => enter', [
        animate(`${DT_TOAST_FADE_TIME}ms ease-in-out`, style({ opacity: 1 })),
      ]),
      transition('enter => void', [
        animate(`${DT_TOAST_FADE_TIME}ms ease-in-out`, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class DtToastContainer implements OnDestroy {
  private _destroyed = false;

  readonly _afterLeave = new Subject<void>();

  _animationState = 'void';

  constructor(@Inject(DT_TOAST_MESSAGE) public message: string, private _ngZone: NgZone)  {}

  ngOnDestroy(): void {
    this._destroyed = true;
    this._ngZone.onMicrotaskEmpty.asObservable().pipe(take(1)).subscribe(() => {
      this._afterLeave.next();
      this._afterLeave.complete();
    });
  }

  _animationDone(event: AnimationEvent): void {
    if (event.fromState === 'enter' && event.toState === 'void') {
      this._afterLeave.next();
      this._afterLeave.complete();
    }
  }

  _enter(): void {
    if (!this._destroyed) {
      this._animationState = 'enter';
    }
  }
}
