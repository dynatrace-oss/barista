/**
 * @license
 * Copyright 2021 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ALT,
  DOWN_ARROW,
  ENTER,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  DtDateAdapter,
  _readKeyCode,
} from '@dynatrace/barista-components/core';
import {
  getValidDateOrNull,
  isOutsideMinMaxRange,
} from './datepicker-utils/util';

const DAYS_PER_WEEK = 7;
let uniqueId = 0;

interface DtCalendarCell<T> {
  displayValue: string;
  value: number;
  rawValue: T;
  ariaLabel: string;
}

@Component({
  selector: 'dt-calendar-body',
  templateUrl: 'calendar-body.html',
  styleUrls: ['calendar-body.scss'],
  host: {
    class: 'dt-calendar-body',
    tabIndex: '0',
    '(keyup)': '_onHostKeyup($event)',
    '(keydown)': '_onHostKeydown($event)',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtCalendarBody<T> {
  /**
   * The date to display in this month view
   * (everything other than the month and year is ignored).
   */
  @Input()
  get activeDate(): T {
    return this._activeDate;
  }
  set activeDate(value: T) {
    const validDate =
      getValidDateOrNull(this._dateAdapter, value) || this._dateAdapter.today();
    this._activeDate = this._dateAdapter.clampDate(
      validDate,
      this.minDate,
      this.maxDate,
    );
    this._init();
    this._label = this._dateAdapter.format(value, {
      year: 'numeric',
      month: 'short',
    });
    this._changeDetectorRef.markForCheck();
  }
  private _activeDate: T;

  /** The currently selected date. */
  @Input()
  get selected(): T | null {
    return this._selected;
  }
  set selected(value: T | null) {
    this._selected = getValidDateOrNull(this._dateAdapter, value);
  }
  private _selected: T | null = null;

  /** The minimum selectable date. */
  @Input()
  get minDate(): T | null {
    return this._minDate;
  }
  set minDate(value: T | null) {
    this._minDate = getValidDateOrNull(this._dateAdapter, value);
  }
  private _minDate: T | null = null;

  /** The maximum selectable date. */
  @Input()
  get maxDate(): T | null {
    return this._maxDate;
  }
  set maxDate(value: T | null) {
    this._maxDate = getValidDateOrNull(this._dateAdapter, value);
  }
  private _maxDate: T | null = null;

  /** Function used to filter whether a date is selectable or not. */
  @Input() dateFilter: (date: T) => boolean;

  @Input('aria-labelledby') ariaLabelledby: string | null;

  /** Emits when a new value is selected. */
  @Output() readonly selectedChange = new EventEmitter<T>();

  /** Emits when any date is activated. */
  @Output() readonly activeDateChange = new EventEmitter<T>();

  /** @internal The names of the weekdays. */
  _weekdays: { long: string; short: string }[];

  /** @internal Grid of calendar cells representing the dates of the month. */
  _weeks: DtCalendarCell<T>[][];

  /** @internal The number of blank cells to put at the beginning for the first row. */
  _firstRowOffset: number;

  /** @internal Unique id used for the calendar body table's aria-describedby and ariaLabelledby if ariaLabelledby is not provided. */
  _labelid = `dt-calendar-body-label-${uniqueId++}`;

  /** @internal Label used for the calendar body table aria-label and description. */
  _label = '';

  constructor(
    private _dateAdapter: DtDateAdapter<T>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
  ) {
    this._activeDate = this._dateAdapter.today();
  }

  /** Sets the focus into the calendar body */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  /**
   * @internal
   * Checks whether the date passed in is outside the valid min/max range (if min/max are set).
   */
  _isOutsideMinMaxRange(date: T): boolean {
    return isOutsideMinMaxRange(
      date,
      this._dateAdapter,
      this._minDate,
      this._maxDate,
    );
  }

  /**
   * @internal
   * Checks whether the provided date cell has the same value as the provided compare value.
   */
  _isSame(cell: DtCalendarCell<T>, compareValue: T): boolean {
    return (
      compareValue !== null &&
      cell.rawValue !== null &&
      this._dateAdapter.compareDate(cell.rawValue, compareValue) === 0
    );
  }

  /**
   * @internal
   * Select date and emit on cell click
   */
  _cellClicked(cell: DtCalendarCell<T>): void {
    this._setActiveDateAndEmit(cell.rawValue);
    this._selectActiveDate();
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal
   * Prevent default browser behaviour for calendar navigation-specific keys that could otherwise disrupt it.
   */
  _onHostKeydown(event: KeyboardEvent): void {
    const keyCode = _readKeyCode(event);
    const keysToPrevent = [
      UP_ARROW,
      DOWN_ARROW,
      LEFT_ARROW,
      RIGHT_ARROW,
      ALT,
      PAGE_UP,
      PAGE_DOWN,
      ENTER,
      SPACE,
    ];

    if (keysToPrevent.includes(keyCode)) {
      event.preventDefault();
    }
  }

  /**
   * @internal
   * Defines navigation behaviour for accessibility.
   */
  _onHostKeyup(event: KeyboardEvent): void {
    const keyCode = _readKeyCode(event);

    switch (keyCode) {
      case UP_ARROW:
        // Goto previous week
        this._setActiveDateAndEmit(
          this._dateAdapter.addCalendarDays(this._activeDate, -7),
        );
        break;
      case DOWN_ARROW:
        // Goto next week
        this._setActiveDateAndEmit(
          this._dateAdapter.addCalendarDays(this._activeDate, 7),
        );
        break;
      case LEFT_ARROW:
        // Goto previous day
        this._setActiveDateAndEmit(
          this._dateAdapter.addCalendarDays(this._activeDate, -1),
        );
        break;
      case RIGHT_ARROW:
        // Goto next day
        this._setActiveDateAndEmit(
          this._dateAdapter.addCalendarDays(this._activeDate, 1),
        );
        break;
      case PAGE_UP:
        // Goto previous month. If ALT key is pressed goto previous year instead
        this._setActiveDateAndEmit(
          event.altKey
            ? this._dateAdapter.addCalendarYears(this._activeDate, -1)
            : this._dateAdapter.addCalendarMonths(this._activeDate, -1),
        );
        break;
      case PAGE_DOWN:
        // Goto next month. If ALT key is pressed goto next year instead
        this._setActiveDateAndEmit(
          event.altKey
            ? this._dateAdapter.addCalendarYears(this._activeDate, 1)
            : this._dateAdapter.addCalendarMonths(this._activeDate, 1),
        );
        break;
      case ENTER:
      case SPACE:
        // Select the active date
        this._selectActiveDate();
        break;
    }

    // Prevent unexpected default actions such as form submission.
    event.preventDefault();

    this._changeDetectorRef.markForCheck();
  }

  /** @internal Initialization of the weeks and wekdays */
  private _init(): void {
    this._initWeekdays();
    this._initWeeks();

    this._changeDetectorRef.markForCheck();
  }

  /** @internal Initialization of weekdays used for rendering. */
  private _initWeekdays(): void {
    const firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
    const shortWeekdays = this._dateAdapter.getDayOfWeekNames('short');
    const longWeekdays = this._dateAdapter.getDayOfWeekNames('long');

    const weekdays = longWeekdays.map((long, i) => ({
      long,
      short: shortWeekdays[i],
    }));
    this._weekdays = weekdays
      .slice(firstDayOfWeek)
      .concat(weekdays.slice(0, firstDayOfWeek));
  }

  /** @internal Initialization of weeks used for rendering. */
  private _initWeeks(): void {
    const daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
    const dateNames = this._dateAdapter.getDateNames();
    const firstOfMonth = this._dateAdapter.createDate(
      this._dateAdapter.getYear(this.activeDate),
      this._dateAdapter.getMonth(this.activeDate),
      1,
    );
    const firstWeekOffset =
      (DAYS_PER_WEEK +
        this._dateAdapter.getDayOfWeek(firstOfMonth) -
        this._dateAdapter.getFirstDayOfWeek()) %
      DAYS_PER_WEEK;

    const weeks: DtCalendarCell<T>[][] = [[]];
    for (let i = 0, cell = firstWeekOffset; i < daysInMonth; i++, cell++) {
      if (cell == DAYS_PER_WEEK) {
        weeks.push([]);
        cell = 0;
      }
      const date = this._dateAdapter.createDate(
        this._dateAdapter.getYear(this.activeDate),
        this._dateAdapter.getMonth(this.activeDate),
        i + 1,
      );

      weeks[weeks.length - 1].push({
        value: i + 1,
        displayValue: dateNames[i],
        rawValue: date,
        ariaLabel: this._dateAdapter.format(date, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      });
    }
    this._weeks = weeks;
    this._firstRowOffset =
      weeks && weeks.length && weeks[0].length
        ? DAYS_PER_WEEK - weeks[0].length
        : 0;
  }

  /** @internal Emits selected changes. */
  private _selectActiveDate(): void {
    if (!this.dateFilter || this.dateFilter(this._activeDate)) {
      this.selectedChange.emit(this._activeDate);
    }
  }

  /** @internal Selects the active date and emits it */
  private _setActiveDateAndEmit(date: T): void {
    if (this._dateAdapter.compareDate(date, this.activeDate)) {
      this.activeDate = date;
      this.activeDateChange.emit(this.activeDate);
    }
  }
}
