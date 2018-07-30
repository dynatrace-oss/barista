import { OverlayRef } from '@angular/cdk/overlay';
import { addCssClass, removeCssClass } from '@dynatrace/angular-components/core';
import { Subscription, Observable } from 'rxjs';
import { DtOverlayContainer } from './overlay-container';
import { MouseFollowPositionStrategy } from './mouse-follow-position-strategy';

/** Css class that is used to disable pointerevents on the backdrop */
export const DT_OVERLAY_NO_POINTER_CLASS = 'dt-overlay-no-pointer';

export class DtOverlayRef<T> {
  /** The instance of component opened into the overlay. */
  componentInstance: T;

  /** Wether the overlay is pinned or not */
  pinned = false;

  private _backDropClickSub = Subscription.EMPTY;

  constructor(private _overlayRef: OverlayRef, public containerInstance: DtOverlayContainer) {
    _overlayRef.detachments().subscribe(() => {
      this.componentInstance = null!;
      this._overlayRef.dispose();
    });
  }

  /** Pins the overlay */
  pin(value: boolean): void {
    this.pinned = value;
    if (this._overlayRef.backdropElement) {
      if (value) {
        removeCssClass(this._overlayRef.backdropElement, DT_OVERLAY_NO_POINTER_CLASS);
        this._overlayRef.backdropClick().subscribe(() => {
          this._overlayRef.dispose();
        });
      } else {
        addCssClass(this._overlayRef.backdropElement, DT_OVERLAY_NO_POINTER_CLASS);
        this._backDropClickSub.unsubscribe();
      }
    }
  }

  /** Closes the overlay */
  close(): void {
    this._overlayRef.dispose();
  }

  /**
   * Updates the position of the overlay
   */
  _updatePositionFromMouse(offsetX?: number, offsetY?: number): this {
    const config = this._overlayRef.getConfig();
    (config.positionStrategy! as MouseFollowPositionStrategy)._withMouseOffset(offsetX, offsetY);

    if (this._isDefined(offsetX) || this._isDefined(offsetY)) {
      this._overlayRef.updatePosition();
    }
    return this;
  }

  /** Gets an observable that emits when the overlay's backdrop has been clicked. */
  backdropClick(): Observable<MouseEvent> {
    return this._overlayRef.backdropClick();
  }

  /** TODO: FFR: use core version as soon as dt-select is merged */
  _isDefined(value: any): boolean {
    return value !== undefined && value !== null;
  }

}
