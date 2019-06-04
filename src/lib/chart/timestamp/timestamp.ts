import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChildren,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isNumber } from '@dynatrace/angular-components/core';

export interface DtChartTimestampChanged {
  position: number;
  hidden: boolean;
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
export class DtChartTimestamp implements OnDestroy {

  @Output() readonly changed = new EventEmitter<DtChartTimestampChanged>();

  _valueToPixels: (value: number, paneCoordinates?: boolean) => number = (value: number) => value;

  private _positionX: number;
  private _hidden = true;
  private _value = 0;
  private _destroy$ = new Subject<void>();

  @ViewChildren('selector')
  private _selector: QueryList<ElementRef<HTMLDivElement>>;

  @Input()
  get hidden(): boolean {
    return this._hidden;
  }
  set hidden(hidden: boolean) {
    this._hidden = hidden;
    this._emitChange();
    this._changeDetectorRef.markForCheck();
  }

  /** The value on the chart x-axis where the timestamp should be placed */
  @Input()
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    if (!isNumber(value)) {
      this.reset();
      return;
    }
    this._value = value;
    this._hidden = false;
    this._positionX = this._valueToPixels(value);
    this._reflectPositionToDom();
    this._emitChange();
    this._changeDetectorRef.markForCheck();
  }

  /** The position in px where the timestamp should be placed on the x-axis */
  @Input()
  get position(): number {
    return this._positionX;
  }
  set position(position: number) {
    this._positionX = position;
    this._emitChange();
    this._reflectPositionToDom();
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
    this._selector.changes.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._reflectPositionToDom();
    });
  }

  reset(): void {
    this._value = 0;
    this._positionX = 0;
    this._hidden = true;
    this._reflectPositionToDom();
    this._changeDetectorRef.markForCheck();
  }

  /** Emits the change event  */
  private _emitChange(): void {
    this.changed.emit({
      position: this._positionX,
      hidden: this.hidden,
    });
  }

  /** reflects the position of the timestamp to the element */
  private _reflectPositionToDom(): void {
    if (this._selector && this._selector.first) {
      this._renderer.setStyle(
        this._selector.first.nativeElement,
        'transform',
        `translateX(${this._positionX}px)`
      );
    }
  }
}
