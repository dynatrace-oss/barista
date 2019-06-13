import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  addCssClass,
  isNumber,
  removeCssClass,
} from '@dynatrace/angular-components/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { DtSelectionAreaEventTarget } from '../selection-area/position-utils';

/** @internal */
export const DT_RANGE_RELEASED_CLASS = 'dt-chart-range-released';

/** @internal */
export const DT_RANGE_UN_VALID_CLASS = 'dt-chart-range-valid';

// The Default minimum is 5 minutes
// tslint:disable-next-line no-magic-numbers
const DT_RANGE_DEFAULT_MIN = 30 * 5 * 60 * 1000;

/** @internal */
export class RangeStateChangedEvent {
  constructor(
    public left: number,
    public width: number,
    public hidden: boolean
  ) {}
}

@Component({
  selector: 'dt-chart-range',
  templateUrl: 'range.html',
  styleUrls: ['range.scss'],
  host: {
    class: 'dt-chart-range',
  },
})
export class DtChartRange implements AfterViewInit, OnDestroy {
  /** Emits the new values of the selection area when they are changed by user triggered events */
  @Output() readonly valueChanges = new EventEmitter<[number, number]>();

  /** Emits when the selection area is valid *(greater than the minimum constraint)* */
  @Output() readonly valid = new BehaviorSubject(false);

  /** Aria label for the close button in the overlay */
  @Input() ariaLabelClose = 'close';
  /** Aria label for the selected area */
  @Input() ariaLabelSelectedArea = '';

  /** @internal subject that emits when the close button of the overlay was triggered */
  readonly _closeOverlay = new Subject<void>();

  /** @internal state changes subject that provides the state with left and width */
  readonly _stateChanges = new Subject<RangeStateChangedEvent>();

  /** @internal Event that emits when a handle receives a mousedown event */
  readonly _handleDragStarted = new Subject<DtSelectionAreaEventTarget>();

  /**
   * @internal
   * Used by the selection area as content to project into the overlay with a portal.
   */
  @ViewChild(TemplateRef, { static: true })
  _overlayTemplate: TemplateRef<{}>;

  /**
   * @internal
   * ElementRef of the selected area, used by the selection area to position
   * the overlay centered to the selected area. Furthermore it is used by the range
   * to subscribe to the changes when it is hidden there is no selected area.
   */
  @ViewChildren('range') _rangeElementRef: QueryList<
    ElementRef<HTMLDivElement>
  >;

  /** @internal function that provides a value on the xAxis for a provided px value */
  _pixelsToValue:
    | ((pixel: number, paneCoordinates?: boolean | undefined) => number)
    | null = null;

  /** @internal function to calculate the px position of a provided value on the xAxis */
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

  /** The minimum range that can be created, by default the minimum range is 5 minutes  */
  @Input()
  get min(): number {
    return this._min;
  }
  set min(min: number) {
    this._min = parseInt(`${min}`, 10) || DT_RANGE_DEFAULT_MIN;
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
    this._max = parseInt(`${max}`, 10) || null;
  }

  /** The value on the chart x-axis where the timestamp should be placed */
  @Input()
  get value(): [number, number] {
    return this._value;
  }
  set value(value: [number, number]) {
    if (!isNumber(value[0]) || !isNumber(value[1])) {
      this._reset();
      this._closeOverlay.next();
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
    // trigger change detection in case that it can be set programmatically
    this._changeDetectorRef.markForCheck();
  }

  /** @internal function to calculate the px position of a provided value on the xAxis */
  get _valueToPixels():
    | ((value: number, paneCoordinates?: boolean) => number)
    | null {
    return this._valueToPixelsFn;
  }
  set _valueToPixels(
    fn: ((value: number, paneCoordinates?: boolean) => number) | null
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
    this._rangeArea = area;
    // set the correct styles on the range element
    this._reflectStyleToDom();
    // emit a values changed event
    this._emitValueChanges();
    this._emitStateChanges();
    // check if the range is valid and toggle the appropriate classes
    this._checkRangeValid();
    // trigger change detection in case that it can be set programmatically
    this._changeDetectorRef.markForCheck();
  }

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _renderer: Renderer2
  ) {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngAfterViewInit(): void {
    this._rangeElementRef.changes
      .pipe(
        startWith(null),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this._reflectStyleToDom();
        this._reflectRangeValid();
      });
  }

