/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  coerceBooleanProperty,
  coerceNumberProperty,
} from '@angular/cdk/coercion';
import { BACKSPACE, DELETE, TAB } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import {
  _addCssClass,
  _getElementBoundingClientRect,
  isNumber,
  _readKeyCode,
  _removeCssClass,
} from '@dynatrace/barista-components/core';
import { dtFormatDateRange } from '@dynatrace/barista-components/formatters';

import { DtSelectionAreaEventTarget } from '../selection-area/position-utils';
import { clampRange } from './clamp-range';
import {
  ARIA_DEFAULT_CLOSE_LABEL,
  ARIA_DEFAULT_LEFT_HANDLE_LABEL,
  ARIA_DEFAULT_RIGHT_HANDLE_LABEL,
  ARIA_DEFAULT_SELECTED_AREA_LABEL,
  DT_RANGE_DEFAULT_MIN,
  DT_RANGE_INVALID_CLASS,
  DT_RANGE_RELEASED_CLASS,
} from './constants';
import { updateRangeWithKeyboardEvent } from './update-range-with-keyboard-event';

/** @internal Event that gets emitted when the internal state of the range changes */
export class RangeStateChangedEvent {
  constructor(
    public left: number,
    public width: number,
    public hidden: boolean,
  ) {}
}

@Component({
  selector: 'dt-chart-range',
  templateUrl: 'range.html',
  styleUrls: ['range.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dt-chart-range',
  },
})
export class DtChartRange implements AfterViewInit, OnDestroy {
  /** Aria label for the close button in the overlay */
  @Input()
  get ariaLabelClose(): string {
    return this._ariaLabelClose;
  }
  set ariaLabelClose(value: string) {
    this._ariaLabelClose = value;
  }
  /** @internal Aria label value for the close button of the overlay */
  _ariaLabelClose = ARIA_DEFAULT_CLOSE_LABEL;

  /** Aria label for the left handle. */
  @Input()
  get ariaLabelLeftHandle(): string {
    return this._ariaLabelLeftHandle;
  }
  set ariaLabelLeftHandle(value: string) {
    this._ariaLabelLeftHandle = value;
  }
  /** @internal Aria label value for the left handle of the range */
  _ariaLabelLeftHandle = ARIA_DEFAULT_LEFT_HANDLE_LABEL;

  /** Aria label for the right handle. */
  @Input()
  get ariaLabelRightHandle(): string {
    return this._ariaLabelRightHandle;
  }
  set ariaLabelRightHandle(value: string) {
    this._ariaLabelRightHandle = value;
  }
  /** @internal Aria label value for the right handle of the range */
  _ariaLabelRightHandle = ARIA_DEFAULT_RIGHT_HANDLE_LABEL;

  /** Aria label for the left handle. */
  @Input()
  get ariaLabelSelectedArea(): string {
    return this._ariaLabelSelectedArea;
  }
  set ariaLabelSelectedArea(value: string) {
    this._ariaLabelSelectedArea = value;
  }
  /** @internal Aria label value for the selected area in the range */
  _ariaLabelSelectedArea = ARIA_DEFAULT_SELECTED_AREA_LABEL;

