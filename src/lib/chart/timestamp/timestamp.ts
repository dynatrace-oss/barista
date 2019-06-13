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
  ViewEncapsulation,
} from '@angular/core';
import { isNumber } from '@dynatrace/angular-components/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

/** @internal */
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
  },
})
export class DtChartTimestamp implements AfterViewInit, OnDestroy {
  /** Emits the new value of the timestamp when it is changed by user triggered events */
  @Output() readonly valueChanges = new EventEmitter<number>();

  /** Aria label for the close button in the overlay */
  @Input() readonly ariaLabelClose = 'close';

  /**
   * @internal
   * subject that emits when the close button of the overlay was triggered
   */
  readonly _closeOverlay = new Subject<void>();

  /** @internal */
  readonly _stateChanges = new Subject<TimestampStateChangedEvent>();

  /** @internal */
  @ViewChild(TemplateRef, { static: true })
  _overlayTemplate: TemplateRef<unknown>;

  /** @internal function that provides a value on the xAxis for a provided px value */
  _pixelsToValue:
    | ((pixel: number, paneCoordinates?: boolean | undefined) => number)
    | null = null;

  /** function to calculate the px position of a provided value on the xAxis */
  private _valueToPixelsFn:
    | ((value: number, paneCoordinates?: boolean) => number)
    | null = null;

  private _positionX = 0;
  private _timestampHidden = true;
  private _value = 0;
  private _destroy$ = new Subject<void>();

  get _valueToPixels():
    | ((value: number, paneCoordinates?: boolean) => number)
    | null {
    return this._valueToPixelsFn;
  }
  set _valueToPixels(
    fn: ((value: number, paneCoordinates?: boolean) => number) | null
  ) {
    this._valueToPixelsFn = fn;
    this._reflectValueToPosition();
    this._emitStateChanges();
    this._changeDetectorRef.markForCheck();
  }

  @ViewChildren('selector')
  _timestampElementRef: QueryList<ElementRef<HTMLDivElement>>;

  /** @internal */
  @Input()
  get _hidden(): boolean {
    return this._timestampHidden;
  }
  set _hidden(hidden: boolean) {
    this._timestampHidden = hidden;
    this._changeDetectorRef.markForCheck();
  }

  /** The value on the chart x-axis where the timestamp should be placed */
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

  /** @internal The position in px where the timestamp should be placed on the x-axis */
  @Input()
  get _position(): number {
    return this._positionX;
  }
  set _position(position: number) {
    this._positionX = position;
    this._reflectStyleToDom();

    this._emitValueChanges();
    this._changeDetectorRef.markForCheck();
  }

  constructor(
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngAfterViewInit(): void {
    this._timestampElementRef.changes
      .pipe(
        startWith(null),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this._reflectStyleToDom();
      });
  }

  /** @internal */
  _reset(): void {
    this._value = 0;
    this._positionX = 0;
    this._timestampHidden = true;
    this._reflectStyleToDom();
    this._changeDetectorRef.markForCheck();
  }

  /** @internal get triggered by the close button of the overlay */
  _handleOverlayClose(): void {
    this._closeOverlay.next();
    this._reset();
  }

  /**
   * @internal
   * will be called by the selection area when the value is set.
   */
  _emitValueChanges(): void {
    if (this._pixelsToValue) {
      this._value = this._pixelsToValue(this._positionX);
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
      new TimestampStateChangedEvent(this._positionX, this._hidden)
    );
  }

  /** Calculate the px value out of the unit value */
  private _reflectValueToPosition(): void {
    if (this._valueToPixelsFn) {
      this._positionX = this._valueToPixelsFn(this._value);
    }

    this._reflectStyleToDom();
  }

  /** reflects the position of the timestamp to the element */
  private _reflectStyleToDom(): void {
    if (this._timestampElementRef && this._timestampElementRef.first) {
      this._renderer.setStyle(
        this._timestampElementRef.first.nativeElement,
        'transform',
        `translateX(${this._positionX}px)`
      );
    }
  }
}
