import { CdkTrapFocus } from '@angular/cdk/a11y';
import {
  BACKSPACE,
  DELETE,
  DOWN_ARROW,
  LEFT_ARROW,
  RIGHT_ARROW,
  TAB,
  UP_ARROW,
} from '@angular/cdk/keycodes';
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
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { isNumber, readKeyCode } from '@dynatrace/angular-components/core';

import { updateTimestampWithKeyboardEvent } from './update-timestamp-with-keyboard-event';

/** @internal Aria label for the selected time. */
export const ARIA_DEFAULT_SELECTED_LABEL = 'the selected time';

/** @internal Aria label for the close button in the overlay. */
export const ARIA_DEFAULT_CLOSE_LABEL = 'close';

/** @internal Event that gets emitted when the internal state of the timestamp changes */
export class TimestampStateChangedEvent {
  constructor(public position: number, public hidden: boolean) {}
}

@Component({
  selector: 'dt-chart-timestamp',
  templateUrl: 'timestamp.html',
  styleUrls: ['timestamp.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dt-chart-timestamp',
    cdkTrapFocus: 'true',
  },
})
export class DtChartTimestamp implements AfterViewInit, OnDestroy {
  /** Aria label for the close button in the overlay */
  @Input('aria-label-close') readonly ariaLabelClose = ARIA_DEFAULT_CLOSE_LABEL;

  /** Aria label for the selected moment */
  @Input('aria-label-selected')
  readonly ariaLabelSelected = ARIA_DEFAULT_SELECTED_LABEL;

