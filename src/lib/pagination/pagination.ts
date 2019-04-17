import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { calculatePages } from './pagination-calculate-pages';
import {
  DEFAULT_PAGE_SIZE,
  ELLIPSIS_CHARACTER,
  ARIA_DEFAULT_PREVIOUS_LABEL,
  ARIA_DEFAULT_NEXT_LABEL,
  ARIA_DEFAULT_LABEL,
  ARIA_DEFAULT_ELLIPSES,
  ARIA_DEFAULT_PAGE_LABEL,
  ARIA_DEFAULT_CURRENT_LABEL,
} from './pagination-defaults';
import { isNumber } from '@dynatrace/angular-components/core';

/**
 * @internal
 * @deprecated Is not used anymore!
 * @breaking-change To be removed with 3.0.0.
 * Component-internal data-structure
 */
export interface PaginationNumberType {
  page: number;
  state: 'normal' | 'active' | 'ellipsis';
}

/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class DtPageEvent {
  /** The current page index. */
  currentPage: number;
  /** The current page size */
  pageSize: number;
  /** The current total number of items being paged */
  length: number;
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
export class DtPagination implements OnChanges {

  /** Event that gets fired if the pagination changes the current page */
  @Output()
  readonly changed: EventEmitter<number> = new EventEmitter<number>();

  /** Event emitted when the pagination changes the page size or page index. */
  @Output()
  readonly page: EventEmitter<DtPageEvent> = new EventEmitter<DtPageEvent>();

  /** The length of the total number of items that are being paginated. Defaulted to 0. */
  @Input()
  get length(): number { return this._length; }
  set length(value: number) {
    if (isNumber(value)) {
      this._length = coerceNumberProperty(value);
      this._changeDetectorRef.markForCheck();
      this._emitPageChange();
    }
  }
  private _length = 0;

  /** Number of items to display on a page. By default set to 50. */
  @Input()
  get pageSize(): number { return this._pageSize; }
  set pageSize(value: number) {
    if (isNumber(value)) {
      this._pageSize = coerceNumberProperty(value);
      this._changeDetectorRef.markForCheck();
      this._emitPageChange();
    }
  }
  private _pageSize: number = DEFAULT_PAGE_SIZE;

  /**
   * @deprecated Please use the length and pageSize Inputs instead
   * @breaking-change To be removed with 3.0.0.
   */
  @Input()
  get maxPages(): number | undefined { return this.getNumberOfPages(); }
  set maxPages(value: number | undefined) {
    if (this._maxPages !== value) {
      this._maxPages = coerceNumberProperty(value);
      this._updateItems();
      this._changeDetectorRef.markForCheck();
    }
  }
  private _maxPages: number | undefined;

  /** The current page of the pagination */
  @Input()
  get currentPage(): number { return this._currentPage; }
  set currentPage(value: number) {
    const current = isNumber(value)
      ? coerceNumberProperty(value)
      : 1;

    if (this._currentPage !== current) {
      this._currentPage = current;
      this.changed.emit(this._currentPage);
      this._emitPageChange();
      this._changeDetectorRef.markForCheck();
    }
  }
  private _currentPage = 1;

  /** Aria label for the previous page button. Defaults to "Previous page" */
  @Input('aria-label-previous') ariaPreviousLabel = ARIA_DEFAULT_PREVIOUS_LABEL;
  /** Aria label for the next page button. Defaults to "Next page" */
  @Input('aria-label-next') ariaNextLabel = ARIA_DEFAULT_NEXT_LABEL;
  /** Aria label for the pagination. Defaults to "Pagination" */
  @Input('aria-label') ariaLabel = ARIA_DEFAULT_LABEL;
  /** Aria label for the ellipsis character. Defaults to "The next pages are ellipses" */
  @Input('aria-label-ellipses') ariaLabelEllipses = ARIA_DEFAULT_ELLIPSES;
  /** Aria label for a page button (Page 1,2,3...). Defaults to "Page" */
  @Input('aria-label-page') ariaPageLabel = ARIA_DEFAULT_PAGE_LABEL;
  /** Aria label for the current page button. Defaults to "You are currently on page" */
  @Input('aria-label-current') ariaCurrentLabel = ARIA_DEFAULT_CURRENT_LABEL;

  /* @internal Array of the pages to be displayed includes the ellipsis character as string */
  _pages: Array<string | number> = [];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(change: SimpleChanges): void {
    this._updateItems();
  }

  /**
   * Calculates the number of pages by the provided page size
   * and the length of all items
   */
  getNumberOfPages(): number {
    if (!this.pageSize) {
      return 0;
    }
    return Math.ceil(this.length / this.pageSize);
  }

  /** sets the previous page as current page */
  previous(): void {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
    }
  }

  /** sets the next page as current page */
  next(): void {
    /** TODO: @breaking-change 3.0.0 – remove the next line */
    const numberOfPages = !!this._maxPages ? this._maxPages : this.getNumberOfPages();
    if (this.currentPage < numberOfPages) {
      this.currentPage = this.currentPage + 1;
    }
  }

  /** @internal Check if the current page is the first page */
  _isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  /** @internal Returns true if current page is last page */
  _isLastPage(): boolean {
    /** TODO: @breaking-change 3.0.0 – change to this.pageSize */
    const numberOfPages = !!this._maxPages ? this._maxPages : this.getNumberOfPages();
    // we use greater equals in case that if there are no pages it defaults to one
    // but the number of pages would be zero.
    return this.currentPage >= numberOfPages;
  }

  /** @internal Checks if the value is an ellipsis character */
  _isEllipsis(value: string | number): boolean {
    if (value === ELLIPSIS_CHARACTER) { return true; }
    return false;
  }

  /** Calculates the pages that should be displayed by the pagination */
  private _updateItems(): void {
    /** TODO: @breaking-change 3.0.0 – refactor to `const numberOfPages = this.getNumberOfPages();` */
    const numberOfPages = !!this._maxPages ? this._maxPages : this.getNumberOfPages();

    this._pages = calculatePages(numberOfPages, this.currentPage);
  }

  /** Emits an event notifying that a change of the pagination's properties has been triggered */
  private _emitPageChange(): void {
    this._updateItems();
    this.page.emit({
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      length: this.length,
    });
  }
}
