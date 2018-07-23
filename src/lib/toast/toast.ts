import { Injectable, Injector, InjectionToken } from '@angular/core';
import { Subject, timer, Subscription } from 'rxjs';
import { DtToastContainer } from './toast-container';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { switchMap, tap } from 'rxjs/operators';
import { DtToastRef } from '@dynatrace/angular-components/toast/toast-ref';

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
  dismissed: Subject<DtToastRef> = new Subject<DtToastRef>();

  private _openedToastRef: DtToastRef | null;

  constructor(private _overlay: Overlay, private _injector: Injector) {}

  /** Creates a new toast and dismisses the current one if one exists */
  create(message: string): DtToastRef {
    const injector = new PortalInjector(this._injector, new WeakMap<InjectionToken<string>, string>([
      [DT_TOAST_MESSAGE, message],
    ]));
    const containerPortal = new ComponentPortal(DtToastContainer, null, injector);
    const overlayRef = this._createOverlay();
    const componentRef = overlayRef.attach(containerPortal);
    const duration = this._calculateToastDuration(message);
    const toastRef = new DtToastRef(componentRef.instance, overlayRef, duration);

    this._animateDtToastContainer(toastRef);
    this._openedToastRef = toastRef;
    return this._openedToastRef;
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

  /** calculates the duration the toast is shown based on the message length */
  private _calculateToastDuration(message: string): number {
    return DT_TOAST_PERCEIVE_TIME + DT_TOAST_CHAR_READ_TIME * message.length;
  }

  private _animateDtToastContainer(toastRef: DtToastRef): void {
    toastRef._afterDismissed.subscribe(() => {
      if (this._openedToastRef === toastRef) {
        this._openedToastRef = null;
      }
    });

    /** check if there is already one toast open */
    if (this._openedToastRef) {
      /** wait until the open toast is dismissed - then open the new one */
      this._openedToastRef._afterDismissed.subscribe(() => {
        toastRef.containerInstance._enter();
      });
      /** dismiss the current open toast */
      this._openedToastRef._dismiss();
    } else {
      toastRef.containerInstance._enter();
    }
  }
}
