import {
  Component,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  ViewChild,
} from '@angular/core';
import { Range } from '../utils';
import { addCssClass, removeCssClass } from '@dynatrace/angular-components/core';

const DT_RANGE_RELEASED_CLASS = 'dt-chart-range-released';

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

  @Input() ariaLabelSelectedArea = '';

  private _hidden = true;

  @ViewChild('range')
  private _rangeElement: ElementRef<HTMLDivElement> | undefined;

  @Input()
  get hidden(): boolean { return this._hidden; }
  set hidden(hidden: boolean) {
    this._hidden = hidden;
    this._changeDetectorRef.markForCheck();
  }

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  /** @internal */
  _updateRange(range: Range): void {
    this._reflectStyleToElement(range);
  }

  /** @internal */
  _dragHandle(event: MouseEvent): void {
    event.stopImmediatePropagation();
    this._handleDragStarted.emit(event);
  }

  /** @internal */
  _addOrRemoveReleasedClass(add: boolean): void {
    if (add) {
      addCssClass(this._elementRef.nativeElement, DT_RANGE_RELEASED_CLASS);
    } else {
      removeCssClass(this._elementRef.nativeElement, DT_RANGE_RELEASED_CLASS);
    }
  }

  private _reflectStyleToElement(range: Range): void {
    if (this._rangeElement) {
      this._rangeElement.nativeElement.style.opacity = '1';
      this._rangeElement.nativeElement.style.left = `${range.left}px`;
      this._rangeElement.nativeElement.style.width = `${range.width}px`;
    }
  }
}