  /** The value on the chart xAxis where the timestamp should be placed */
  @Input()
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    if (!isNumber(value)) {
      this._reset();
      return;
    }
    this._value = value;
    this._timestampHidden = false;
    this._reflectValueToPosition();
    this._emitStateChanges();
    this._changeDetectorRef.markForCheck();
  }

  /** Emits the new value of the timestamp when it is changed by user triggered events */
  @Output() readonly valueChanges = new EventEmitter<number>();

  /**
   * @internal
   * Used by the selection area as content to project into the overlay with a portal.
   */
  @ViewChild(TemplateRef, { static: true })
  _overlayTemplate: TemplateRef<unknown>;

  /**
   * @internal The focus trap for the selected timestamp,
   * used by the selection area to chain the focus group of the timestamp and the overlay.
   */
  @ViewChild(CdkTrapFocus, { static: false })
  _selectedFocusTrap: CdkTrapFocus;

  /**
   * @internal
   * ElementRef of the timestamp, used by the selection area to position
   * the overlay centered to the timestamp. Furthermore it is used by the timestamp itself
   * to subscribe to the changes when it is hidden there is no timestamp.
   */
  @ViewChildren('selector')
  _timestampElementRef: QueryList<ElementRef<HTMLDivElement>>;

  /** @internal Function that converts a chart xAxis value to a px value */
  get _valueToPixels():
    | ((value: number, paneCoordinates?: boolean) => number)
    | null {
    return this._valueToPixelsFn;
  }
  set _valueToPixels(
    fn: ((value: number, paneCoordinates?: boolean) => number) | null,
  ) {
    this._valueToPixelsFn = fn;
    this._reflectValueToPosition();
    this._emitStateChanges();
    this._changeDetectorRef.markForCheck();
  }

  /** @internal If the timestamp is currently visible, used to switch between timestamp and range */
  get _hidden(): boolean {
    return this._timestampHidden;
  }
  set _hidden(hidden: boolean) {
    this._timestampHidden = hidden;
    this._changeDetectorRef.markForCheck();
  }

  /** @internal The position in px where the timestamp should be placed on the xAxis */
  get _position(): number {
    return this._positionX;
  }
  set _position(position: number) {
    this._positionX = position;
    this._reflectStyleToDom();

    this._emitStateChanges();
    this._emitValueChanges();
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal
   * Subject that emits when the close button of the overlay was triggered
   */
  readonly _closeOverlay = new Subject<void>();

  /** @internal State changes subject that provides the state with the position in px */
  readonly _stateChanges = new Subject<TimestampStateChangedEvent>();

  /** @internal Subject that emits if a timestamp will be transformed to a range */
  readonly _switchToRange = new Subject<number>();

  /** @internal The maximum value that can be selected on the xAxis */
  _maxValue: number;

  /** @internal The minimal value that can be selected on the xAxis */
  _minValue: number;

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

  /** The internal state on which px position of the xAxis the timestamp is  */
  private _positionX = 0;

  /** If the timestamp is currently visible, used to switch between timestamp and range  */
  private _timestampHidden = true;

  /** The internal value on the chart xAxis where the timestamp should be placed */
  private _value = 0;

  /** Subject used for unsubscribing */
  private _destroy$ = new Subject<void>();

  constructor(
    public _viewContainerRef: ViewContainerRef,
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngAfterViewInit(): void {
    this._timestampElementRef.changes
      .pipe(
        startWith(null),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._reflectStyleToDom();
      });
  }

  /** Focuses the timestamp element. */
  focus(): void {
    if (this._timestampElementRef && this._timestampElementRef.first) {
      this._timestampElementRef.first.nativeElement.focus();
    }
  }

  /**
   * @internal
   * Resets the timestamps values and hides it.
   * This method is used by the selection area to reset the timestamp.
   */
  _reset(): void {
    this._value = 0;
    this._positionX = 0;
    this._timestampHidden = true;
    this._reflectStyleToDom();
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Get triggered by the close button of the overlay */
  _handleOverlayClose(): void {
    this._closeOverlay.next();
    this._reset();
  }

  /**
   * @internal
   * Will be called by the selection area when the value is set.
   */
  _emitValueChanges(): void {
    if (this._pixelsToValue) {
      this._value = this._pixelsToValue(
        this._positionX + this._plotBackgroundChartOffset,
      );
      this.valueChanges.emit(this._value);
    }
  }

  /**
   * @internal
   * Emits the change event, it has to be internal in case that it will be triggered
   * by the selection area.
   */
  _emitStateChanges(): void {
    this._stateChanges.next(
      new TimestampStateChangedEvent(this._positionX, this._timestampHidden),
    );
  }

  /**
   * @internal
   * This method is used to enable keyboard support to move the timestamp
   * @param event Keyboard event that provides information how to move the timestamp
   */
  _handleKeyUp(event: KeyboardEvent): void {
    if (readKeyCode(event) === TAB) {
      // we want to stay in our focus trap so continue
      return;
    }

    if ([BACKSPACE, DELETE].includes(readKeyCode(event))) {
      // reset the timestamp
      this._reset();
      this._closeOverlay.next();
      this._emitStateChanges();
    }

    const arrowKeys = [DOWN_ARROW, UP_ARROW, LEFT_ARROW, RIGHT_ARROW];
    if (!!event.shiftKey && arrowKeys.includes(readKeyCode(event))) {
      this._switchToRange.next(this._positionX);
    }

    // to prevent scrolling on page up and down
    event.preventDefault();

    const maxWidth = this._elementRef.nativeElement.getBoundingClientRect()
      .width;

    this._position = updateTimestampWithKeyboardEvent(
      event,
      this._positionX,
      maxWidth,
    );
  }

  /** Calculate the px value out of the unit value */
  private _reflectValueToPosition(): void {
    if (this._valueToPixelsFn) {
      this._positionX = this._valueToPixelsFn(this._value);
    }

    this._reflectStyleToDom();
  }

  /** Reflects the position of the timestamp to the element */
  private _reflectStyleToDom(): void {
    if (this._timestampElementRef && this._timestampElementRef.first) {
      this._renderer.setStyle(
        this._timestampElementRef.first.nativeElement,
        'transform',
        `translateX(${this._positionX}px)`,
      );
    }
  }
}
