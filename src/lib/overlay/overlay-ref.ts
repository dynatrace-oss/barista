import { OverlayRef } from '@angular/cdk/overlay';
import { addCssClass, removeCssClass } from '../core';
import { Subscription } from 'rxjs';

export const DT_OVERLAY_NO_POINTER_CLASS = 'dt-overlay-no-pointer';

export class DtOverlayRef {

  /** wether the overlay is pinned or not */
  pinned = false;

  private _backDropClickSub = Subscription.EMPTY;

  constructor(public overlayRef: OverlayRef) {}

  pin(value: boolean): void {
    this.pinned = value;
    if (this.overlayRef.backdropElement) {
      if (value) {
        removeCssClass(this.overlayRef.backdropElement, DT_OVERLAY_NO_POINTER_CLASS);
        this.overlayRef.backdropClick().subscribe(() => {
          this.overlayRef.dispose();
        });
      } else {
        addCssClass(this.overlayRef.backdropElement, DT_OVERLAY_NO_POINTER_CLASS);
        this._backDropClickSub.unsubscribe();
      }
    }
  }
}