  /** @internal Resets the range and hides it */
  _reset(): void {
    this._rangeHidden = true;
    this._rangeArea = { left: 0, width: 0 };
    this._value = [0, 0];
    this._reflectStyleToDom();
    // needed in case that hidden triggers a ng-if
    this._changeDetectorRef.markForCheck();
  }

  /** @internal get triggered by the close button of the overlay */
  _handleOverlayClose(): void {
    this._closeOverlay.next();
    this._reset();
  }

  /** @internal function that emits an event when a handle is going to be dragged */
  _dragHandle(event: MouseEvent, type: DtSelectionAreaEventTarget): void {
    event.stopImmediatePropagation();
    this._handleDragStarted.next(type);
  }

  /** @internal adds or removes the class that displays the arrows on the side handles */
  _reflectRangeReleased(add: boolean): void {
    if (add) {
      addCssClass(this._elementRef.nativeElement, DT_RANGE_RELEASED_CLASS);
    } else {
      removeCssClass(this._elementRef.nativeElement, DT_RANGE_RELEASED_CLASS);
    }
  }

  /**
   * @internal
   * Checks if the range is valid with the start and end point.
   */
  _isRangeValid(start: number, end: number): boolean {
    if (end < start + this._min) {
      return false;
    }
    return true;
  }

  /**
   * @internal
   * will be called by the selection area when the value is set,
   * in case that only the selection area knows when the drag is finished
   */
  _emitValueChanges(): void {
    const value = this._getRangeValuesFromPixels(
      this._rangeArea.left,
      this._rangeArea.width
    );

    if (value) {
      this._value = value;
      this.valueChanges.emit(this._value);
    }
  }

  /**
   * @internal
   * Emits the change event, it has to be internal in case that it will be triggered
   * by the selection area when the drag is completed. The range itself never knows when the drag
   * completes.
   */
  _emitStateChanges(): void {
    this._stateChanges.next(
      new RangeStateChangedEvent(
        this._rangeArea.left,
        this._rangeArea.width,
        this._hidden
      )
    );
  }

  /**
   * @internal
   * converts a range state from pixels to a number tuple with start and end.
   * Used by the selection area and the range itself.
   */
  _getRangeValuesFromPixels(
    left: number,
    width: number
  ): [number, number] | undefined {
    if (this._pixelsToValue) {
      const start = Math.round(this._pixelsToValue(left));
      const end = Math.round(this._pixelsToValue(left + width));
      return [start, end];
    }
  }

  _checkRangeValid(): void {
    const valid = this._isRangeValid(this._value[0], this._value[1]);
    if (this._valid !== valid) {
      this._valid = valid;
      this.valid.next(valid);
      this._reflectRangeValid();
    }
  }

  private _reflectRangeValid(): void {
    if (!this._valid) {
      addCssClass(this._elementRef.nativeElement, DT_RANGE_UN_VALID_CLASS);
    } else {
      removeCssClass(this._elementRef.nativeElement, DT_RANGE_UN_VALID_CLASS);
    }
  }

  /** Calculate the px values out of the unit values */
  private _reflectValueToArea(): void {
    if (this._valueToPixelsFn) {
      this._rangeArea.left = this._valueToPixelsFn(this._value[0]);
      this._rangeArea.width =
        this._valueToPixelsFn(this._value[1]) - this._rangeArea.left;
    }

    this._reflectStyleToDom();
  }

  /** Updates the selection area styling according to the actual range */
  private _reflectStyleToDom(): void {
    if (this._rangeElementRef && this._rangeElementRef.first) {
      this._renderer.setStyle(
        this._rangeElementRef.first.nativeElement,
        'opacity',
        `${+!this._rangeHidden}`
      );
      this._renderer.setStyle(
        this._rangeElementRef.first.nativeElement,
        'left',
        `${this._rangeArea.left}px`
      );
      this._renderer.setStyle(
        this._rangeElementRef.first.nativeElement,
        'width',
        `${this._rangeArea.width}px`
      );
    }
  }
}
