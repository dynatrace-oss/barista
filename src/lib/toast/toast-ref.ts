import { DtToastContainer } from './toast-container';
import { OverlayRef } from '@angular/cdk/overlay';
import {
  Subject,
  Observable,
  fromEvent,
  merge,
  interval,
  EMPTY,
  Subscription,
} from 'rxjs';
import { startWith, switchMap, mapTo, scan, takeWhile } from 'rxjs/operators';
import { DT_TOAST_CHAR_READ_TIME } from './toast-config';
import { NgZone } from '@angular/core';

export class DtToastRef {
  /** The instance for the toast-container that holds the message */
  containerInstance: DtToastContainer;

  /** The duration the toastref will be displayed */
  duration: number;

  /** Obersable that emits when the dismiss timer should be paused */
  private _pause$: Observable<boolean>;
  /** Observable that emits whenever the dismiss timer should be resumed */
  private _resume$: Observable<boolean>;
  /** Observable that emits everytime someone can read a char */
  private _interval$: Observable<number>;
  /** The subscription of the countdown */
  private _countdownSub = Subscription.EMPTY;

  private readonly _afterDismissed = new Subject<void>();

  constructor(
    containerInstance: DtToastContainer,
    duration: number,
    private _overlayRef: OverlayRef,
    private _zone: NgZone,
  ) {
    this.containerInstance = containerInstance;
    this.duration = duration;
    containerInstance._onDomExit.subscribe(() => {
      this._overlayRef.dispose();
      this._countdownSub.unsubscribe();
      this._afterDismissed.next();
      this._afterDismissed.complete();
    });
    this._interval$ = interval(DT_TOAST_CHAR_READ_TIME).pipe(
      mapTo(-DT_TOAST_CHAR_READ_TIME),
    );
    this._pause$ = fromEvent(
      this.containerInstance._elementRef.nativeElement,
      'mouseenter',
    ).pipe(mapTo(false));
    this._resume$ = fromEvent(
      this.containerInstance._elementRef.nativeElement,
      'mouseleave',
    ).pipe(mapTo(true));
  }

  /** Observable that emits when the toast finished the dismissal */
  afterDismissed(): Observable<void> {
    return this._afterDismissed.asObservable();
  }

  /** Observable that emits when the toast has finished the enter animation */
  afterOpened(): Observable<void> {
    return this.containerInstance._onEnter;
  }

  /** Dismisses the toast */
  dismiss(): void {
    if (!this._afterDismissed.closed) {
      this.containerInstance.exit();
    }
    this._countdownSub.unsubscribe();
  }

  /** Starts a timer to dismiss the toast automatically after the duration is over. Handles pausing and resuming the timer. */
  _dismissAfterTimeout(): void {
    this._zone.runOutsideAngular(() => {
      this._countdownSub = merge(this._pause$, this._resume$)
        .pipe(
          startWith(true),
          switchMap(val => (val ? this._interval$ : EMPTY)),
          scan((acc, curr) => (curr ? curr + acc : acc), this.duration),
          takeWhile(v => v >= DT_TOAST_CHAR_READ_TIME),
        )
        .subscribe({
          complete: () => {
            this._zone.run(() => {
              this.dismiss();
            });
          },
        });
    });
  }
}
