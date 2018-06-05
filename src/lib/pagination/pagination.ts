import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation, Input, ChangeDetectorRef, Output, EventEmitter,
} from '@angular/core';
import {OnInit} from '@angular/core/src/metadata/lifecycle_hooks';
import {calculatePaginationState} from './pagination-state';

/* Component-internal data-structure */
export interface PaginationNumberType {
  page: number;
  state: 'normal' | 'active' | 'ellipsis';
}

@Component({
  moduleId: module.id,
  selector: 'dt-pagination',
  templateUrl: 'pagination.html',
  styleUrls: ['pagination.scss'],
  host: {
    class: 'dt-pagination',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtPagination implements OnInit {

  @Output()
  readonly changed: EventEmitter<number> = new EventEmitter<number>();

  private _maxPages: number | undefined;
  private _currentPage: number | undefined;

  _numbers: PaginationNumberType[] | undefined;
  _leftArrowActive: boolean;
  _rightArrowActive: boolean;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
  }

  @Input()
  get maxPages(): number | undefined {
    return this._maxPages;
  }

  set maxPages(value: number | undefined) {
    if (this._maxPages !== value) {
      this._maxPages = value;
      this._updateItems();
      this._changeDetectorRef.markForCheck();
    }
  }

  @Input()
  get currentPage(): number {
    return this._currentPage || 1;
  }

  set currentPage(value: number) {
    if (this._currentPage !== value) {
      this._currentPage = value;
      this._updateItems();
      this._changeDetectorRef.markForCheck();
    }
  }

  ngOnInit(): void {
    this._numbers = [];
    this._updateItems();
  }

  private _updateItems(): void {
    if (this._numbers === undefined) {
      return;
    }
    this._numbers = this._maxPages !== undefined ? this._calculateNumbers() : [];
    this._leftArrowActive = this._numbers && this.currentPage > 1;
    this._rightArrowActive = this._numbers && !!this.maxPages && this.currentPage < this.maxPages;
  }

  private _calculateNumbers(): PaginationNumberType[] {
    const max: number = this._maxPages || 0;

    const newNumbers: PaginationNumberType[] = [];
    const current = this.currentPage;

    const paginationState = calculatePaginationState(current, max);

    let lastEllipsis = false;

    for (let i = 1; i <= max; i++) {

      const shouldDisplay = paginationState(i, current, max);

      if (shouldDisplay || !lastEllipsis) {
        newNumbers.push({
            page: i,
            state: shouldDisplay ? (i === current ? 'active' : 'normal') : 'ellipsis',
          });
        lastEllipsis = !shouldDisplay;
      }
    }

    return newNumbers;
  }

  _handleArrowClick(left: boolean): void {
    this.currentPage += left ? -1 : 1;
    this.changed.emit(this.currentPage);
  }

  _handleNumberClick(paginationNumber: PaginationNumberType): void {
    if (paginationNumber.state === 'normal') {
      this.currentPage = paginationNumber.page;
      this.changed.emit(paginationNumber.page);
    }
  }
}
