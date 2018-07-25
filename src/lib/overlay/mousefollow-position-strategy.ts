import { PositionStrategy, OverlayRef, ViewportRuler, OverlayContainer, ConnectedPosition } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { Subscription } from 'rxjs';

export class MouseFollowPositionStrategy implements PositionStrategy {
  private _overlayRef: OverlayRef;

  /** Cached origin dimensions */
  private _originRect: ClientRect;

  /** Cached overlay dimensions */
  private _overlayRect: ClientRect;

  /** Cached viewport dimensions */
  private _viewportRect: ClientRect;

  /** Amount of space that must be maintained between the overlay and the edge of the viewport. */
  private _viewportMargin = 0;

  /** The origin element against which the overlay will be positioned. */
  private _origin: HTMLElement;

  /** The overlay pane element. */
  private _pane: HTMLElement;

  /** Whether the strategy has been disposed of already. */
  private _isDisposed: boolean;

  /**
   * Parent element for the overlay panel used to constrain the overlay panel's size to fit
   * within the viewport.
   */
  private _boundingBox: HTMLElement | null;

  /** Default offset for the overlay along the x axis. */
  private _offsetX = 0;

  /** Default offset for the overlay along the y axis. */
  private _offsetY = 0;

  /** Subscription to viewport size changes. */
  private _resizeSubscription = Subscription.EMPTY;

  private _transformOriginSelector: string;

  /** Ordered list of preferred positions, from most to least desirable. */
  _preferredPositions: OverlayPositions[] = [];

  /** The last position to have been calculated as the best fit position. */
  private _lastPosition: OverlayPositions | null;

  constructor(
    connectedTo: ElementRef | HTMLElement,
    private _viewportRuler: ViewportRuler,
    private _document: Document,
    private _platform: Platform,
    private _overlayContainer: OverlayContainer) {
    this.setOrigin(connectedTo);
  }

  attach(overlayRef: OverlayRef): void {
    console.log('attached');
    if (this._overlayRef && overlayRef !== this._overlayRef) {
      throw Error('This position strategy is already attached to an overlay');
    }

    // validate position
    overlayRef.hostElement.classList.add('cdk-overlay-connected-position-bounding-box');

    this._overlayRef = overlayRef;
    this._boundingBox = overlayRef.hostElement;
    this._pane = overlayRef.overlayElement;
    this._resizeSubscription.unsubscribe();
    this._resizeSubscription = this._viewportRuler.change().subscribe(() => this.apply());
  }

  apply(): void {
    if (this._isDisposed || (this._platform && !this._platform.isBrowser)) {
      return;
    }

    this._viewportRect = this._getNarrowedViewportRect();
    this._originRect = this._origin.getBoundingClientRect();
    this._overlayRect = this._pane.getBoundingClientRect();

    const originRect = this._originRect;
    const overlayRect = this._overlayRect;
    const viewportRect = this._viewportRect;

    console.log('applied');

    // this._applyPosition(fallback!.position, fallback!.originPoint);
  }

  detach(): void {
    console.log('detached');
    this._resizeSubscription.unsubscribe();
  }

  dispose(): void {
    console.log('disposed');
    if (!this._isDisposed) {
      this.detach();
      this._boundingBox = null;
      this._isDisposed = true;
    }
  }

  /**
   * Sets the origin element, relative to which to position the overlay.
   * @param origin Reference to the new origin element.
   */
  setOrigin(origin: ElementRef | HTMLElement): this {
    this._origin = origin instanceof ElementRef ? origin.nativeElement : origin;
    return this;
  }

  /**
   * Sets a minimum distance the overlay may be positioned to the edge of the viewport.
   * @param margin Required margin between the overlay and the viewport edge in pixels.
   */
  withViewportMargin(margin: number): this {
    this._viewportMargin = margin;
    return this;
  }

  /**
   * Sets the default offset for the overlay's connection point on the x-axis.
   * @param offset New offset in the X axis.
   */
  withDefaultOffsetX(offset: number): this {
    this._offsetX = offset;
    return this;
  }

  /**
   * Sets the default offset for the overlay's connection point on the y-axis.
   * @param offset New offset in the Y axis.
   */
  withDefaultOffsetY(offset: number): this {
    this._offsetY = offset;
    return this;
  }

  withPositions(positions: OverlayPositions[]): this {
    this._preferredPositions = positions;

    // If the last calculated position object isn't part of the positions anymore, clear
    // it in order to avoid it being picked up if the consumer tries to re-apply.
    if (positions.indexOf(this._lastPosition!) === -1) {
      this._lastPosition = null;
    }

    // this._validatePositions();

    return this;
  }

