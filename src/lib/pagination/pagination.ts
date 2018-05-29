import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation, Input, ChangeDetectorRef, Output, EventEmitter,
} from '@angular/core';
import {OnInit} from '@angular/core/src/metadata/lifecycle_hooks';

/* Component-internal data-structure */
export type PaginationNumberType = [number, 'normal' | 'active' | 'ellipsis'];

const enum Constants {
  MAX_ALL_ITEMS = 7,
  LEFT_BORDER = 3,
  LEFT_BORDER_PLUS = 4,
  RIGHT_BORDER_DIFF = 2,
  RIGHT_BORDER_PLUS_DIFF = 3,
}
const enum DisplayState {
  All,               // 1 (2) 3 4 5
  Outside,           // 1 (2) 3 ... 84 85 86
  LeftExtended,      // 1 2 (3) 4 ... 85 86
  LeftExtendedPlus,  // 1 2 3 (4) 5 ... 86
  RightExtended,     // 1 2 ... 83 (84) 85 86
  RightExtendedPlus, // 1 ... (83) 84 85 86
  Middle,            // 1 ... 54 (55) 56 ... 86
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

  private _calculateDisplayState(): DisplayState {
    const max: number = this._maxPages || 0;
    const current = this.currentPage;

    if (max > Constants.MAX_ALL_ITEMS) {
      if (current === Constants.LEFT_BORDER) {
        return DisplayState.LeftExtended;
      } else if (current === Constants.LEFT_BORDER_PLUS) {
          return DisplayState.LeftExtendedPlus;
      } else if (current === (max - Constants.RIGHT_BORDER_DIFF)) {
        return DisplayState.RightExtended;
      } else if (current === (max - Constants.RIGHT_BORDER_PLUS_DIFF)) {
        return DisplayState.RightExtendedPlus;
      } else if (current <= Constants.LEFT_BORDER || current >= (max - Constants.RIGHT_BORDER_DIFF)) {
        return DisplayState.Outside;
      } else {
        return DisplayState.Middle;
      }
    }
    return DisplayState.All;
  }

  private _calculateNumbers(): PaginationNumberType[] {
    const max: number = this._maxPages || 0;

    const newNumbers: PaginationNumberType[] = [];
    const current = this.currentPage;

    const displayState = this._calculateDisplayState();

    let lastEllipsis = false;

    for (let i = 1; i <= max; i++) {

      const shouldDisplay = displayState === DisplayState.All
        || (displayState === DisplayState.Outside && i <= Constants.LEFT_BORDER)
        || (displayState === DisplayState.Outside && i >= (max - Constants.RIGHT_BORDER_DIFF))
        || (displayState === DisplayState.LeftExtended
          && (i <= (Constants.LEFT_BORDER + 1) || i > (max - Constants.RIGHT_BORDER_DIFF)))
        || (displayState === DisplayState.LeftExtendedPlus
          && (i <= (Constants.LEFT_BORDER_PLUS + 1) || i > (max - Constants.RIGHT_BORDER_DIFF + 1)))
        || (displayState === DisplayState.RightExtended
          && (i < (Constants.LEFT_BORDER) || i >= (max - Constants.RIGHT_BORDER_DIFF - 1)))
        || (displayState === DisplayState.RightExtendedPlus
          && (i < (Constants.LEFT_BORDER - 1) || i >= (max - Constants.RIGHT_BORDER_PLUS_DIFF - 1)))
        || (displayState === DisplayState.Middle && (i === 1 || i === max || Math.abs(current - i) <= 1))
      ;

      if (shouldDisplay || !lastEllipsis) {
        newNumbers.push([i, shouldDisplay ? (i === current ? 'active' : 'normal') : 'ellipsis']);
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
    if (paginationNumber[1] === 'normal') {
      this.currentPage = paginationNumber[0];
      this.changed.emit(paginationNumber[0]);
    }
  }
}
