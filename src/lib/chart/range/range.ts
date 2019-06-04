import {
  Component,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  Renderer2,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  addCssClass,
  removeCssClass,
  isNumber,
} from '@dynatrace/angular-components/core';
import { Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

const DT_RANGE_RELEASED_CLASS = 'dt-chart-range-released';

export interface DtChartRangeChanged {
  left: number;
  width: number;
  hidden: boolean;
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
  /** @internal Event that emits when a handle receives a mousedown event */
  @Output() readonly _handleDragStarted = new EventEmitter<MouseEvent>();
  @Output() readonly changed = new EventEmitter<DtChartRangeChanged>();

  @Input() ariaLabelSelectedArea = '';

  /** @internal function to calculate the px position of a provided value on the xAxis */
  private _valueToPixelsFn: ((value: number, paneCoordinates?: boolean) => number) | null =  null;

  get _valueToPixels(): ((value: number, paneCoordinates?: boolean) => number) | null { return this._valueToPixelsFn; }
  set _valueToPixels(fn: ((value: number, paneCoordinates?: boolean) => number) | null) {
    this._valueToPixelsFn = fn;
    this._reflectValueToArea();
  }

  /** The state of the range in px where it should be positioned */
  private _area: { left: number; width: number } = { left: 0, width: 0 };
  /** The state of the range when it is set programmatically in xAxis values from - to */
  private _value: [number, number] = [0, 0];
  /** The visibility state of the range */
  private _hidden = true;
  /** Subject used for unsubscribing */
  private _destroy$ = new Subject<void>();

  @ViewChildren('range')
  private _range: QueryList<ElementRef<HTMLDivElement>>;

  /** The visibility of the range */
  @Input()
  get hidden(): boolean {
    return this._hidden;
  }
  set hidden(hidden: boolean) {
    this._hidden = coerceBooleanProperty(hidden);
    this._emitChange();
    this._changeDetectorRef.markForCheck();
  }

  /** The value on the chart x-axis where the timestamp should be placed */
  @Input()
  get value(): [number, number] {
    return this._value;
  }
  set value(value: [number, number]) {
    if (!isNumber(value[0]) || !isNumber(value[1])) {
      this.reset();
      return;
    }
    this._value = value;
    this._hidden = false;

    this._reflectValueToArea();
  }

  /** The area from the left point with the width */
  @Input()
  get area(): { left: number; width: number } {
    return this._area;
  }
  set area(area: { left: number; width: number }) {
    this._area = area;
    this._reflectStyleToDom();
    this._emitChange();
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
    this._range.changes.pipe(
      startWith(null),
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this._reflectStyleToDom();
    });
  }

  /** Resets the range and hides it */
  reset(): void {
    this._hidden = true;
    this._area = { left: 0, width: 0 };
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

  _setBoundaries(): void {
    // TODO: clamp to boundaries
    this._elementRef.nativeElement.getBoundingClientRect();
  }

  private _reflectValueToArea(): void {
    if (this._valueToPixelsFn) {
      this._area.left = this._valueToPixelsFn(this._value[0]);
      this._area.width = this._valueToPixelsFn(this._value[1]) - this._area.left;
    }

    this._reflectStyleToDom();
    this._emitChange();
    this._changeDetectorRef.markForCheck();
  }

  /** Emits the change event  */
  private _emitChange(): void {
    this.changed.emit({
      left: this._area.left,
      width: this._area.width,
      hidden: this.hidden,
    });
  }

  /** Updates the selection area styling according to the actual range */
  private _reflectStyleToDom(): void {
    if (this._range && this._range.first) {
      this._renderer.setStyle(this._range.first.nativeElement, 'opacity', `${+!this._hidden}`);
      this._renderer.setStyle(
        this._range.first.nativeElement,
        'left',
        `${this._area.left}px`
      );
      this._renderer.setStyle(
        this._range.first.nativeElement,
        'width',
        `${this._area.width}px`
      );
    }
  }
}
