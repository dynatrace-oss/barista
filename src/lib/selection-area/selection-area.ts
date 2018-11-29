import { Component, EventEmitter, Output, ElementRef, Input, Renderer2, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, NgZone, Directive, TemplateRef, ViewEncapsulation } from '@angular/core';
import { addCssClass, clamp, removeCssClass, DtViewportResizer, DT_NO_POINTER_CSS_CLASS, readKeyCode } from '@dynatrace/angular-components/core';
import { take } from 'rxjs/operators';
import { EMPTY, Subscription } from 'rxjs';
import { DtOverlayRef } from '@dynatrace/angular-components/overlay';
import { ConnectedPosition, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { LEFT_ARROW, RIGHT_ARROW, ENTER } from '@angular/cdk/keycodes';

/** Change event object emitted by DtSelectionArea */
export interface DtSelectionAreaChange {
  source: DtSelectionArea;
  left: number;
  width: number;
  right: number;
}

/** @internal Vertical distance between the overlay and the selection area */
const DT_SELECTION_AREA_OVERLAY_SPACING = 10;

/** @internal The size factor to the origin width the selection area is created with when created by keyboard */
const DT_SELECTION_AREA_KEYBOARD_DEFAULT_SIZE = 0.5;

/** @internal The position the selection area is created at when created by keyboard */
const DT_SELECTION_AREA_KEYBOARD_DEFAULT_START = 0.25;

/** @internal Eventtarget for the mouse events on the selection area */
type DtSelectionAreaEventTarget = 'box' | 'left-handle' | 'right-handle' | 'origin';

/** Action area in the overlay, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-selection-area-actions, [dt-selection-area-actions], [dtSelectionAreaActions]`,
  host: {
    class: 'dt-selection-area-actions',
  },
  exportAs: 'dtSelectionAreaActions',
})
export class DtSelectionAreaActions { }

@Component({
  selector: 'dt-selection-area',
  exportAs: 'dtSelectionArea',
  templateUrl: 'selection-area.html',
  styleUrls: ['selection-area.scss'],
  host: {
    class: 'dt-selection-area, dt-no-pointer',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})

export class DtSelectionArea {

  /** @internal The box that gets created by the users action */
  @ViewChild('box') _box: ElementRef;
  /** @internal The overlay adjascent to the box */
  @ViewChild(CdkConnectedOverlay) _overlay: CdkConnectedOverlay;

  /** @internal Indicates if the box is visible */
  _isBoxVisible = false;

  /** Positions for the overlay that gets created */
  _positions: ConnectedPosition[] = [
    {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -DT_SELECTION_AREA_OVERLAY_SPACING,
    },
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: DT_SELECTION_AREA_OVERLAY_SPACING,
    },
  ];

  /** Indicator if its being touched */
  private _touching: boolean;
  /** Horizontal start position of an operation */
  private _startX: number;
  /** Start width when performing an operation */
  private _startWidth: number;
  /** The origin html element that the selection area gets attached to */
  private _origin: HTMLElement;
  /** The width of the box */
  private _width = 0;
  /** The horizontal offset is needed when grabbing the entire box to calculate the new position correctly */
  private _offsetX = 0;
  /** The distance from the left edge of the box to the edge of the origin element */
  private _left: number | null;
  /** The distance from the right edge of the box to the edge of the origin element */
  private _right: number | null;
  /** The boundaries of the origin element - are used to position the selection area correctly and for movement constriants */
  private _boundaries: ClientRect;
  /** The target of the mousedown event - is needed to differentiate what part of the box is targeted */
  private _eventTarget: DtSelectionAreaEventTarget;
  /** Array to unregister the eventlisteners on the origin */
  private _detachOriginListenerFns: Array<() => void> = [];
  /** Array of unregister functions on the window */
  private _detachFns: Array<() => void> = [];
  /** Subscription to the viewport changes */
  private _viewportSub: Subscription = EMPTY.subscribe();

  /** The ref to the DtOverlay */
  private _overlayRef: DtOverlayRef<void>;

  /** The origin the selection area is created within */
  @Input()
  get origin(): ElementRef | HTMLElement {
    return this._origin;
  }
  set origin(val: ElementRef | HTMLElement) {
    this._detachEventListeners();
    this._detachWindowListeners();
    this._origin = val instanceof ElementRef ? val.nativeElement : val;
    /** make it tabable */
    if (!this._origin.getAttribute('tabindex')) {
      this._renderer.setAttribute(this._origin, 'tabindex', '0');
      addCssClass(this._origin, 'dt-selection-area-origin');
    }
    // apply eventlisteners
    this._attachEventListeners();
    this._applyBoundaries(this._origin);
  }

  /** Emits when the box changes position or size */
  @Output()
  readonly changed: EventEmitter<DtSelectionAreaChange> = new EventEmitter();

  /** Emits when the box is closed */
  @Output()
  readonly closed: EventEmitter<void> = new EventEmitter();

  constructor(
    private _ref: ElementRef,
    private _renderer: Renderer2,
    private _zone: NgZone,
    private _viewport: DtViewportResizer,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this._viewportSub = this._viewport.change().subscribe(() => {
      this._reset();
    });
  }

  ngOnDestroy(): void {
    this._detachEventListeners();
    this._detachWindowListeners();
    this._viewportSub.unsubscribe();
  }

  /** Closes and destroys the box */
  close(): void {
    this._reset();
  }

  /** Attach eventlisteners to the origin */
  private _attachEventListeners(): void {
    this._detachEventListeners();
    this._detachOriginListenerFns.push(this._renderer.listen(this._origin, 'mousedown', this._handleMousedown));
    this._detachOriginListenerFns.push(this._renderer.listen(this._origin, 'keyup', this._handleKeyup));
  }

  /** Attaches the eventlisteners to the window */
  private _attachWindowEventListeners(): void {
    this._detachWindowListeners();
    // tslint:disable-next-line:strict-type-predicates
    if (typeof window !== 'undefined') {
      this._zone.runOutsideAngular(() => {
        this._detachFns.push(this._renderer.listen(window, 'mousemove', this._handleMousemove));
        this._detachFns.push(this._renderer.listen(window, 'mouseup', this._handleMouseup));
      });
    }
  }

  /** Detaches the window listeners */
  private _detachWindowListeners(): void {
    this._detachFns.forEach((fn) => fn());
    this._detachFns = [];
  }

  /** Detaches the eventlisteners on the origin */
  private _detachEventListeners(): void {
    this._detachOriginListenerFns.forEach((fn) => fn());
    this._detachOriginListenerFns = [];
  }

  /** Creates the selection area */
  private _create(): void {
    this._reset();
    this._isBoxVisible = true;
    this._touching = true;
    this._applyPointerEvents(true);
    this._attachWindowEventListeners();
    this._eventTarget = 'origin';
    this._changeDetectorRef.markForCheck();
  }

  /** Handle mousedown on the origin */
  private _handleMousedown = (ev: MouseEvent) => {
    this._create();
    this._startX = this._calculateRelativeXPos(ev);
    this._left = this._startX;
    console.log('creating...', this._left);
    // Call update to trigger reflecting the changes to the element
    this._update();
  }

  private _handleKeyup = (event: KeyboardEvent) => {
    if (readKeyCode(event) === ENTER) {
      this._left = this._boundaries.width * DT_SELECTION_AREA_KEYBOARD_DEFAULT_START;
      this._create();
      this._width = this._boundaries.width * DT_SELECTION_AREA_KEYBOARD_DEFAULT_SIZE;
      this._right = null;
      Promise.resolve().then(() => { this._applySizeAndPosition(); });
    }
  }

  /** Handles position and width calculation on mousedown */
  private _handleMousemove = (ev: MouseEvent) => {
    ev.preventDefault();
    const deltaX = this._calculateRelativeXPos(ev) - this._startX;
    console.log('delta');
    let left: number | null;
    let right: number | null;
    let width = this._width;
    switch (this._eventTarget) {
      case 'box':
        console.log('box');
        const newleft = this._startX + deltaX - this._offsetX;
        left = clamp(newleft, 0, this._boundaries.width - width);
        right = null;
        break;
      case 'left-handle':
        if (this._startWidth - deltaX < 0) {
          width = deltaX - this._startWidth;
          right = null;
          left = this._startX + this._startWidth;
        } else {
          /** cursor is moved over the area until it hits the right handle */
          width = this._startWidth - deltaX;
          left = null;
          right = this._boundaries.width - this._startX - this._startWidth;
        }
        break;
      case 'right-handle':
        if (this._startWidth + deltaX < 0) {
          width = Math.abs(this._startWidth + deltaX);
          left = null;
          right = this._boundaries.width - this._startX + this._startWidth;
        } else {
          /** cursor is moved to the right */
          left = this._startX - this._startWidth;
          right = null;
          width = this._startWidth + deltaX;
        }
        break;
      case 'origin':
      default:
        width = Math.abs(deltaX);
        if (deltaX >= 0) {
          left = this._startX;
          right = null;
        } else {
          left = null;
          right = this._boundaries.width - this._startX;
        }
    }
    /** clamp */
    if (left !== null) {
      width = clamp(width, 0, this._boundaries.width - left);
    }
    if (right !== null) {
      width = clamp(width, 0, this._boundaries.width - right);
    }
    this._width = width;
    this._left = left;
    this._right = right;
  }

  /** Handles mouseup */
  private _handleMouseup = (ev: MouseEvent) => {
    ev.preventDefault();
    removeCssClass(this._origin, 'dt-cursor-grabbing');
    this._touching = false;
    this._applyPointerEvents(false);
    this._detachWindowListeners();
  }

  /** Handle mousedown on the left handle */
  _handleLeftHandleMouseDown(event: MouseEvent): void {
    this._handleBoxEvent(event, 'left-handle');
    this._startWidth = this._width;
  }

  /** Handle mousedown on the right handle */
  _handleRightHandleMouseDown(event: MouseEvent): void {
    this._handleBoxEvent(event, 'right-handle');
    this._startWidth = this._width;
  }

  /** Handle mousedown on the area */
  _handleBoxMouseDown(event: MouseEvent): void {
    console.log('box mousedown');
    this._handleBoxEvent(event, 'box');
    this._offsetX = this._calculateRelativeXPosToBox(event);
    addCssClass(this._origin, 'dt-cursor-grabbing');
  }

  _handleLeftHandleKeyup(event: KeyboardEvent): void {
    switch (readKeyCode(event)) {
      case LEFT_ARROW:
        break;
      case RIGHT_ARROW:
      default:
    }
    this._handleBoxEvent(event, 'left-handle');
  }

  _handleRightHandleKeyup(event: KeyboardEvent): void {
    this._handleBoxEvent(event, 'right-handle');
  }

  _handleBoxKeyup(event: KeyboardEvent): void {
    this._handleBoxEvent(event, 'box');
  }

  /** Handles the closing action on the selection area */
  _handleClose(event: MouseEvent): void {
    event.preventDefault();
    this._reset();
    this.closed.next();
    this.closed.complete();
  }

  /** Shared event handling for mousedown events on the box */
  private _handleBoxEvent(event: MouseEvent | KeyboardEvent, target: DtSelectionAreaEventTarget): void {
    event.preventDefault();
    event.stopPropagation();
    this._touching = true;
    this._applyPointerEvents(true);
    this._eventTarget = target;
    this._attachWindowEventListeners();
    if (event instanceof MouseEvent) {
      this._startX = this._calculateRelativeXPos(event);
    }
    this._update();
  }

  /** Update function that applies calculated width and position to the box dom element */
  private _update(): void {
    requestAnimationFrame(() => {
      console.log('requestAnimationFrame triggered');
      if (!this._touching) {
        return;
      }
      this._applySizeAndPosition();
      this._update();
    });
  }

  /** Applies the properties to the box dom element */
  private _applySizeAndPosition(): void {
    this._box.nativeElement.style.width = `${this._width}px`;

    if (this._left !== null) {
      this._box.nativeElement.style.left = `${this._left}px`;
      this._box.nativeElement.style.right = '';
    } else {
      this._box.nativeElement.style.left = '';
      this._box.nativeElement.style.right = `${this._right}px`;
    }
    if (this._overlay && this._overlayRef) {
      this._overlay.overlayRef.updatePosition();
    }

    const left = this._left !== null ? this._left : this._boundaries.width - this._right! - this._width;
    const right = this._right !== null ? this._right : this._boundaries.width - this._left! - this._width;
    this.changed.emit({
      left,
      right,
      width: this._width,
      source: this,
    });
  }

  /** Sets and removes the pointer events on the box */
  private _applyPointerEvents(touching: boolean): void {
    if (touching) {
      addCssClass(this._box.nativeElement, DT_NO_POINTER_CSS_CLASS);
    } else {
      removeCssClass(this._box.nativeElement, DT_NO_POINTER_CSS_CLASS);
    }
  }

  /** Apply boundaries to the host element ref to match the origin */
  private _applyBoundaries(origin: HTMLElement | null): void {
    /**
     * This needs to be run after zone is stable because we need to wait until the origin is actually rendered
     * to get the correct boundaries
     */
    if (origin) {
      this._zone.onStable.pipe(take(1)).subscribe(() => {
        this._boundaries = origin.getBoundingClientRect();
        // tslint:disable-next-line:strict-type-predicates
        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
        this._ref.nativeElement.style.left = `${this._boundaries.left}px`;
        this._ref.nativeElement.style.top = `${this._boundaries.top + scrollY}px`;
        this._ref.nativeElement.style.width = `${this._boundaries.width}px`;
        this._ref.nativeElement.style.height = `${this._boundaries.height}px`;
      });
    }
  }

  /** Calculates the horizontal position relative to the boundaries */
  private _calculateRelativeXPos(ev: MouseEvent): number {
    return ev.clientX - this._boundaries.left;
  }

  /** Calculates the relative horizontal position to the box  */
  private _calculateRelativeXPosToBox(ev: MouseEvent): number {
    const targetBoundingClientRect = this._box.nativeElement.getBoundingClientRect();
    return ev.clientX - targetBoundingClientRect.left;
  }

  /** Resets the box and all properties */
  private _reset(): void {
    if (this._overlayRef) {
      this._overlayRef.dismiss();
    }
    this._box.nativeElement.style.width = '0px';
    removeCssClass(this._box.nativeElement, DT_NO_POINTER_CSS_CLASS);
    this._width = 0;
    this._left = null;
    this._isBoxVisible = false;
    this._applyBoundaries(this._origin);
    this._changeDetectorRef.markForCheck();
  }

}

export function isElementScrolledOutsideView(element: ClientRect, scrollContainers: ClientRect[]): boolean {
  return scrollContainers.some((containerBounds) => {
    const outsideAbove = element.bottom < containerBounds.top;
    const outsideBelow = element.top > containerBounds.bottom;
    const outsideLeft = element.right < containerBounds.left;
    const outsideRight = element.left > containerBounds.right;

    return outsideAbove || outsideBelow || outsideLeft || outsideRight;
  });
}