  /** The minimum range that can be created, by default the minimum range is 5 minutes  */
  @Input()
  get min(): number {
    return this._min;
  }
  set min(min: number) {
    this._min = coerceNumberProperty(min, DT_RANGE_DEFAULT_MIN);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * The maximum range that can be created in a time format,
   * if none is set it can be drawn till to the edge
   */
  @Input()
  get max(): number | null {
    return this._max;
  }
  set max(max: number | null) {
    this._max = coerceNumberProperty(max, null);
    this._changeDetectorRef.markForCheck();
  }

  /** The time frame on the charts xAxis where the range should be placed */
  @Input()
  get value(): [number, number] {
    return this._value;
  }
  set value(value: [number, number]) {
    if (!isNumber(value[0]) || !isNumber(value[1])) {
      this._handleOverlayClose();
      return;
    }
    this._value = value;
    this._rangeHidden = false;
    // add the triangles to the handles to enable the drag state
    // the value is going to be set programmatically so we never need the initial drag state
    // without the triangles
    this._reflectRangeReleased(true);
    // reflect the values to px values and display them
    this._reflectValueToArea();
    // trigger an internal state changes event
    this._emitStateChanges();
    // check if the range is valid and toggle the appropriate classes
    this._checkRangeValid();
    // sets the aria labels with the renderer to avoid change detection.
    this._reflectValueToDom();
    // trigger change detection in case that it can be set programmatically
    this._changeDetectorRef.markForCheck();
  }

  /** Emits the new values of the selection area when they are changed by user triggered events */
  @Output() readonly valueChanges = new EventEmitter<[number, number]>();

  /** Emits when the selection area is valid *(greater than the minimum constraint)* */
  @Output() readonly valid = new BehaviorSubject(false);

  /** Event that is emitted when the range is closed. */
  @Output() readonly closed = new EventEmitter<void>();

  /**
   * @internal
   * Used by the selection area as content to project into the overlay with a portal.
   */
  @ViewChild(TemplateRef, { static: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _overlayTemplate: TemplateRef<any>;

  /**
   * @internal
   * ElementRef of the selected area, used by the selection area to position
   * the overlay centered to the selected area. Furthermore it is used by the range
   * to subscribe to the changes when it is hidden there is no selected area.
   */
  @ViewChildren('range')
  _rangeElementRef: QueryList<ElementRef<HTMLDivElement>>;

  /** @internal Function to calculate the px position of a provided value on the xAxis */
  get _valueToPixels():
    | ((value: number, paneCoordinates?: boolean) => number)
    | null {
    return this._valueToPixelsFn;
  }
  set _valueToPixels(
    fn: ((value: number, paneCoordinates?: boolean) => number) | null,
  ) {
    this._valueToPixelsFn = fn;
    this._reflectValueToArea();
    this._emitStateChanges();
    this._changeDetectorRef.markForCheck();
  }

  /** @internal The visibility of the range */
  get _hidden(): boolean {
    return this._rangeHidden;
  }
  set _hidden(hidden: boolean) {
    this._rangeHidden = coerceBooleanProperty(hidden);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal
   * The area from the left point with the width. This property get set by the
   * selection area to reflect drag changes to the DOM.
   */
  get _area(): { left: number; width: number } {
    return this._rangeArea;
  }
  set _area(area: { left: number; width: number }) {
    this._rangeArea = clampRange(area, this._maxWidth, 0);
    // set the correct styles on the range element
    this._reflectStyleToDom();
    // set the value according the selected range
    this._setValueFromArea();
    // emit an internal state changes
    this._emitStateChanges();
    // check if the range is valid and toggle the appropriate classes
    this._checkRangeValid();
    // sets the aria labels with the renderer to avoid change detection.
    this._reflectValueToDom();
  }

  /** @internal Subject that emits when the close button of the overlay was triggered */
  readonly _closeOverlay = new Subject<void>();

  /** @internal State changes subject that provides the state with left and width */
  readonly _stateChanges = new Subject<RangeStateChangedEvent>();

  /** @internal Event that emits when a handle receives a mousedown event */
  readonly _handleDragStarted = new Subject<DtSelectionAreaEventTarget>();

  /** @internal Subject that emits when a handle gets deleted and the range switches to a timestamp */
  readonly _switchToTimestamp = new Subject<number>();

  /** @internal The maximum value that can be selected on the xAxis */
  _maxValue: number | null;

  /** @internal The minimal value that can be selected on the xAxis */
  _minValue: number | null;

  /** @internal The maximum value in px that can be selected on the xAxis */
  _maxWidth: number;

  /** @internal The offset of the plotBackground in relation to the chart container on the xAxis  */
  _plotBackgroundChartOffset = 0;

  /** @internal Function that provides a value on the xAxis for a provided px value */
  _pixelsToValue:
    | ((pixel: number, paneCoordinates?: boolean) => number)
    | null = null;

  /** Function to calculate the px position of a provided value on the xAxis */
  private _valueToPixelsFn:
    | ((value: number, paneCoordinates?: boolean) => number)
    | null = null;

  /** The state of the range in px where it should be positioned */
  private _rangeArea: { left: number; width: number } = { left: 0, width: 0 };
  /** The state of the range when it is set programmatically in xAxis values from - to */
  private _value: [number, number] = [0, 0];
  /** The minimum range that can be created */
  private _min = DT_RANGE_DEFAULT_MIN;
  /** The maximum range that can be created, if none is set it can be drawn till to the edge */
  private _max: number | null = null;
  /** The visibility state of the range */
  private _rangeHidden = true;
  /** Subject used for unsubscribing */
  private _destroy$ = new Subject<void>();
  /** If the range is valid (grey background if it is beneath min) */
  private _valid = false;

  constructor(
    public _viewContainerRef: ViewContainerRef,
    private _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngAfterViewInit(): void {
    this._rangeElementRef.changes
      .pipe(startWith(null), takeUntil(this._destroy$))
      .subscribe(() => {
        this._reflectToDom();
      });
  }

  /** Focuses the range element. */
  focus(): void {
    if (this._rangeElementRef && this._rangeElementRef.first) {
      this._rangeElementRef.first.nativeElement.focus();
    }
  }

  /** Closes the range element and the overlay. */
  close(): void {
    this._closeOverlay.next();
    this._reset();
  }

  /** @internal Reflects styles, value and validity to the dom. */
  _reflectToDom(): void {
    this._maxWidth =
      this._maxWidth || _getElementBoundingClientRect(this._elementRef).width;
    this._reflectStyleToDom();
    this._reflectValueToDom();
    this._reflectRangeValid();
  }

  /**
   * @internal
   * Resets the range and hides it.
   * This method is used by the selection area to reset the range.
   */
  _reset(): void {
    this._rangeHidden = true;
    this._rangeArea = { left: 0, width: 0 };
    this._value = [0, 0];
    this._reflectStyleToDom();
    // needed in case that hidden triggers a ng-if
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Gets triggered by the close button of the overlay */
  _handleOverlayClose(): void {
    this._closeOverlay.next();
    this._reset();
    this.closed.emit();
  }

  /**
   * @internal
   * Method that emits an event when a handle is going to be dragged.
   * To prevent a new creation of a new range, the event propagation has to be stopped.
   * Indicates wether the left or right handle was dragged.
   */
  _dragHandle(event: MouseEvent, type: string): void {
    event.stopImmediatePropagation();
    this._handleDragStarted.next(type as DtSelectionAreaEventTarget);
  }

  /**
   * @internal
   * Calculate the min width in px out of a left value.
   * Needs the starting point in case that the min is defined via timestamp values
   * @param left the starting point to calculate the min width
   */
  _calculateMinWidth(left: number): number {
    if (this._pixelsToValue && this._valueToPixelsFn) {
      const start = this._pixelsToValue(left);
      return (
        this._valueToPixelsFn(start + this._min) - this._valueToPixelsFn(start)
      );
    }
    return 0;
  }

  /**
   * @internal
   * This method is used to enable keyboard support to move the both handles
   * @param event Keyboard event that provides information how to move the handle
   * @param handle indicates whether the left or the right handle triggered the event
   */
  _handleKeyDown(event: KeyboardEvent, handle: string): void {
    if (_readKeyCode(event) === TAB) {
      // we want to stay in our focus trap so continue
      return;
    }

    if ([BACKSPACE, DELETE].includes(_readKeyCode(event))) {
      // if the backspace or delete is pressed on the selected area we want to close it
      if (handle === DtSelectionAreaEventTarget.SelectedArea) {
        this._handleOverlayClose();
        return;
      }

      const timestamp =
        handle === DtSelectionAreaEventTarget.RightHandle
          ? this._rangeArea.left
          : this._rangeArea.left + this._rangeArea.width;
      // reset the range
      this._handleOverlayClose();
      this._emitStateChanges();
      this._switchToTimestamp.next(timestamp);
      return;
    }

    // to prevent scrolling on page up and down
    event.preventDefault();

    const range = updateRangeWithKeyboardEvent(
      event,
      handle,
      this._maxWidth,
      this._rangeArea,
    );

    const minWidth = this._calculateMinWidth(range.left);
    this._area = clampRange(range, this._maxWidth, minWidth);

    // prevent handle keyup from bubbling up to the selection area
    event.stopImmediatePropagation();
  }

  /**
   * @internal
   * Adds or removes the class that displays the arrows on the side handles.
   * This method is used by the selection are to toggle the arrows.
   */
  _reflectRangeReleased(add: boolean): void {
    if (add) {
      _addCssClass(this._elementRef.nativeElement, DT_RANGE_RELEASED_CLASS);
    } else {
      _removeCssClass(this._elementRef.nativeElement, DT_RANGE_RELEASED_CLASS);
    }
  }

  /**
   * @internal
   * Checks if the range is valid with the start and end point.
   * This method is used by the selection area to determine if it is valid.
   */
  _isRangeValid(start: number, end: number): boolean {
    if (end < start + this._min) {
      return false;
    }
    return true;
  }

  /**
   * @internal
   * Emits the final value that a selection is holding on drag end.
   * This method is being called by the wrapping selection area.
   */
  _emitDragEnd(): void {
    this.valueChanges.emit(this._value);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal
   * Converts a range state from pixels to a number tuple with start and end.
   * Used by the selection area and the range itself.
   */
  _getRangeValuesFromPixels(
    left: number,
    width: number,
  ): [number, number] | undefined {
    if (this._pixelsToValue) {
      const start = Math.round(
        this._pixelsToValue(left + this._plotBackgroundChartOffset),
      );
      const end = Math.round(
        this._pixelsToValue(left + width + this._plotBackgroundChartOffset),
      );
      return [start, end];
    }
  }

  /** Checks if the selected area meets the minimum constraints. */
  private _checkRangeValid(): void {
    const valid = this._isRangeValid(this._value[0], this._value[1]);
    if (this._valid !== valid) {
      this._valid = valid;
      this.valid.next(valid);
      this._reflectRangeValid();
    }
  }

  /** Emits the internal state changes event when the left and width properties are changing */
  private _emitStateChanges(): void {
    this._stateChanges.next(
      new RangeStateChangedEvent(
        this._rangeArea.left,
        this._rangeArea.width,
        this._hidden,
      ),
    );
  }

  /**
   * Set the value when the area is updated with left and width in px.
   * This function converts the px values to a value and emits a value change.
   */
  private _setValueFromArea(): void {
    const value = this._getRangeValuesFromPixels(
      this._rangeArea.left,
      this._rangeArea.width,
    );

    if (value) {
      this._value = value;
    }
    // mark for check to update the value binding in the range overlay
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Toggles a css class according to the min constraint,
   * that indicates wether the range is valid or not.
   */
  private _reflectRangeValid(): void {
    if (!this._valid) {
      _addCssClass(this._elementRef.nativeElement, DT_RANGE_INVALID_CLASS);
    } else {
      _removeCssClass(this._elementRef.nativeElement, DT_RANGE_INVALID_CLASS);
    }
  }

  /** Calculate the px values out of the unit values */
  private _reflectValueToArea(): void {
    if (this._valueToPixelsFn) {
      const left =
        this._valueToPixelsFn(this._value[0]) - this._plotBackgroundChartOffset;
      const width =
        this._valueToPixelsFn(this._value[1]) -
        left -
        this._plotBackgroundChartOffset;
      const range = clampRange({ left, width }, this._maxWidth, 0);
      this._rangeArea.left = range.left;
      this._rangeArea.width = range.width;
    }

    this._reflectStyleToDom();
  }

  /** Updates the value with the renderer to avoid an expensive binding */
  private _reflectValueToDom(): void {
    const displayValue = dtFormatDateRange(this.value[0], this.value[1]);

    if (this._rangeElementRef && this._rangeElementRef.first) {
      const element: Element = this._rangeElementRef.first.nativeElement;
      if (element && element.setAttribute) {
        element.setAttribute('aria-valuenow', `${this.value.join('-')}`);
        element.setAttribute('aria-valuetext', displayValue);
      }
    }
  }

  /** Updates the selection area styling according to the actual range */
  private _reflectStyleToDom(): void {
    if (this._rangeElementRef && this._rangeElementRef.first) {
      const element: HTMLElement = this._rangeElementRef.first.nativeElement;
      if (element && element.style) {
        element.style.opacity = `${+!this._rangeHidden}`;
        element.style.left = `${this._rangeArea.left}px`;
        element.style.width = `${this._rangeArea.width}px`;
      }
    }
  }
}
