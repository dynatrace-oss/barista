import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  Renderer2,
  ViewChildren,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import {
  addCssClass,
  isNumber,
  removeCssClass,
} from '@dynatrace/angular-components/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

export const DT_RANGE_RELEASED_CLASS = 'dt-chart-range-released';

export interface DtChartRangeOverlayData<T = unknown> {
  from: T;
  to: T;
}

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
export class DtChartRange {

  @Output() valueChanges = new EventEmitter<[number, number]>();

  @Input() ariaLabelSelectedArea = '';

  /** @internal Event that emits when a handle receives a mousedown event */
  // TODO: do it lake stateChanges
  @Output() readonly _handleDragStarted = new EventEmitter<MouseEvent>();

  /**
   * @internal
   * subject that emits when the close button of the overlay was triggered
   */
  readonly _closeOverlay = new Subject<void>();

  /** @internal state changes subject that provides the state with left and width */
  readonly _stateChanges = new Subject<RangeStateChangedEvent>();

  /** @internal */
  @ContentChild(TemplateRef) _overlayTemplate: TemplateRef<DtChartRangeOverlayData>;

  /** @internal function that provides a value on the xAxis for a provided px value */
  _pixelsToValue:
    | ((pixel: number, paneCoordinates?: boolean | undefined) => number)
    | null = null;

  /** @internal function to calculate the px position of a provided value on the xAxis */
  private _valueToPixelsFn:
    | ((value: number, paneCoordinates?: boolean) => number)
    | null = null;

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

  /** The state of the range in px where it should be positioned */
  private _rangeArea: { left: number; width: number } = { left: 0, width: 0 };
  /** The state of the range when it is set programmatically in xAxis values from - to */
  private _value: [number, number] = [0, 0];
  /** The visibility state of the range */
  private _rangeHidden = true;
  /** Subject used for unsubscribing */
  private _destroy$ = new Subject<void>();

  @ViewChildren('range')
  private _range: QueryList<ElementRef<HTMLDivElement>>;

  /** @internal The visibility of the range */
  @Input()
  get _hidden(): boolean {
    return this._rangeHidden;
  }
  set _hidden(hidden: boolean) {
    this._rangeHidden = coerceBooleanProperty(hidden);
    this._emitStateChanges();
    this._changeDetectorRef.markForCheck();
  }

  /** The value on the chart x-axis where the timestamp should be placed */
  @Input()
  get value(): [number, number] {
    return this._value;
  }
  set value(value: [number, number]) {
    if (!isNumber(value[0]) || !isNumber(value[1])) {
      this._reset();
      return;
    }
    this._value = value;
    this._rangeHidden = false;
    this._addOrRemoveReleasedClass(true);
    this._reflectValueToArea();
    this._emitStateChanges();
    this._changeDetectorRef.markForCheck();
  }

  /** @internal The area from the left point with the width */
  get _area(): { left: number; width: number } {
    return this._rangeArea;
  }
  set _area(area: { left: number; width: number }) {
    this._rangeArea = area;
    this._reflectStyleToDom();

    // emit Output

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
    this._range.changes
      .pipe(
        startWith(null),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this._reflectStyleToDom();
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

  /** @internal function that emits an event when a handle is going to be dragged */
  _dragHandle(event: MouseEvent): void {
    event.stopImmediatePropagation();
    this._handleDragStarted.emit(event);
  }

  /** @internal adds or removes the class that displays the arrows on the side handles */
  _addOrRemoveReleasedClass(add: boolean): void {
    if (add) {
      addCssClass(this._elementRef.nativeElement, DT_RANGE_RELEASED_CLASS);
    } else {
      removeCssClass(this._elementRef.nativeElement, DT_RANGE_RELEASED_CLASS);
    }
  }

  /** @internal should clamp the value between the boundaries */
  _setBoundaries(): void {
    // TODO: clamp to boundaries
    this._elementRef.nativeElement.getBoundingClientRect();
  }

  /**
   * @internal
   * will be called by the selection area when the value is set,
   * in case that only the selection area knows when the drag is finished
   */
  _emitValueChanges(): void {
    if (this._pixelsToValue) {
      const start = this._pixelsToValue(this._area.left);
      const end = this._pixelsToValue(this._area.left + this._area.width);
      this.valueChanges.emit([start, end]);
    }
  }

  /** Emits the change event  */
  private _emitStateChanges(): void {
    this._stateChanges.next(
      new RangeStateChangedEvent(
        this._rangeArea.left,
        this._rangeArea.width,
        this._hidden
      )
    );
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
    if (this._range && this._range.first) {
      this._renderer.setStyle(
        this._range.first.nativeElement,
        'opacity',
        `${+!this._rangeHidden}`
      );
      this._renderer.setStyle(
        this._range.first.nativeElement,
        'left',
        `${this._rangeArea.left}px`
      );
      this._renderer.setStyle(
        this._range.first.nativeElement,
        'width',
        `${this._rangeArea.width}px`
      );
    }
  }
}