  /**
   * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
   */
  private _getOriginPoint(originRect: ClientRect, pos: ConnectedPosition): Point {
    let x: number;
    if (pos.originX === 'center') {
      // Note: when centering we should always use the `left`
      // offset, otherwise the position will be wrong in RTL.
      x = originRect.left + (originRect.width / 2);
    } else {
      const startX = originRect.left;
      const endX = originRect.right;
      x = pos.originX === 'start' ? startX : endX;
    }

    let y: number;
    if (pos.originY === 'center') {
      y = originRect.top + (originRect.height / 2);
    } else {
      y = pos.originY === 'top' ? originRect.top : originRect.bottom;
    }

    return {x, y};
  }

  /**
   * Gets the (x, y) coordinate of the top-left corner of the overlay given a given position and
   * origin point to which the overlay should be connected.
   */
  private _getOverlayPoint(
    originPoint: Point,
    overlayRect: ClientRect,
    pos: ConnectedPosition): Point {

    // Calculate the (overlayStartX, overlayStartY), the start of the
    // potential overlay position relative to the origin point.
    let overlayStartX: number;
    if (pos.overlayX === 'center') {
      overlayStartX = -overlayRect.width / 2;
    } else if (pos.overlayX === 'start') {
      overlayStartX = 0;
    } else {
      overlayStartX = -overlayRect.width;
    }

    let overlayStartY: number;
    if (pos.overlayY === 'center') {
      overlayStartY = -overlayRect.height / 2;
    } else {
      overlayStartY = pos.overlayY === 'top' ? 0 : -overlayRect.height;
    }

    // The (x, y) coordinates of the overlay.
    return {
      x: originPoint.x + overlayStartX,
      y: originPoint.y + overlayStartY,
    };
  }

  /**
   * Applies a computed position to the overlay and emits a position change.
   * @param position The position preference
   * @param originPoint The point on the origin element where the overlay is connected.
   */
  private _applyPosition(position: ConnectedPosition, originPoint: Point): void {
    this._setTransformOrigin(position);
    // this._setOverlayElementStyles(originPoint, position);
    // this._setBoundingBoxStyles(originPoint, position);
  }

  /** Sets the transform origin based on the configured selector and the passed-in position.  */
  private _setTransformOrigin(position: ConnectedPosition): void {
    if (!this._transformOriginSelector) {
      return;
    }

    const elements: NodeListOf<HTMLElement> =
        this._boundingBox!.querySelectorAll(this._transformOriginSelector);
    let xOrigin: 'left' | 'right' | 'center';
    const yOrigin: 'top' | 'bottom' | 'center' = position.overlayY;

    xOrigin = position.overlayX === 'center' ? 'center' :
      position.overlayX === 'start' ? 'left' : 'right';

    [].slice.call(elements).forEach((element) => {
      element.style.transformOrigin = `${xOrigin} ${yOrigin}`;
    });
  }

  /**
   * Gets the position and size of the overlay's sizing container.
   *
   * This method does no measuring and applies no styles so that we can cheaply compute the
   * bounds for all positions and choose the best fit based on these results.
   */
  private _calculateBoundingBoxRect(origin: Point, position: ConnectedPosition): BoundingBoxRect {
    const viewport = this._viewportRect;
    let height;
    let top;
    let bottom;

    if (position.overlayY === 'top') {
      // Overlay is opening "downward" and thus is bound by the bottom viewport edge.
      top = origin.y;
      height = viewport.bottom - origin.y;
    } else if (position.overlayY === 'bottom') {
      // Overlay is opening "upward" and thus is bound by the top viewport edge. We need to add
      // the viewport margin back in, because the viewport rect is narrowed down to remove the
      // margin, whereas the `origin` position is calculated based on its `ClientRect`.
      bottom = viewport.height - origin.y + this._viewportMargin * 2;
      height = viewport.height - bottom + this._viewportMargin;
    } else {
      // If neither top nor bottom, it means that the overlay
      // is vertically centered on the origin point.
      const smallestDistanceToViewportEdge =
          Math.min(viewport.bottom - origin.y, origin.y - viewport.left);

      height = smallestDistanceToViewportEdge * 2;
      top = origin.y - smallestDistanceToViewportEdge;
    }

    // The overlay is opening 'right-ward' (the content flows to the right).
    const isBoundedByRightViewportEdge = position.overlayX === 'start';

    // The overlay is opening 'left-ward' (the content flows to the left).
    const isBoundedByLeftViewportEdge = position.overlayX === 'end';

    let width;
    let left;
    let right;

    if (isBoundedByLeftViewportEdge) {
      right = viewport.right - origin.x + this._viewportMargin;
      width = origin.x - viewport.left;
    } else if (isBoundedByRightViewportEdge) {
      left = origin.x;
      width = viewport.right - origin.x;
    } else {
      // If neither start nor end, it means that the overlay
      // is horizontally centered on the origin point.
      const smallestDistanceToViewportEdge =
          Math.min(viewport.right - origin.x, origin.x - viewport.top);
      width = smallestDistanceToViewportEdge * 2;
      left = origin.x - smallestDistanceToViewportEdge;
    }

    return {top, left, bottom, right, width, height};
  }

