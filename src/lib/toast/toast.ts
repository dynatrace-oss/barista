import { Injectable, Injector, InjectionToken } from '@angular/core';
import { Subject, timer, Subscription } from 'rxjs';
import { DtToastRef } from './toast-ref';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { switchMap, tap } from 'rxjs/operators';

const DT_TOAST_BOTTOM_SPACING = 24;

const DT_TOAST_DEFAULT_CONFIG: OverlayConfig = {
  hasBackdrop: false,
  minHeight: 52,
};

const DT_TOAST_PERCEIVE_TIME = 500;
export const DT_TOAST_FADE_TIME = 150;
const DT_TOAST_CHAR_READ_TIME = 50;

export const DT_TOAST_MESSAGE = new InjectionToken<string>('DtToastMessage');

@Injectable({providedIn: 'root'})
export class DtToast {

  created: Subject<DtToastRef> = new Subject<DtToastRef>();
  dismissed: Subject<void> = new Subject<void>();

  private _overlayRef: OverlayRef | null;
  private _timerSub = Subscription.EMPTY;

  constructor(private _overlay: Overlay, private _injector: Injector) {}

  /** Creates a new toast and dismisses the current one if one exists */
  create(message: string): void {
    if (message) {
      this._detach();
      const injector = new PortalInjector(this._injector, new WeakMap<InjectionToken<string>, string>([
        [DT_TOAST_MESSAGE, message],
      ]));
      const containerPortal = new ComponentPortal(DtToastRef, null, injector);
      this._overlayRef = this._createOverlay();
      const dtToastRef = this._overlayRef.attach(containerPortal);
      const duration = this._calculateToastDuration(message);
      this._timerSub = timer(duration)
      .pipe(tap(() => {
        dtToastRef.instance.animationState = 'leave';
      }))
      .pipe(switchMap(() => dtToastRef.instance.animationDone))
      .subscribe(() => {
        console.log('leave animation done');
      });
      this.created.next();
    }
  }

  /** Dismisse the current toast */
  dismiss(): void {
    this._detach();
  }

  /**
   * Creates a new overlay
   */
  private _createOverlay(): OverlayRef {

    const positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .bottom(`${DT_TOAST_BOTTOM_SPACING}px`);

    return this._overlay.create({ ...DT_TOAST_DEFAULT_CONFIG, positionStrategy });
  }

  private _detach(): void {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef.dispose();
      this._overlayRef = null;
      this.dismissed.next();
    }
    this._timerSub.unsubscribe();
  }

  /** calculates the duration the toast is shown based on the message length */
  private _calculateToastDuration(message: string): number {
    return DT_TOAST_PERCEIVE_TIME + DT_TOAST_CHAR_READ_TIME * message.length;
  }
}
