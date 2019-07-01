import { CdkTrapFocus, FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import {
  addCssClass,
  isDefined,
  readKeyCode,
  removeCssClass,
  HasTabIndex,
  mixinDisabled,
  mixinTabIndex,
} from '@dynatrace/angular-components/core';
import { Subject } from 'rxjs';
import {
  getOffsetForKeyCode,
  DtSelectionAreaEventTarget,
  calculatePosition,
} from './positioning-utils';
import { ENTER } from '@angular/cdk/keycodes';
import { take } from 'rxjs/operators';
import { Portal } from '@angular/cdk/portal';

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 * Change event object emitted by DtSelectionArea
 */
export interface DtSelectionAreaContainerChange {
  /** The position for the left edge - either in px or the xAxis unit of the chart when used with the dt-chart */
  left: number;
  /** The position for the right edge - either in px or the xAxis unit of the chart when used with the dt-chart */
  right: number;
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
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: -DT_SELECTION_AREA_OVERLAY_SPACING,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
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
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: DT_SELECTION_AREA_OVERLAY_SPACING,
  },
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: DT_SELECTION_AREA_OVERLAY_SPACING,
  },
];

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 */
export class DtSelectionAreaContainerBase {}

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 */
export const _DtSelectionAreaContainerMixin = mixinTabIndex(
  // tslint:disable-next-line: deprecation
  mixinDisabled(DtSelectionAreaContainerBase)
);

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 */
@Component({
  selector: 'dt-selection-area-container',
  exportAs: 'dtSelectionAreaContainer',
  templateUrl: 'selection-area-container.html',
  styleUrls: ['selection-area-container.scss'],
  host: {
    class: 'dt-selection-area-container, dt-no-pointer',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
// tslint:disable-next-line: deprecation
export class DtSelectionAreaContainer extends _DtSelectionAreaContainerMixin
  implements HasTabIndex, OnDestroy {
  /** Emits when the selected area changes position or size */
  @Output() readonly changed = new EventEmitter<
    // tslint:disable-next-line: deprecation
    DtSelectionAreaContainerChange
  >();

  /** Emits everytime the selected area and the overlay are closed */
  @Output() readonly closed = new EventEmitter<void>();

  /** @internal Indicates if the selected area is visible */
  _isSelectedAreaVisible = false;

  /** @internal Positions for the overlay that gets created */
  _positions: ConnectedPosition[] = DT_SELECTION_AREA_OVERLAY_POSITIONS;

  /** @internal Emits every time the grabbing status changes */
  _grabbingChange = new Subject<boolean>();

  /** @internal The portal that contains the content for the overlay */
  // tslint:disable-next-line: no-any
  _overlayContentPortal: Portal<any>;

  /** @internal The portal that contains the actions */
  // tslint:disable-next-line: no-any
  _overlayActionsPortal: Portal<any>;

  /** @internal The aria label used for the selected area */
  _ariaLabelSelectedArea: string;
  /** @internal The aria label used for the left handle */
  _ariaLabelLeftHandle: string;
  /** @internal The aria label used for the right handle */
  _ariaLabelRightHandle: string;
  /** @internal The aria label used for the close button */
  _ariaLabelClose: string;

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

  /** The focus trap inside the overlay */
  private _overlayFocusTrap: FocusTrap;

  /** @internal Default interpolation function that just returns the px value */
  _interpolateFn: (pxValue: number) => number = (pxValue) => pxValue;

  /** @internal The focus trap for the selectedArea */
  @ViewChild(CdkTrapFocus, { static: true })
  _selectedAreaFocusTrap: CdkTrapFocus;

  /** @internal The selected area that gets created by the users action */
  @ViewChild('selectedArea', { static: true }) _selectedArea: ElementRef<
    HTMLDivElement
  >;
  /** @internal The overlay adjacent to the selectedArea */
  @ViewChild(CdkConnectedOverlay, { static: true })
  _overlay: CdkConnectedOverlay;
  /** @internal The left handle of the selectedArea */
  @ViewChild('lefthandle', { static: true }) _leftHandle: ElementRef;
  /** @internal The right handle of the selectedArea */
  @ViewChild('righthandle', { static: true }) _rightHandle: ElementRef;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _zone: NgZone,
    public _changeDetectorRef: ChangeDetectorRef,
    private _focusTrapFactory: FocusTrapFactory
  ) {
    super();
  }

  ngOnDestroy(): void {
    this._detachWindowListeners();
    if (this._overlayFocusTrap) {
      this._overlayFocusTrap.destroy();
    }
    if (this._overlay.overlayRef) {
      this._overlay.overlayRef.dispose();
    }
    this.closed.next();
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
      this._overlayFocusTrap = this._focusTrapFactory.create(
        this._overlay.overlayRef.overlayElement
      );
      this._attachFocusTrapListeners();
    }
  }

  /** Attacheds the eventlisteners for the focus traps connected to each other */
  private _attachFocusTrapListeners(): void {
    this._zone.runOutsideAngular(() => {
      const overlayAnchors = [].slice.call(
        this._overlay.overlayRef.hostElement.querySelectorAll(
          '.cdk-focus-trap-anchor'
        )
      );
      overlayAnchors[0].addEventListener('focus', (event: FocusEvent) => {
        event.preventDefault();
        this._selectedAreaFocusTrap.focusTrap.focusLastTabbableElement();
      });
      overlayAnchors[1].addEventListener('focus', (event: FocusEvent) => {
        event.preventDefault();
        this._selectedAreaFocusTrap.focusTrap.focusFirstTabbableElement();
      });
      const selectedAreaAnchors = [].slice.call(
        this._elementRef.nativeElement.querySelectorAll(
          '.cdk-focus-trap-anchor'
        )
      );
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
      this._eventTarget = DtSelectionAreaEventTarget.Origin;

      if (posX) {
        this._width = 0;
        this._left = this._calculateRelativeXPos(posX);
        this._startUpdating(posX);
      } else {
        // Create area at defaut position if no position has been provided
        // no need to use request animation frame here since this is done for keyboard events
        this._left =
          this._boundaries.width * DT_SELECTION_AREA_KEYBOARD_DEFAULT_START;
        this._width =
          this._boundaries.width * DT_SELECTION_AREA_KEYBOARD_DEFAULT_SIZE;
        this._isSelectedAreaVisible = true;
        this._reflectValuesToDom();
        this._emitChange();
        this._changeDetectorRef.markForCheck();
      }
    }
  }

  /** @internal Hides and resets the selected area */
  _reset(): void {
    if (this._isSelectedAreaVisible) {
      this._selectedArea.nativeElement.style.width = '0px';
      removeCssClass(this._selectedArea.nativeElement, 'dt-no-pointer');
      this._width = 0;
      this._left = 0;
      this._isSelectedAreaVisible = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** @internal Apply boundaries to the host element to match the origin */
  _applyBoundaries(boundaries: ClientRect): void {
    // tslint:disable-next-line:strict-type-predicates
    const scrollY = isDefined(window) ? window.scrollY : 0;
    const elementStyle = this._elementRef.nativeElement.style;
    elementStyle.left = `${boundaries.left}px`;
    elementStyle.top = `${boundaries.top + scrollY}px`;
    elementStyle.width = `${boundaries.width}px`;
    elementStyle.height = `${boundaries.height}px`;
    this._boundaries = boundaries;
  }

  /** @internal Updates all aria labels */
  _updateAriaLabels(
    areaLabel: string,
    leftLabel: string,
    rightLabel: string,
    closeBtnLabel: string
  ): void {
    this._ariaLabelSelectedArea = areaLabel;
    this._ariaLabelLeftHandle = leftLabel;
    this._ariaLabelRightHandle = rightLabel;
    this._ariaLabelClose = closeBtnLabel;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Executed on every animation frame when the user is dragging/touching.
   * Will reflect updated width and position values to the selected area in the DOM
   */
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
      this._detachFns.push(
        this._renderer.listen(window, 'mousemove', (ev) => {
          this._handleMouseMove(ev);
        })
      );
      this._detachFns.push(
        this._renderer.listen(window, 'mouseup', (ev) => {
          this._handleMouseup(ev);
        })
      );
    }
  }

  /** Detaches the window listeners */
  private _detachWindowListeners(): void {
    this._detachFns.forEach((fn) => {
      fn();
    });
    this._detachFns = [];
  }

  /** @internal Handle mousedown on the host */
  _handleHostMousedown(ev: MouseEvent): void {
    this._create(ev.clientX);
  }

  /** @internal Handle keydown on the host */
  _handleHostKeyDown(event: KeyboardEvent): void {
    if (readKeyCode(event) === ENTER) {
      this._create(0);

      this._zone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
        this.focus();
      });
    }
  }

  /** @internal Handle mousedown on the selection area and handles */
  _handleMouseDown(event: MouseEvent, target: string): void {
    this._eventTarget = DtSelectionAreaEventTarget[target];
    event.preventDefault();
    event.stopPropagation();
    this._startUpdating(event.clientX);
  }

  /** Handles position and width calculation on mousedown */
  private _handleMouseMove(event: MouseEvent): void {
    event.preventDefault();
    const lastMoustPosition = this._lastRelativeXPosition;
    const relativeX = this._calculateRelativeXPos(event.clientX);
    this._grabbingChange.next(true);

    // We need to trigger CD on first mousemove event since we cannot trigger it right away on mousedown,
    // because we dont know if the mousedown is part of a click or a down-move-up like drag event
    if (!this._isSelectedAreaVisible) {
      this._isSelectedAreaVisible = true;
      this._changeDetectorRef.markForCheck();
      this._grabbingChange.next(true);
    }

    // Do not store relative positions outside the boundries
    this._lastRelativeXPosition = Math.min(
      Math.max(relativeX, 0),
      this._boundaries.width
    );

    // Check if mouseposition is outside the boundries. If so, we can ignore the rest.
    if (
      (event.clientX < this._boundaries.left && !this._left) ||
      (event.clientX > this._boundaries.right &&
        this._left + this._width > this._boundaries.width)
    ) {
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
    // if the width is 0 then the mouse didnt move between mousedown and mouseup
    if (this._width === 0) {
      this._reset();
    }
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Handle keyboard interaction on keydown on the left handle */
  _handleKeyDown(event: KeyboardEvent, target: string): void {
    const keyCode = readKeyCode(event);
    this._eventTarget = DtSelectionAreaEventTarget[target];
    // tslint:disable-next-line: deprecation
    const offset = getOffsetForKeyCode(keyCode, this._boundaries.width);
    if (offset) {
      event.preventDefault();
      event.stopPropagation();
      this._calculateNewPosition(offset);
      this._applySizeAndPosition();
      if (
        this._eventTarget === DtSelectionAreaEventTarget.LeftHandle &&
        this._width < offset
      ) {
        this._rightHandle.nativeElement.focus();
      } else if (
        this._eventTarget === DtSelectionAreaEventTarget.RightHandle &&
        offset < 1 &&
        this._width < Math.abs(offset)
      ) {
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

  /** Applies the aria values to the left and right handle */
  private _applyAriaValues(): void {
    const right = this._left + this._width;
    const leftHandle = this._leftHandle.nativeElement;
    leftHandle.setAttribute('aria-valuemin', this._interpolateFn(0));
    leftHandle.setAttribute('aria-valuenow', this._interpolateFn(this._left));
    leftHandle.setAttribute('aria-valuemax', this._interpolateFn(right));

    const rightHandle = this._rightHandle.nativeElement;
    rightHandle.setAttribute('aria-valuemin', this._interpolateFn(this._left));
    rightHandle.setAttribute('aria-valuenow', this._interpolateFn(right));
    rightHandle.setAttribute(
      'aria-valuemax',
      this._interpolateFn(this._boundaries.width)
    );
  }

  /**
   * Calculates the new position based on the delta, assigns the left and width values and the next event target
   * and calls the emit change event
   */
  private _calculateNewPosition(deltaX: number): void {
    // tslint:disable-next-line: deprecation
    const { left, width, nextTarget } = calculatePosition(
      this._eventTarget,
      deltaX,
      this._left,
      this._width,
      this._boundaries.width
    );
    this._left = left;
    this._width = width;
    this._eventTarget = nextTarget;
    this._emitChange();
  }

  /** Emits the change event  */
  private _emitChange(): void {
    this.changed.emit({
      left: this._interpolateFn(this._left),
      right: this._interpolateFn(this._left + this._width),
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

  /** Calculates the horizontal position relative to the boundaries */
  private _calculateRelativeXPos(posX: number): number {
    return posX - this._boundaries.left;
  }
}
