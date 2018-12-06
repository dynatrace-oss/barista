import { CdkTrapFocus, FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, ConnectedPosition, OverlayRef } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  addCssClass,
  isDefined,
  readKeyCode,
  removeCssClass,
} from '@dynatrace/angular-components/core';
import { Subject } from 'rxjs';
import { getOffsetForKeyCode, DtSelectionAreaEventTarget, calculatePosition } from './positioning-utils';

/** Change event object emitted by DtSelectionArea */
export interface DtSelectionAreaChange {
  source: DtSelectionArea;
  /** The position for the left edge - either in px or the xAxis unit of the chart when used with the dt-chart */
  left: number;
  /** The position for the right edge - either in px or the xAxis unit of the chart when used with the dt-chart */
  right: number;
  /** The width of the selection area in px */
  widthPx: number;
}

/** Vertical distance between the overlay and the selection area */
const DT_SELECTION_AREA_OVERLAY_SPACING = 10;

/** The size factor to the origin width the selection area is created with when created by keyboard */
const DT_SELECTION_AREA_KEYBOARD_DEFAULT_SIZE = 0.5;

/** The position the selection area is created at when created by keyboard */
const DT_SELECTION_AREA_KEYBOARD_DEFAULT_START = 0.25;

/** Positions for the overlay used in the selection area */
const DT_SELECTION_AREA_OVERLAY_POSITIONS: ConnectedPosition[] = [
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

  /** The aria label used for the selected area of the selection area */
  @Input('aria-label-selected-area') ariaLabelSelectedArea: string;

  /** The aria label used for the left handle of the selection area */
  @Input('aria-label-left-handle') ariaLabelLeftHandle: string;

  /** The aria label used for the right handle of the selection area */
  @Input('aria-label-right-handle') ariaLabelRightHandle: string;

  /** The aria label used in the close button of the overlay */
  @Input('aria-label-close-button') ariaLabelClose: string;

  /** Emits when the selected area changes position or size */
  @Output()
  readonly changed: EventEmitter<DtSelectionAreaChange> = new EventEmitter();

  /** Emits when the selected area is closed */
  @Output()
  readonly closed: EventEmitter<void> = new EventEmitter();

  /** @internal Indicates if the selected area is visible */
  _isSelectedAreaVisible = false;

  /** @internal Positions for the overlay that gets created */
  _positions: ConnectedPosition[] = DT_SELECTION_AREA_OVERLAY_POSITIONS;

  /** @internal Emits every time the grabbing status changes */
  _grabbingChange = new Subject<boolean>();

  /** Indicator if its being touched */
  private _touching = false;
  /** The width of the selected area */
  private _width = 0;
  /** The distance from the left edge of the selected area to the edge of the origin element */
  private _left = 0;

  private _lastRelativeXPosition = 0;
  /** The boundaries of the origin element - are used to position the selection area correctly and for movement constriants */
  private _boundaries: ClientRect;
  /** The target of the mousedown event - is needed to differentiate what part of the selected area is targeted */
  private _eventTarget: DtSelectionAreaEventTarget;
  /** Array of unregister functions on the window */
  private _detachFns: Array<() => void> = [];

  /** The ref to the DtOverlay */
  private _overlayRef: OverlayRef;

  /** The focus trap inside the overlay */
  private _overlayFocusTrap: FocusTrap;

  /** @internal Default interpolation function that just returns the px value */
  _interpolateFn: (pxValue: number) => number = (pxValue) => pxValue;

  get _ariaValueMaxRightHandle(): string {
    return '';
    // return this._boundaries ? this._interpolateFn(this._boundaries.width).toString() : '';
  }
  get _ariaValueMinRightHandle(): string {
    return '';
    // return this._interpolateFn(this._left).toString();
  }
  get _ariaValueNowRightHandle(): string {
    return '';
    // return this._interpolateFn(this._right).toString();
  }

  /** @internal The focus trap for the selectedArea */
  @ViewChild(CdkTrapFocus) _selectedAreaFocusTrap: CdkTrapFocus;

  /** @internal The selected area that gets created by the users action */
  @ViewChild('selectedArea') _selectedArea: ElementRef<HTMLDivElement>;
  /** @internal The overlay adjacent to the selectedArea */
  @ViewChild(CdkConnectedOverlay) _overlay: CdkConnectedOverlay;
  /** @internal The left handle of the selectedArea */
  @ViewChild('lefthandle') _leftHandle: ElementRef;
  /** @internal The right handle of the selectedArea */
  @ViewChild('righthandle') _rightHandle: ElementRef;

  constructor(
    private _ref: ElementRef,
    private _renderer: Renderer2,
    private _zone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusTrapFactory: FocusTrapFactory
  ) { }

  ngOnDestroy(): void {
    this._detachWindowListeners();
    if (this._overlayFocusTrap) {
      this._overlayFocusTrap.destroy();
    }
    this.close();
    this.closed.complete();
  }

  /** Closes and destroys the selected area */
  close(): void {
    this._reset();
    this._changeDetectorRef.markForCheck();
    this.closed.next();
  }

  /** Sets the focus to the selection area */
  focus(): void {
    if (this._isSelectedAreaVisible) {
      this._selectedArea.nativeElement.focus();
    }
  }

  /** @internal Callback that is invoked when the overlay panel has been attached. */
  _onOverlayAttached(): void {
    // create the focus trap within the overlay
    if (!this._overlayFocusTrap) {
      this._overlayFocusTrap = this._focusTrapFactory.create(this._overlay.overlayRef.overlayElement);
      this._attachFocusTrapListeners();
    }
  }

  /** @internal Callback that is invoked when the overlay panel has been detached - is called when ESCAPE is pressed */
  _onOverlayDetach(): void {
    this._reset();
    this._changeDetectorRef.markForCheck();
  }

  /** Attacheds the eventlisteners for the focus traps connected to each other */
  private _attachFocusTrapListeners(): void {
    this._zone.runOutsideAngular(() => {
      const overlayAnchors = [].slice.call(this._overlay.overlayRef.hostElement.querySelectorAll('.cdk-focus-trap-anchor'));
      overlayAnchors[0].addEventListener('focus', (event: FocusEvent) => {
        event.preventDefault();
        this._selectedAreaFocusTrap.focusTrap.focusLastTabbableElement();
      });
      overlayAnchors[1].addEventListener('focus', (event: FocusEvent) => {
        event.preventDefault();
        this._selectedAreaFocusTrap.focusTrap.focusFirstTabbableElement();
      });
      const selectedAreaAnchors = [].slice.call(this._ref.nativeElement.querySelectorAll('.cdk-focus-trap-anchor'));
      selectedAreaAnchors[0].addEventListener('focus', (event: FocusEvent) => {
        event.preventDefault();
        this._overlayFocusTrap.focusLastTabbableElement();
      });
      selectedAreaAnchors[1].addEventListener('focus', (event: FocusEvent) => {
        event.preventDefault();
        this._overlayFocusTrap.focusFirstTabbableElement();
      });
    });
  }

  /** @internal Creates the selection area */
  _create(posX: number): void {
    this._reset();
    if (this._boundaries) {
      this._isSelectedAreaVisible = true;
      this._eventTarget = DtSelectionAreaEventTarget.Origin;

      if (posX) {
        this._width = 0;
        this._left = this._calculateRelativeXPos(posX);
        this._startUpdating(posX);
      } else {
        // Create area at defaut position if no position has been provided
        // no need to use request animation frame here since this is done for keyboard events
        this._left = this._boundaries.width * DT_SELECTION_AREA_KEYBOARD_DEFAULT_START;
        this._width = this._boundaries.width * DT_SELECTION_AREA_KEYBOARD_DEFAULT_SIZE;
        this._reflectValuesToDom();
      }
    }
    this._changeDetectorRef.markForCheck();
  }

  /** Update function that applies calculated width and position to the selected area dom element */
  private _update(): void {
    requestAnimationFrame(() => {
      if (!this._touching) {
        return;
      }
      this._reflectValuesToDom();
      this._update();
    });
  }

  /** Reflects values to the dom */
  private _reflectValuesToDom(): void {
    this._applySizeAndPosition();
    this._applyAriaValues();
  }

  /** Attaches the eventlisteners to the window */
  private _attachWindowEventListeners(): void {
    this._detachWindowListeners();
    // tslint:disable-next-line:strict-type-predicates
    if (isDefined(window)) {
      this._detachFns.push(this._renderer.listen(window, 'mousemove', (ev) => { this._handleMouseMove(ev); }));
      this._detachFns.push(this._renderer.listen(window, 'mouseup', (ev) => { this._handleMouseup(ev); }));
    }
  }

  /** Detaches the window listeners */
  private _detachWindowListeners(): void {
    this._detachFns.forEach((fn) => { fn(); });
    this._detachFns = [];
  }

  /** @internal Handle mousedown on the left handle */
  _handleLeftHandleMouseDown(event: MouseEvent): void {
    this._eventTarget = DtSelectionAreaEventTarget.LeftHandle;
    event.preventDefault();
    event.stopPropagation();
    this._startUpdating(event.clientX);
  }

  /** @internal Handle mousedown on the right handle */
  _handleRightHandleMouseDown(event: MouseEvent): void {
    this._eventTarget = DtSelectionAreaEventTarget.RightHandle;
    event.preventDefault();
    event.stopPropagation();
    this._startUpdating(event.clientX);
  }

  /** @internal Handle mousedown on the area */
  _handleSelectedAreaMouseDown(event: MouseEvent): void {
    this._eventTarget = DtSelectionAreaEventTarget.SelectedArea;
    event.preventDefault();
    event.stopPropagation();
    this._startUpdating(event.clientX);
  }

  /** Handles position and width calculation on mousedown */
  private _handleMouseMove(event: MouseEvent): void {
    event.preventDefault();
    const lastMoustPosition = this._lastRelativeXPosition;
    const relativeX = this._calculateRelativeXPos(event.clientX);

    // Do not store relative positions outside the boundries
    this._lastRelativeXPosition = Math.min(Math.max(relativeX, 0), this._boundaries.width);

    // Check if mouseposition is outside the boundries. If so, we can ignore the rest.
    if ((event.clientX < this._boundaries.left && !this._left) ||
      (event.clientX > this._boundaries.right && this._left + this._width > this._boundaries.width)) {
      return;
    }
    const deltaX = relativeX - lastMoustPosition;
    if (deltaX) {
      this._calculateNewPosition(deltaX);
    }
  }

  /** Handles mouseup. Stop view updates and cleanup listeners. */
  private _handleMouseup(event: MouseEvent): void {
    event.preventDefault();
    this._grabbingChange.next(false);
    this._touching = false;
    this._togglePointerEvents(false);
    this._detachWindowListeners();
    this._selectedAreaFocusTrap.focusTrap.focusFirstTabbableElement();
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Handle keyboard interaction on keydown on the left handle */
  _handleKeyDown(event: KeyboardEvent, target: string): void {
    const keyCode = readKeyCode(event);
    this._eventTarget = DtSelectionAreaEventTarget[target];
    const offset = getOffsetForKeyCode(keyCode, this._boundaries.width);
    if (offset) {
      event.preventDefault();
      event.stopPropagation();
      this._calculateNewPosition(offset);
      this._applySizeAndPosition();
      if (this._eventTarget === DtSelectionAreaEventTarget.LeftHandle && this._width < offset) {
        this._rightHandle.nativeElement.focus();
      } else if (this._eventTarget === DtSelectionAreaEventTarget.RightHandle && offset < 1 && this._width < Math.abs(offset)) {
        this._leftHandle.nativeElement.focus();
      }
    }
  }

  /** Shared event handling for mousedown events on the selected area */
  private _startUpdating(posX: number): void {
    this._touching = true;
    // activate
    this._togglePointerEvents(true);
    this._attachWindowEventListeners();
    this._grabbingChange.next(true);
    const relativeX = this._calculateRelativeXPos(posX);
    this._lastRelativeXPosition = relativeX;
    this._update();
  }

  /** Applies the properties to the selected area dom element */
  private _applySizeAndPosition(): void {
    this._selectedArea.nativeElement.style.width = `${this._width}px`;
    this._selectedArea.nativeElement.style.left = `${this._left}px`;

    if (this._overlay && this._overlay.overlayRef) {
      this._overlay.overlayRef.updatePosition();
    }
  }

  private _applyAriaValues(): void {
    const right = this._left + this._width;
    this._leftHandle.nativeElement.setAttribute('aria-valuemin', this._interpolateFn(0));
    this._leftHandle.nativeElement.setAttribute('aria-valuenow', this._interpolateFn(this._left));
    this._leftHandle.nativeElement.setAttribute('aria-valuemax', this._interpolateFn(right));

    this._rightHandle.nativeElement.setAttribute('aria-valuemin', this._interpolateFn(this._left));
    this._rightHandle.nativeElement.setAttribute('aria-valuenow', this._interpolateFn(right));
    this._rightHandle.nativeElement.setAttribute('aria-valuemax', this._interpolateFn(this._boundaries.width));
  }

  private _calculateNewPosition(deltaX: number): void {
    const { left, width, nextTarget } =
      calculatePosition(this._eventTarget, deltaX, this._left, this._width, this._boundaries.width);
    this._left = left;
    this._width = width;
    this._eventTarget = nextTarget;
    this._emitChange();
  }

  private _emitChange(): void {
    this.changed.emit({
      left: this._interpolateFn(this._left),
      right: this._interpolateFn(this._left + this._width),
      widthPx: this._width,
      source: this,
    });
  }

  /** Sets and removes the pointer events on the selected area */
  private _togglePointerEvents(touching: boolean): void {
    if (touching) {
      addCssClass(this._selectedArea.nativeElement, 'dt-no-pointer');
    } else {
      removeCssClass(this._selectedArea.nativeElement, 'dt-no-pointer');
    }
  }

  /** @internal Apply boundaries to the host element ref to match the origin */
  _applyBoundaries(boundaries: ClientRect): void {
    // TODO: FFR improvement - recalculate here on newly given boundaries so we dont have to destroy the selection area every time
    this._reset();

    // tslint:disable-next-line:strict-type-predicates
    const scrollY = isDefined(window) ? window.scrollY : 0;
    this._ref.nativeElement.style.left = `${boundaries.left}px`;
    this._ref.nativeElement.style.top = `${boundaries.top + scrollY}px`;
    this._ref.nativeElement.style.width = `${boundaries.width}px`;
    this._ref.nativeElement.style.height = `${boundaries.height}px`;
    this._boundaries = boundaries;
  }

  /** Calculates the horizontal position relative to the boundaries */
  private _calculateRelativeXPos(posX: number): number {
    return posX - this._boundaries.left;
  }
  /** Resets the selected area and all properties */
  private _reset(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
    }
    this._hideAndResetSelectedArea();
  }

  private _hideAndResetSelectedArea(): void {
    if (this._isSelectedAreaVisible) {
      this._selectedArea.nativeElement.style.width = '0px';
      removeCssClass(this._selectedArea.nativeElement, 'dt-no-pointer');
      this._width = 0;
      this._left = 0;
      this._isSelectedAreaVisible = false;
    }
  }
}
