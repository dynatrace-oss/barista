import { coerceNumberProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { AsyncSubject } from 'rxjs';

import { isNumber } from '@dynatrace/angular-components/core';

import { calculatePages } from './pagination-calculate-pages';
import {
  ARIA_DEFAULT_CURRENT_LABEL,
  ARIA_DEFAULT_ELLIPSES,
  ARIA_DEFAULT_LABEL,
  ARIA_DEFAULT_NEXT_LABEL,
  ARIA_DEFAULT_PAGE_LABEL,
  ARIA_DEFAULT_PREVIOUS_LABEL,
  DEFAULT_PAGE_SIZE,
} from './pagination-defaults';

@Component({
  moduleId: module.id,
  exportAs: 'dtPagination',
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
  /** Event that gets fired if the pagination changes the current page */
  @Output()
  readonly changed: EventEmitter<number> = new EventEmitter<number>();

  /** The length of the total number of items that are being paginated. Defaulted to 0. */
  @Input()
  get length(): number {
    return this._length;
  }
  set length(value: number) {
    const length = coerceNumberProperty(value);
    if (isNumber(value) && this._length !== length) {
      this._length = length;
      this._updateItems();
      this._changeDetectorRef.markForCheck();
    }
  }
  private _length = 0;

  /** Number of items to display on a page. By default set to 50. */
  @Input()
  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: number) {
    const pageSize = coerceNumberProperty(value);
    if (isNumber(value) && this._pageSize !== pageSize) {
      this._pageSize = pageSize;
      this._updateItems();
      this._changeDetectorRef.markForCheck();
    }
  }
  private _pageSize: number = DEFAULT_PAGE_SIZE;

  /** The current page of the pagination */
  @Input()
  get currentPage(): number {
    return this._currentPage;
  }
  set currentPage(value: number) {
    const currentPage = coerceNumberProperty(value);
    if (isNumber(value) && this._currentPage !== currentPage) {
      this._currentPage = currentPage;
      this._updateItems();
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

  /** The number of pages by the provided page size and the length of all items */
  get numberOfPages(): number {
    return this._numberOfPages;
  }
  private _numberOfPages = 0;

  /**
   * @internal
   * The async subject is used to get the last value, even it has completed.
   * Used to detect when the pagination is ready.
   */
  _initialized = new AsyncSubject<boolean>();

  /** @internal Array of the pages to be displayed */
  _pages: number[][] = [];

  /** @internal Whether the current page is the first page */
  _isFirstPage: boolean;

  /** @internal Whether the current page is last page */
  _isLastPage: boolean;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    this._updateItems();
  }

  ngOnInit(): void {
    this._initialized.next(true);
    this._initialized.complete();
  }

  /** sets the previous page as current page */
  previous(): void {
    if (!this._isFirstPage) {
      this._setPage(this.currentPage - 1);
    }
  }

  /** sets the next page as current page */
  next(): void {
    if (!this._isLastPage) {
      this._setPage(this.currentPage + 1);
    }
  }

  /**
   * @internal
   * sets the current page and emits the changed event with the current page
   * only triggered by user interaction.
   */
  _setPage(page: number): void {
    this.currentPage = page;
    this.changed.emit(page);
  }

  /** Calculates the pages that should be displayed by the pagination */
  private _updateItems(): void {
    this._numberOfPages =
      this._pageSize > 0 ? Math.ceil(this.length / this.pageSize) : 0;

    this._isFirstPage = this._currentPage <= 1;
    this._isLastPage = this._currentPage >= this._numberOfPages;

    this._pages = calculatePages(this._numberOfPages, this._currentPage);
  }
}
