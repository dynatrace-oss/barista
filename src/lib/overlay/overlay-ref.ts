import { OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { addCssClass, removeCssClass } from '../core';
import { Subscription, Observable } from 'rxjs';
import { DtOverlayContainer } from './overlay-container';

/** Css class that is used to disable pointerevents on the backdrop */
export const DT_OVERLAY_NO_POINTER_CLASS = 'dt-overlay-no-pointer';

export class DtOverlayRef<T> {
  /** The instance of component opened into the dialog. */
  componentInstance: T;

  /** Wether the overlay is pinned or not */
  pinned = false;

  private _backDropClickSub = Subscription.EMPTY;

  constructor(private _overlayRef: OverlayRef, public _containerInstance: DtOverlayContainer) {
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
   * @param event? optional mouse event passed to the update position
   */
  updatePosition(event?: MouseEvent): this {

    this._overlayRef.updatePosition();
    return this;
  }

  /** Gets an observable that emits when the overlay's backdrop has been clicked. */
  backdropClick(): Observable<MouseEvent> {
    return this._overlayRef.backdropClick();
  }

  /** Fetches the position strategy object from the overlay ref. */
  private _getPositionStrategy(): PositionStrategy | undefined {
    return this._overlayRef.getConfig().positionStrategy;
  }
}