  // /** Resets the styles for the bounding box so that a new positioning can be computed. */
  // private _resetBoundingBoxStyles() {
  //   extendStyles(this._boundingBox!.style, {
  //     top: '0',
  //     left: '0',
  //     right: '0',
  //     bottom: '0',
  //     height: '',
  //     width: '',
  //     alignItems: '',
  //     justifyContent: '',
  //   } as CSSStyleDeclaration);
  // }

  // /** Resets the styles for the overlay pane so that a new positioning can be computed. */
  // private _resetOverlayElementStyles() {
  //   extendStyles(this._pane.style, {
  //     top: '',
  //     left: '',
  //     bottom: '',
  //     right: '',
  //     position: '',
  //   } as CSSStyleDeclaration);
  // }

  // /** Sets positioning styles to the overlay element. */
  // private _setOverlayElementStyles(originPoint: Point, position: ConnectedPosition): void {
  //   const styles = {} as CSSStyleDeclaration;

  //   if (this._hasExactPosition()) {
  //     extendStyles(styles, this._getExactOverlayY(position, originPoint));
  //     extendStyles(styles, this._getExactOverlayX(position, originPoint));
  //   } else {
  //     styles.position = 'static';
  //   }

  //   // Use a transform to apply the offsets. We do this because the `center` positions rely on
  //   // being in the normal flex flow and setting a `top` / `left` at all will completely throw
  //   // off the position. We also can't use margins, because they won't have an effect in some
  //   // cases where the element doesn't have anything to "push off of". Finally, this works
  //   // better both with flexible and non-flexible positioning.
  //   let transformString = '';
  //   let offsetX = this._getOffset(position, 'x');
  //   let offsetY = this._getOffset(position, 'y');

  //   if (offsetX) {
  //     transformString += `translateX(${offsetX}px) `;
  //   }

  //   if (offsetY) {
  //     transformString += `translateY(${offsetY}px)`;
  //   }

  //   styles.transform = transformString.trim();

  //   extendStyles(this._pane.style, styles);
  // }

  /** Narrows the given viewport rect by the current _viewportMargin. */
  private _getNarrowedViewportRect(): ClientRect {
    // We recalculate the viewport rect here ourselves, rather than using the ViewportRuler,
    // because we want to use the `clientWidth` and `clientHeight` as the base. The difference
    // being that the client properties don't include the scrollbar, as opposed to `innerWidth`
    // and `innerHeight` that do. This is necessary, because the overlay container uses
    // 100% `width` and `height` which don't include the scrollbar either.
    const width = this._document.documentElement.clientWidth;
    const height = this._document.documentElement.clientHeight;
    const scrollPosition = this._viewportRuler.getViewportScrollPosition();

    return {
      top:    scrollPosition.top + this._viewportMargin,
      left:   scrollPosition.left + this._viewportMargin,
      right:  scrollPosition.left + width - this._viewportMargin,
      bottom: scrollPosition.top + height - this._viewportMargin,
      width:  width  - (this._viewportMargin * 2),
      height: height - (this._viewportMargin * 2),
    };
  }

  // /** Retrieves the offset of a position along the x or y axis. */
  // private _getOffset(position: ConnectedPosition, axis: 'x' | 'y') {
  //   if (axis === 'x') {
  //     // We don't do something like `position['offset' + axis]` in
  //     // order to avoid breking minifiers that rename properties.
  //     return position.offsetX == null ? this._offsetX : position.offsetX;
  //   }

  //   return position.offsetY == null ? this._offsetY : position.offsetY;
  // }

}

export interface OverlayPositions {
  overlayX: 'start' | 'center' | 'end';
  overlayY: 'top' | 'center' | 'bottom';

  weight?: number;
  offsetX?: number;
  offsetY?: number;
}

/** A simple (x, y) coordinate. */
interface Point {
  x: number;
  y: number;
}

/** Position and size of the overlay sizing wrapper for a specific position. */
interface BoundingBoxRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
}
