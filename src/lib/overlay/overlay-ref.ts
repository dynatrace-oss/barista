import { OverlayRef } from '@angular/cdk/overlay';
import { addCssClass, removeCssClass } from '../core';

export const DT_OVERLAY_NO_POINTER_CLASS = 'dt-overlay-no-pointer';

export class DtOverlayRef {

  /** wether the overlay is pinned or not */
  public pinned: boolean = false;

  constructor(public overlayRef: OverlayRef) {}

  pin(value: boolean): void {
    this.pinned = value;
    if (value) {
      removeCssClass(this.overlayRef.backdropElement, DT_OVERLAY_NO_POINTER_CLASS);
    } else {
      addCssClass(this.overlayRef.backdropElement, DT_OVERLAY_NO_POINTER_CLASS);
    }
  }
}
