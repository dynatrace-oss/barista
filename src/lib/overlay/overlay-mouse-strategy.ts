import { PositionStrategy } from '@angular/cdk/overlay';
import { OverlayRef } from '@angular/cdk/overlay/typings/overlay-ref';
import { Injectable } from '@angular/core';
import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components';

const LOG: DtLogger = DtLoggerFactory.create('DtOverlayService');

@Injectable({ providedIn: 'root'})
export class MouseFollowPositionStrategy implements PositionStrategy {
  /** The overlay to which this strategy is attached. */
  private _overlayRef: OverlayRef | null;

  /** The overlay pane element. */
  private _pane: HTMLElement;

  /**
   * Parent element for the overlay panel used to constrain the overlay panel's size to fit
   * within the viewport.
   */
  private _boundingBox: ClientRect | null;

  private _getViewportWidth(): number {
    return document.documentElement.clientWidth;
  }

  private _setPosition(el, offsetX): void {
    el.style.transform =
      `translate(${offsetX}px, 0)`;
  }

  private _hasRemainingSpace (pageX, boundingBox): number {
    // check if overlay fits to the right
    // TODO: check the position and add offsets if needed - e.g. originX is set to center substract half the width of the trigger
    const viewportWidth = this._getViewportWidth();
    const remainingSpaceToTheRight = viewportWidth - pageX - boundingBox.width;

    return remainingSpaceToTheRight;
  }

  attach(overlayRef: OverlayRef): void {
    this._overlayRef = overlayRef;
    this._boundingBox = overlayRef.overlayElement.getBoundingClientRect();
  }

  apply(): void {
    LOG.debug('apply');
  }

  detach(): void {
    this._overlayRef = null;
  }

  dispose(): void {
    LOG.debug('dispose');
  }

  move(event: MouseEvent): void {
    if (this._overlayRef && this._boundingBox) {

      if (this._hasRemainingSpace(event.pageX, this._boundingBox) > 0) {
        this._setPosition(this._overlayRef.overlayElement, event.offsetX);
      }

      LOG.debug('mouse move', event);
    }
  }

}
