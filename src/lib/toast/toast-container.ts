import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Inject,
  OnDestroy,
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
    'class': 'dt-toast-container',
    '[@fade]': '_animationState',
    '(@fade.done)': '_animationDone($event)',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    trigger('fade', [
      state('enter', style({opacity: 1})),
      transition('enter => exit', animate(`${DT_TOAST_FADE_TIME}ms ease-in-out`)),
      transition('void => enter', animate(`${DT_TOAST_FADE_TIME}ms ease-in-out`)),
    ]),
  ],
})
export class DtToastContainer implements OnDestroy {
  private _destroyed = false;

  readonly _onExit: Subject<void> = new Subject();

  readonly _onEnter: Subject<void> = new Subject();

  _animationState = 'void';

  constructor(
    @Inject(DT_TOAST_MESSAGE) public message: string,
    private _ngZone: NgZone
  )  {
  }

  ngOnDestroy(): void {
    this._destroyed = true;
    this._safeExit();
  }

  _animationDone(event: AnimationEvent): void {
    const {fromState, toState} = event;

    if ((toState === 'void' && fromState !== 'void') || toState === 'exit') {
      this._safeExit();
    }

    if (toState === 'enter') {
      // Note: we shouldn't use `this` inside the zone callback,
      // because it can cause a memory leak.
      const onEnter = this._onEnter;

      this._ngZone.run(() => {
        onEnter.next();
        onEnter.complete();
      });
    }
  }

  enter(): void {
    if (!this._destroyed) {
      this._animationState = 'enter';
    }
  }

  exit(): void {
    this._animationState = 'exit';
  }

  private _safeExit(): void {
    this._ngZone.onMicrotaskEmpty.asObservable().pipe(take(1)).subscribe(() => {
      this._onExit.next();
      this._onExit.complete();
    });
  }
}
