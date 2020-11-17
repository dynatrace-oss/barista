/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  BACKSPACE,
  DELETE,
  ENTER,
  ESCAPE,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import {
  fromEvent,
  merge,
  Observable,
  of as observableOf,
  ReplaySubject,
  Subject,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  startWith,
  switchMap,
  take,
  takeUntil,
  map,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';

import {
  DtAutocomplete,
  DtAutocompleteSelectedEvent,
  DtAutocompleteTrigger,
} from '@dynatrace/barista-components/autocomplete';
import {
  CanDisable,
  DT_ERROR_ENTER_ANIMATION,
  DT_ERROR_ENTER_DELAYED_ANIMATION,
  ErrorStateMatcher,
  isDefined,
  _readKeyCode,
} from '@dynatrace/barista-components/core';

import { DtFilterFieldDataSource } from './filter-field-data-source';
import {
  getDtFilterFieldApplyFilterNoRootDataProvidedError,
  getDtFilterFieldApplyFilterParseError,
} from './filter-field-errors';
import {
  DtFilterFieldRange,
  DtFilterFieldRangeOperator,
  DtFilterFieldRangeSubmittedEvent,
} from './filter-field-range/filter-field-range';
import { DtFilterFieldRangeTrigger } from './filter-field-range/filter-field-range-trigger';
import { DtFilterFieldTag } from './filter-field-tag/filter-field-tag';
import {
  applyDtOptionIds,
  filterAutocompleteDef,
  filterFreeTextDef,
  findFilterValuesForSources,
  isDtAutocompleteValueEqual,
  isDtFreeTextValueEqual,
  isDtRangeValueEqual,
  peekOptionId,
} from './filter-field-util';
import { DtFilterFieldControl } from './filter-field-validation';
import {
  DtAutocompleteValue,
  DtFilterFieldTagData,
  DtFilterValue,
  DtNodeDef,
  _getSourcesOfDtFilterValues,
  isAsyncDtAutocompleteDef,
  isDtAutocompleteDef,
  isDtAutocompleteValue,
  isDtFreeTextDef,
  isDtFreeTextValue,
  isDtOptionDef,
  isDtRangeDef,
  isDtRangeValue,
  isPartialDtAutocompleteDef,
  DtOptionDef,
} from './types';
import {
  DT_FILTER_VALUES_PARSER_CONFIG,
  DT_FILTER_VALUES_DEFAULT_PARSER_CONFIG,
  TagParserFunction,
} from './filter-field-config';

// tslint:disable:no-any

export class DtFilterFieldChangeEvent<T> {
  constructor(
    public source: DtFilterField<T>,
    /** Filter data objects added */
    public added: T[][],
    /** Filter data objects removed. */
    public removed: T[][],
    /** Current state of filter data objects. */
    public filters: T[][],
  ) {}
}

export class DtFilterFieldCurrentFilterChangeEvent<T> {
  constructor(
    public source: DtFilterField<T>,
    public added: T[],
    public removed: T[],
    public currentFilter: T[],
    public filters: T[][],
  ) {}
}

export const DT_FILTER_FIELD_TYPING_DEBOUNCE = 200;

// We need to save the instance of the filterField that currently
// has a flap open, to make sure we can close the old one.
let currentlyOpenFilterField: DtFilterField<any> | null = null;

@Component({
  selector: 'dt-filter-field',
  exportAs: 'dtFilterField',
  templateUrl: 'filter-field.html',
  styleUrls: ['filter-field.scss'],
  host: {
    class: 'dt-filter-field',
    '[class.dt-filter-field-disabled]': 'disabled',
    '(click)': '_handleHostClick($event)',
  },
  inputs: ['disabled'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('transitionErrors', [
      state('enter', style({ opacity: 1, transform: 'scaleY(1)' })),
      transition('void => enter', [useAnimation(DT_ERROR_ENTER_ANIMATION)]),
      transition('void => enter-delayed', [
        useAnimation(DT_ERROR_ENTER_DELAYED_ANIMATION),
      ]),
    ]),
  ],
})
export class DtFilterField<T = any>
  implements CanDisable, OnInit, AfterViewInit, OnDestroy, OnChanges {
  /** Label for the filter field (e.g. "Filter by"). Will be placed next to the filter icon. */
  @Input() label = '';

  /** Label for the "Clear all" button in the filter field (e.g. "Clear all"). */
  @Input() clearAllLabel = '';

  /** An object used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;

  /** A function to override the default or injected configuration for tag parsing */
  @Input()
  get customTagParser(): TagParserFunction | null {
    return this._customTagParser;
  }
  set customTagParser(value: TagParserFunction | null) {
    this._customTagParser = value;

    if (value !== null) {
      this.tagValuesParser = value;
    }

    this._updateTagData();
    this._changeDetectorRef.markForCheck();
  }
  private _customTagParser: TagParserFunction | null = null;

  /** The data source instance that should be connected to the filter field. */
  @Input()
  get dataSource(): DtFilterFieldDataSource<T> {
    return this._dataSource;
  }
  set dataSource(dataSource: DtFilterFieldDataSource<T>) {
    if (this._dataSource !== dataSource) {
      this._switchDataSource(dataSource);
    }
  }
  private _dataSource: DtFilterFieldDataSource<T>;
  private _dataSubscription: Subscription | null;
  private _stateChanges = new Subject<void>();
  private _outsideClickSubscription: Subscription | null;

  /**
   * Locks the inputfield from receiving additional keyEvents
   * to prevent race conditions between the autocomplete and
   * filterfield handlers.
   */
  private _inputFieldKeyboardLocked = false;

  /**
   * Whether a loading spinner should be shown or not.
   * This will be automatically set if you provide set async to true via the data source.
   */
  @Input()
  get loading(): boolean {
    return this._loading;
  }
  set loading(value: boolean) {
    this._loading = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  private _loading = false;

  /** Currently applied filters */
  @Input()
  get filters(): any[][] {
    return this._filters.map((values) => _getSourcesOfDtFilterValues(values));
  }
  set filters(value: any[][]) {
    this._tryApplyFilters(value);
    this._changeDetectorRef.markForCheck();
  }
  /** @internal */
  get _filterValues(): DtFilterValue[][] {
    return this._filters;
  }
  private _filters: DtFilterValue[][] = [];

  /** Set the Aria-Label attribute */
  @Input('aria-label') ariaLabel = '';

  /** Whether the filter field is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    const coerced = coerceBooleanProperty(value);
    if (coerced !== this._disabled) {
      this._disabled = coerced;

      if (!this._tags || this._tags.length === 0) {
        return;
      }

      if (this._disabled) {
        this._closeFilterPanels();

        this._tags.forEach((item) => {
          this._previousTagDisabledState.set(item, item.disabled);
          item.disabled = this._disabled;
        });
      } else {
        this._tags.forEach(
          (item) =>
            (item.disabled = !!this._previousTagDisabledState.get(item)),
        );
      }

      this._changeDetectorRef.markForCheck();
    }
  }
  private _disabled = false;
  private _previousTagDisabledState: Map<DtFilterFieldTag, boolean> = new Map<
    DtFilterFieldTag,
    boolean
  >();

  /** Emits an event with the current value of the input field every time the user types. */
  @Output() readonly inputChange = new EventEmitter<string>();

  /** Emits when a new filter has been added or removed. */
  @Output() readonly filterChanges = new EventEmitter<
    DtFilterFieldChangeEvent<T>
  >();

  /** Emits when a part has been added to the currently active filter. */
  @Output() readonly currentFilterChanges = new EventEmitter<
    DtFilterFieldCurrentFilterChangeEvent<T>
  >();

  /**
   * List of tags that are the visual representation for selected nodes.
   * This can be used to disable certain tags or change their labeling.
   */
  @ViewChildren(DtFilterFieldTag) private _tags: QueryList<DtFilterFieldTag>;

  /** @internal List of current tags in the filter field */
  private _currentTags = new ReplaySubject<DtFilterFieldTag[]>(1);

  /**
   * List of tags that are the visual representation for selected nodes.
   * This can be used to disable certain tags or change their labeling.
   */
  currentTags: Observable<DtFilterFieldTag[]> = this._currentTags.pipe(
    // this needs to be deferred to the next cycle to avoid expressionChangedAfterChecked errors
    // when the consumer sets disabled, editable or deletable on the tag instances
    delay(0),
  );

  /** @internal Reference to the internal input element */
  @ViewChild('input', { static: true }) _inputEl: ElementRef;

  /** @internal The autocomplete trigger that is placed on the input element */
  @ViewChild(DtAutocompleteTrigger, { static: true })
  _autocompleteTrigger: DtAutocompleteTrigger<DtNodeDef>;

  /** @internal The range trigger that is placed on the input element */
  @ViewChild(DtFilterFieldRange, { static: true })
  _filterfieldRange: DtFilterFieldRange;

  /** @internal The range trigger that is placed on the input element */
  @ViewChild(DtFilterFieldRangeTrigger, { static: true })
  _filterfieldRangeTrigger: DtFilterFieldRangeTrigger;

  /** @internal Querylist of the autocompletes provided by ng-content */
  @ViewChild(DtAutocomplete, { static: true }) _autocomplete: DtAutocomplete<
    DtNodeDef
  >;

  /** @internal List of sources of the filter that the user currently works on. */
  _currentFilterValues: DtFilterValue[] = [];

  /**
   * @internal
   * The root NodeDef.
   * The filter field will always switch to this def once the user completes a filter.
   */
  _rootDef: DtNodeDef | null = null;

  /**
   * @internal
   * The NodeDefs of the asynchronously loaded data.
   * The key represents the Def that triggered the async loading,
   * the value is the Def of the loaded data.
   */
  _asyncDefs = new Map<DtNodeDef, DtNodeDef>();

  /** @internal The current NodeDef that will be displayed (autocomplete, free-text, ...) */
  _currentDef: DtNodeDef | null = null;

  /** @internal Holds the list of options and groups for displaying it in the autocomplete */
  _autocompleteOptionsOrGroups: DtNodeDef[] = [];

  /** @internal Filter nodes to be rendered _before_ the input element. */
  _prefixTagData: DtFilterFieldTagData[] = [];

  /** @internal Filter nodes to be rendered _after_ the input element. */
  _suffixTagData: DtFilterFieldTagData[] = [];

  /** Holds all tagdata including the data for a tag that might be edited */
  tagData: DtFilterFieldTagData[] = [];

  /**
   * @internal
   * Holds the view value of the filter by label.
   * Will be set when the first part of a filter has been selected.
   */
  _filterByLabel = '';

  /** @internal Value of the input element. */
  _inputValue = '';

  /**
   * @internal
   * Virtual control that acts like a form control and
   * manages the validations and values.
   */
  _control: DtFilterFieldControl | null = null;

  /**
   * @internal
   * Holds the validation errors of the current free text input field
   */
  _errors: string[] = [];

  /** @internal Whether the clear all button is shown. */
  get _showClearAll(): boolean {
    return Boolean(
      // If the filterfield itself is disabled, don't show the clear all
      !this._disabled &&
        // Show button only if we are not in the edit mode
        this._rootDef === this._currentDef &&
        // and only if there are actual filters that can be cleared
        this._filters.length &&
        // The button should also only be visible if the filter field is not focused
        !this._isFocused &&
        // and as the filter field can not be focused but a panel
        // from the autocomplete or range can be open,
        // we also need to check for those.
        !this._autocomplete.isOpen &&
        !this._filterfieldRange.isOpen &&
        // A label has to be provided to show the button.
        this.clearAllLabel,
    );
  }

  /** Emits whenever the component is destroyed. */
  private readonly _destroy$ = new Subject<void>();

  /** Member value that holds the previous filter values, to reset them if edit-mode is cancelled. */
  private _editModeStashedValue: DtFilterValue[] | null;

  /** Whether the filter field or one of it's child elements is focused. */
  private _isFocused = false;

  /** A subject that emits every time the input is reset */
  private _inputReset$ = new Subject<void>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _zone: NgZone,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef,
    defaultErrorStateMatcher: ErrorStateMatcher,
    // tslint:disable-next-line:no-any
    @Optional()
    @Inject(DOCUMENT)
    private _document: any,
    @Optional()
    @Inject(DT_FILTER_VALUES_PARSER_CONFIG)
    private tagValuesParser: TagParserFunction,
  ) {
    this.tagValuesParser =
      this.tagValuesParser || DT_FILTER_VALUES_DEFAULT_PARSER_CONFIG;
    this.errorStateMatcher = defaultErrorStateMatcher;
    this._stateChanges
      .pipe(
        switchMap(() => this._zone.onMicrotaskEmpty.pipe(take(1))),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        // Unlocking the input field again. It is now ready to receive
        // keyboard events again. The locking mechanism is necessary to prevent
        // races between the filter field keyboardEvent handler and the autocomplete
        // keyboardEvent handler.
        this._inputFieldKeyboardLocked = false;
        if (this._isFocused) {
          if (
            isDtAutocompleteDef(this._currentDef) ||
            (isDtFreeTextDef(this._currentDef) &&
              this._currentDef.freeText.suggestions.length)
          ) {
            // When the autocomplete closes after the user has selected an option
            // and the new data is also displayed in an autocomplete we need to open it again.
            // When the next selection is a FreeTextDef and it has suggestions, we also need to
            // show the panel again.
            // Note: Also trigger openPanel if it already open, so it does a reposition and resize
            this._autocompleteTrigger.openPanel();
            // If a range is currently open but an autocomplete should be shown
            // we need to close the range panel again.
            if (this._filterfieldRange.isOpen) {
              this._filterfieldRangeTrigger.closePanel();
            }
          } else if (isDtRangeDef(this._currentDef)) {
            this._filterfieldRangeTrigger.openPanel();
            this._filterfieldRangeTrigger.range.focus();
            // need to return here, otherwise the focus would jump back into the filter field
            return;
          }
          // It is necessary to restore the focus back to the input field
          // so the user can directly continue creating more filter nodes.
          // This be done once all micro-tasks have been completed (the zone is stable)
          // and the rendering has been finished.
          this.focus();
        }
      });
  }

  ngOnInit(): void {
    // If a custom parser is set in the input, prioritize the input one over the
    // privided or default one.
    if (this.customTagParser) {
      this.tagValuesParser = this.customTagParser;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.label) {
      this._stateChanges.next();
    }
  }

  ngAfterViewInit(): void {
    // Monitoring the host element and every focusable child element on focus an blur events.
    // This is necessary so we can detect and restore focus after the input type has been changed.
    this._focusMonitor
      .monitor(this._elementRef.nativeElement, true)
      .pipe(takeUntil(this._destroy$))
      .subscribe((origin) => {
        // The focusMonitor fires on focus and on blur, that is why we need the check
        // if the currentlyOpenFilterfield is not the one that is currently being
        // focused.
        if (
          currentlyOpenFilterField !== null &&
          currentlyOpenFilterField !== this
        ) {
          currentlyOpenFilterField._closeFilterPanels();
        }
        this._isFocused = isDefined(origin);
        // Assign the currently open filter field when it is focused.
        if (this._isFocused) {
          currentlyOpenFilterField = this;
        }
      });

    // tslint:disable-next-line:no-any
    this._autocomplete.optionSelected
      .pipe(takeUntil(this._destroy$))
      .subscribe((event: DtAutocompleteSelectedEvent<any>) => {
        // Locking keyboardEvents until they are being unlocked again in the next change
        // detection cycle. This is to prevent races between autocomplete and the
        // filterfield keybaord event listeners.
        this._inputFieldKeyboardLocked = true;
        this._handleAutocompleteSelected(event);
      });

    // Using fromEvent instead of an html binding so we get a stream and can easily do a debounce
    merge(
      fromEvent(this._inputEl.nativeElement, 'input').pipe(
        tap(() => (this._inputValue = this._inputEl.nativeElement.value)),
        debounceTime(DT_FILTER_FIELD_TYPING_DEBOUNCE),
      ),
      this._inputReset$.pipe(
        tap(() => (this._inputValue = this._inputEl.nativeElement.value)),
      ),
    )
      .pipe(
        map(() => this._inputValue),
        distinctUntilChanged(),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._handleInputChange();
      });
    this._tags.changes
      .pipe(startWith(null), takeUntil(this._destroy$))
      .subscribe(() => {
        this._currentTags.next(this._tags.toArray());
      });
  }

  ngOnDestroy(): void {
    this._closeFilterPanels();
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
    this._stateChanges.complete();

    if (this._dataSource) {
      this._dataSource.disconnect();
    }

    if (this._dataSubscription) {
      this._dataSubscription.unsubscribe();
      this._dataSubscription = null;
    }

    this._clearOutsideClickSubscription();
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** Focuses the filter-element element. */
  focus(): void {
    // As the host element is not focusable by it's own, we need to focus the internal input element
    if (this._inputEl) {
      this._inputEl.nativeElement.focus();
    }
  }

  /** Returns the DtFilterFieldTag instance if we can find a match */
  getTagForFilter(needle: any[]): DtFilterFieldTag | null {
    if (this._rootDef) {
      const needleFilterValueArr = findFilterValuesForSources(
        needle,
        this._rootDef,
        this._asyncDefs,
        this._dataSource,
      );

      if (needleFilterValueArr) {
        const filterIndex = this._findIndexForFilter(needleFilterValueArr);
        return filterIndex !== -1 ? this._tags.toArray()[filterIndex] : null;
      }
    }
    return null;
  }

  /**
   * @internal
   * Handles the click on the host element. Prevent the event from bubbling up and open the autocomplete, range inputs, ...
   */
  _handleHostClick(event: MouseEvent): void {
    // Stop propagation so it does not bubble up and trigger an outside click
    // of the autocomplete which would close the autocomplete panel immediately
    event.stopImmediatePropagation();

    // This will not only focus the input, it will also trigger the autocomplete to open
    this.focus();
  }

  /** @internal Keep track of the values in the input fields. Write the current value to the _inputValue property */
  _handleInputChange(): void {
    if (this._loading) {
      return;
    }

    const value = this._inputEl.nativeElement.value;
    this._writeControlValue(value);
    this._updateAutocompleteOptionsOrGroups();
    this.inputChange.emit(value);

    this._validateInput();
    this._changeDetectorRef.markForCheck();
  }

  /** @internal */
  _handleInputKeyDown(event: KeyboardEvent): void {
    if (this._loading) {
      return;
    }

    const keyCode = _readKeyCode(event);
    if (keyCode === ENTER) {
      // We need to prevent the default here, in case this filter field
      // is used within a form, we do not want to submit the form at this
      // point.
      event.preventDefault();
    }
    if ([BACKSPACE, DELETE].includes(keyCode) && !this._inputValue.length) {
      if (this._editModeStashedValue && this._currentFilterValues.length) {
        // If an editModeValue is stashed and we are at the first level
        // of the filter, a backspace would delete the currently editing filter.
        // When not in edit mode this will simply remove the uncompleted filter,
        // and the emit function does not emit an incomplete filter.
        // When in the edit mode, the removal of the previously set filter will
        // need to be emitted.
        this._deleteCurrentlyEditingFilter();
      } else if (this._currentFilterValues.length) {
        this._removeFilterAndEmit(this._currentFilterValues);
      } else if (this._prefixTagData.length) {
        this._removeFilterAndEmit(
          this._prefixTagData[this._prefixTagData.length - 1].filterValues,
        );
      }
    } else if (keyCode === ESCAPE || (keyCode === UP_ARROW && event.altKey)) {
      this._closeFilterPanels();
    } else {
      if (this._inputFieldKeyboardLocked) {
        return;
      }
      const value = this._inputEl.nativeElement.value;
      this._writeControlValue(value);
      // Mark the value as dirty and touched to force a validation at this point
      // If the user without typing anything wants to submit the value,
      // the validation needs to run.
      if (this._control) {
        this._control.markAsDirty();
        this._control.markAsTouched();
      }
      this._validateInput();
      if (
        keyCode === ENTER &&
        isDtFreeTextDef(this._currentDef) &&
        this._control &&
        this._control.valid
      ) {
        this._handleFreeTextSubmitted();
      }
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * @internal
   * Handles removing a filter from the filters list.
   * Called when the user clicks on the remove button of a filter tag.
   */
  _handleTagRemove(event: DtFilterFieldTag): void {
    this._removeFilterAndEmit(event.data.filterValues);
    this.focus();
  }

  /**
   * @internal
   * Handles switching a filter to the edit mode.
   * Usually called when the user clicks the edit button of a filter.
   */
  _handleTagEdit(event: DtFilterFieldTag): void {
    // TODO: Editing of tag should be refactored in a later stage.
    if (!this._currentFilterValues.length && event.data.filterValues.length) {
      const value = event.data.filterValues[0];
      if (
        isDtAutocompleteValue(value) &&
        (isDtAutocompleteDef(value) ||
          isDtRangeDef(value) ||
          isDtFreeTextDef(value))
      ) {
        const removed = event.data.filterValues.splice(1);
        // Keep the removed values in the stashed member, to reapply them if necessary.
        this._editModeStashedValue = removed;
        this._listenForEditModeCancellation();
        this._currentFilterValues = event.data.filterValues;
        this._currentDef = value;

        this._updateControl();
        this._updateLoading();
        this._updateAutocompleteOptionsOrGroups();
        // If the currently edited part is a range it should pre-fill the
        // previously set values.
        if (removed.length === 1) {
          // Needed to reassign in order for typescript to understand the type.
          const recentRangeValue = removed[0];
          if (isDtRangeValue(recentRangeValue) && this._currentDef.range) {
            // Needed to set this in typescript, because template binding of input would be evaluated to late.
            this._filterfieldRange.enabledOperators = this._currentDef.range.operatorFlags;
            this._filterfieldRange._setValues(recentRangeValue.range);
            this._filterfieldRange._setOperator(
              recentRangeValue.operator as DtFilterFieldRangeOperator,
            );
          }
        }
        this._updateFilterByLabel();
        this._updateTagData();
        this._isFocused = true;
        this._stateChanges.next();
        this._emitCurrentFilterChanges([], removed);
        this._changeDetectorRef.markForCheck();
      } else {
        this._removeFilterAndEmit(event.data.filterValues);
      }
      this.focus();
    }
  }

  /** @internal Clears all filters and switch to root def. */
  _clearAll(event: Event): void {
    // We need to prevent the default here, in case this filter field
    // is used within a form, we do not want to submit the form at this
    // point.
    event.preventDefault();
    // Only filters that are deletable should be removed
    // We need to aggregate the once that should be removed on the one hand,
    // so we can emit them to the consumer.
    // On the other hand we also need to set the filters array
    // to the ones that remain.
    const { remaining, removed } = this.tagData.reduce(
      (
        aggregator: {
          remaining: DtFilterValue[][];
          removed: DtFilterValue[][];
        },
        data,
      ) => {
        (!data.deletable ? aggregator.remaining : aggregator.removed).push(
          data.filterValues,
        );
        return aggregator;
      },
      { remaining: [], removed: [] },
    );
    this._filters = remaining;
    this._switchToRootDef(false);

    if (removed.length) {
      this._emitFilterChanges([], removed);
    }
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Get the title for an option in case is will overflow */
  _getTitle(optionDef: DtOptionDef): string | null {
    // 42 is an estimation based on the width of a `0` character in the current
    // font-size and how many would fit the option until showing the ellipsis.
    // This might result in showing the title too soon if there are a lot of
    // slim charaters in the value or showing it too lat if there are too many
    // wide characters in the value.
    return optionDef && optionDef.viewValue.length > 42
      ? optionDef.viewValue
      : null;
  }

  /** Returns the index in the filters for the filter values given or -1 if not found */
  private _findIndexForFilter(needleFilterValueArr: DtFilterValue[]): number {
    return this._filters.findIndex((filterValueArr) => {
      // check whether the length is the same, if not we can quit here
      if (filterValueArr.length !== needleFilterValueArr.length) {
        return false;
      }
      let match = true;
      let prefix = '';
      let idx = 0;
      while (idx < filterValueArr.length && match) {
        const filterValue = filterValueArr[idx];
        const needleFilterValue = needleFilterValueArr[idx];
        if (
          (isDtFreeTextValue(filterValue) &&
            isDtFreeTextValue(needleFilterValue) &&
            isDtFreeTextValueEqual(filterValue, needleFilterValue)) ||
          (isDtRangeValue(filterValue) &&
            isDtRangeValue(needleFilterValue) &&
            isDtRangeValueEqual(filterValue, needleFilterValue))
        ) {
          idx++;
          continue;
        }
        if (
          isDtAutocompleteValue(filterValue) &&
          isDtAutocompleteValue(needleFilterValue) &&
          isDtAutocompleteValueEqual(filterValue, needleFilterValue, prefix)
        ) {
          prefix = peekOptionId(filterValue, undefined, true);
          idx++;
          continue;
        }
        // if no
        match = false;
      }
      return match;
    });
  }

  /**
   * Validates the value of a control with the validators that are provided
   * in the control. Sets the error messages if they should be shown according to the
   * error matcher.
   */
  private _validateInput(): void {
    if (this._control) {
      const errors = this._control._validate();

      // if the error state matcher matches we assign the errors from above
      this._errors = this.errorStateMatcher.isErrorState(this._control, null)
        ? errors
        : [];
    }
  }

  /**
   * Creates a subscription that fires once the editMode should be cancelled.
   */
  private _listenForEditModeCancellation(): void {
    this._clearOutsideClickSubscription();
    this._outsideClickSubscription = merge(
      this._getFreeTextOutsideClickStream(),
      this._autocomplete.closed,
      this._filterfieldRange.closed,
    )
      .pipe(filter(() => isDefined(this._editModeStashedValue)))
      .subscribe(() => {
        this._cancelEditMode();
      });
  }

  /** Clear the outside click subscription. */
  private _clearOutsideClickSubscription(): void {
    if (this._outsideClickSubscription) {
      this._outsideClickSubscription.unsubscribe();
      this._outsideClickSubscription = null;
    }
  }

  /**
   * Cancels the edit-mode and resets the filter to the root definition.
   * It resets the currently edited filter back to the stashed value.
   */
  private _cancelEditMode(): void {
    this._clearOutsideClickSubscription();
    // If we have a stashed value, reset the filter to the previous state and make
    // the necessary updates.
    if (this._editModeStashedValue) {
      this._peekCurrentFilterValues().push(...this._editModeStashedValue);
      this._editModeStashedValue = null;
      this._updateFilterByLabel();
      this._updateTagData();
      this._isFocused = false;
      this._writeInputValue('');
      this._switchToRootDef(false);
      this._stateChanges.next();
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * Edge case scenario where the filter is deleted while in edit mode.
   */
  private _deleteCurrentlyEditingFilter(): void {
    if (this._editModeStashedValue) {
      // Concatenate the removable filter again.
      const removableFilter = this._peekCurrentFilterValues();
      removableFilter.push(...this._editModeStashedValue);

      // Reset the edit mode again and switch to the root def
      // for the filters to update.
      this._resetEditMode();
      this._switchToRootDef(false);

      // Remove and emit the filter
      this._removeFilterAndEmit(removableFilter);

      this._stateChanges.next();
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * If any changes to the filter have been made during the edit-mode, the edit-mode should be exited and the
   * usual behavior of writing filters should continue.
   */
  private _resetEditMode(): void {
    this._clearOutsideClickSubscription();
    this._editModeStashedValue = null;
  }

  /** Handles selecting an option from the autocomplete. */
  private _handleAutocompleteSelected(
    event: DtAutocompleteSelectedEvent<DtNodeDef>,
  ): void {
    const optionDef = event.option.value as DtAutocompleteValue<T>;
    this._peekCurrentFilterValues().push(optionDef);
    // Reset input value to empty string after handling the value provided by the autocomplete.
    // Otherwise the value of the autocomplete would be in the input elements and the next options
    // would be filtered by the input value
    this._writeInputValue('');
    if (
      isDtAutocompleteDef(optionDef) ||
      isDtFreeTextDef(optionDef) ||
      isDtRangeDef(optionDef)
    ) {
      this._currentDef = optionDef;
      this._updateControl();
      this._updateLoading();
      this._updateFilterByLabel();
      this._updateAutocompleteOptionsOrGroups();
      this._emitCurrentFilterChanges([optionDef], []);
    } else {
      this._switchToRootDef(true);
    }

    // Clear any previous selected option.
    this._autocomplete._options.forEach((option) => {
      if (option.selected) {
        option.deselect();
      }
    });

    // if any changes happen, cancel the edit-mode.
    this._resetEditMode();

    this._stateChanges.next();
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Handles submitting the free text field.
   * Usually called when the user hits enter in the input field when a free text is set.
   */
  private _handleFreeTextSubmitted(): void {
    const sources = this._peekCurrentFilterValues();
    sources.push(this._inputValue);

    // if any changes happen, cancel the edit-mode.
    this._resetEditMode();

    this._writeInputValue('');
    this._switchToRootDef(true);
    this._stateChanges.next();
    this._changeDetectorRef.markForCheck();
  }

  /** @internal */
  _handleRangeSubmitted(event: DtFilterFieldRangeSubmittedEvent): void {
    this._peekCurrentFilterValues().push({
      operator: event.operator,
      range: event.range,
      unit: event.unit,
    });
    this._filterfieldRangeTrigger.closePanel(false);
    this._isFocused = true;
    this._writeInputValue('');
    this._switchToRootDef(true);

    // if any changes happen, cancel the edit-mode.
    this._resetEditMode();

    this._stateChanges.next();
    this._changeDetectorRef.markForCheck();
  }

  /** Write a value to the native input elements and set _inputValue property  */
  private _writeInputValue(value: string): void {
    // tslint:disable-next-line:no-unused-expression
    this._inputEl && (this._inputEl.nativeElement.value = value);
    if (value === '') {
      this._inputReset$.next();
    }
    if (this._inputValue !== value) {
      this._inputValue = value;
      this._writeControlValue(value);
      this.inputChange.emit(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Write a value to the filter field control if there is a control active */
  private _writeControlValue(value: string): void {
    // Only write the value when it is actually different
    // setting the value to it's old value and marking the control
    // dirty will trigger validation too many times, resulting in a flickering
    // of the validation flag.
    if (this._control && this._control.value !== value) {
      this._control.setValue(value);
      this._control.markAsDirty();
      this._control.markAsTouched();
    }
  }

  /**
   * Returns the currentFilterSources. If no currentFilterSources are available, a new one is created.
   * These sources will also be added to the global list of filters if they are not already part of it.
   */
  private _peekCurrentFilterValues(): DtFilterValue[] {
    let values = this._currentFilterValues;
    if (!values) {
      values = [];
      this._currentFilterValues = values;
    }
    if (this._filters.indexOf(values) === -1) {
      this._filters.push(values);
    }
    return values;
  }

  /**
   * Removes a filter (a list of sources) from the list of current selected ones.
   * It is usually called when the user clicks the remove button of a filter
   */
  private _removeFilterAndEmit(filterValues: DtFilterValue[]): void {
    const removedFilters = this._removeFilter(filterValues);
    if (filterValues.length) {
      if (filterValues === this._currentFilterValues) {
        this._switchToRootDef(false);
        this._emitCurrentFilterChanges([], filterValues);
      } else {
        this._updateTagData();
        this._updateAutocompleteOptionsOrGroups();
        this._emitFilterChanges([], removedFilters);
      }
      this._resetEditMode();
      this._stateChanges.next();
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Removes a filter (a list of sources) from the list of current selected ones. */
  private _removeFilter(filterValues: DtFilterValue[]): DtFilterValue[][] {
    let removedFilters: DtFilterValue[][] = [];
    const removableIndex = this._filters.indexOf(filterValues);
    if (removableIndex !== -1) {
      removedFilters = this._filters.splice(removableIndex, 1);
    }
    return removedFilters;
  }

  /**
   * Emits a DtFilterFieldChangeEvent with a cloned filters array
   * so the consumer can not override it from the outside.
   */
  private _emitFilterChanges(
    added: DtFilterValue[][],
    removed: DtFilterValue[][],
  ): void {
    this.filterChanges.emit(
      new DtFilterFieldChangeEvent(
        this,
        added.map((values) => _getSourcesOfDtFilterValues(values)),
        removed.map((values) => _getSourcesOfDtFilterValues(values)),
        this.filters,
      ),
    );
  }

  private _emitCurrentFilterChanges(
    addedValues: DtFilterValue[],
    removedValues: DtFilterValue[],
  ): void {
    this.currentFilterChanges.emit(
      new DtFilterFieldCurrentFilterChangeEvent(
        this,
        _getSourcesOfDtFilterValues(addedValues),
        _getSourcesOfDtFilterValues(removedValues),
        _getSourcesOfDtFilterValues(this._currentFilterValues),
        this.filters,
      ),
    );
  }

  /** Creates a stream of clicks outside the filter field in free text mode */
  private _getFreeTextOutsideClickStream(): Observable<void> {
    if (!this._document) {
      return observableOf();
    }

    return (merge(
      fromEvent<MouseEvent>(this._document, 'click'),
      fromEvent<TouchEvent>(this._document, 'touchend'),
    ).pipe(
      filter((event: Event) => {
        const clickTarget = event.target as HTMLElement;
        const filterField = this._elementRef.nativeElement;
        return (
          isDtFreeTextDef(this._currentDef) &&
          clickTarget !== filterField &&
          (!filterField || !filterField.contains(clickTarget))
        );
      }),
    ) as any) as Observable<void>;
  }

  /**
   * Takes a new data source and switches the filter date to the provided one.
   * Handles all the disconnecting and data switching.
   */
  private _switchDataSource(dataSource: DtFilterFieldDataSource<T>): void {
    if (this._dataSource) {
      this._dataSource.disconnect();
    }

    if (this._dataSubscription) {
      this._dataSubscription.unsubscribe();
      this._dataSubscription = null;
    }

    this._dataSource = dataSource;

    this._dataSubscription = this._dataSource
      .connect()
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (def) => {
          if (
            (isAsyncDtAutocompleteDef(this._currentDef) ||
              isPartialDtAutocompleteDef(this._currentDef)) &&
            def
          ) {
            this._asyncDefs.set(this._currentDef, def);
            if (
              def &&
              isDtOptionDef(this._currentDef) &&
              this._currentDef.option.uid
            ) {
              applyDtOptionIds(def, this._currentDef.option.uid, true);
            }
          } else {
            if (def) {
              applyDtOptionIds(def);
            }
            this._rootDef = def;
            this._removeFilter(this._currentFilterValues);
            this._currentFilterValues = [];
            this._filterByLabel = '';

            // If the current def is a range during the reset,
            // we need to handle a couple of extra things about the range, i.e.
            // closing it and restoring the focus.
            if (isDtRangeDef(this._currentDef)) {
              if (this._filterfieldRange.isOpen) {
                this._filterfieldRangeTrigger.closePanel();
                this.focus();
              }
            }
          }
          this._currentDef = def;
          this._updateControl();
          this._updateLoading();
          this._updateAutocompleteOptionsOrGroups();
          this._stateChanges.next();
          this._changeDetectorRef.markForCheck();
        },
        (error: Error) => {
          // If parsing the data in the data source fails,
          // we need to throw to notify the developer about the error.
          throw error;
        },
      );
  }

  /**
   * Switches current def back to the root, updates all properties for the view and emits a filter change.
   * Is usually called when the user finishes a filter.
   */
  private _switchToRootDef(shouldEmit: boolean = false): void {
    this._currentDef = this._rootDef;
    this._filterByLabel = '';
    this._updateControl();
    this._updateLoading();
    this._updateAutocompleteOptionsOrGroups();
    const currentFilterValues = this._currentFilterValues;
    this._currentFilterValues = [];
    if (shouldEmit && currentFilterValues.length) {
      this._emitFilterChanges([currentFilterValues], []);
    }
    this._updateTagData();
  }

  /**
   * If the currentDef is a free text node it initializes a virtual FilterFieldControl
   * that handles the validation of the value
   */
  private _updateControl(): void {
    if (isDtFreeTextDef(this._currentDef)) {
      this._control = new DtFilterFieldControl(
        this._currentDef.freeText.validators,
      );
    } else {
      this._control = null;
      this._errors = [];
    }
  }

  /** Updates prefix and suffix tag data for displaying filter tags. */
  private _updateTagData(): void {
    if (this._rootDef) {
      const splitIndex = this._filters.indexOf(this._currentFilterValues);
      const tags = this._filters.map((values, i) => {
        let prevData: DtFilterFieldTagData | undefined;
        if (this.tagData.length) {
          prevData = this.tagData[i];
        }
        return (
          this.tagValuesParser(
            values,
            prevData && prevData.editable,
            prevData && prevData.deletable,
          ) ||
          this.tagData[i] ||
          null
        );
      });
      this.tagData = tags;

      this._prefixTagData = this.tagData
        .slice(0, this._currentFilterValues.length ? splitIndex : undefined)
        .filter((tag: DtFilterFieldTagData | null) => tag !== null);

      this._suffixTagData = this._currentFilterValues.length
        ? this.tagData
            .slice(this._filters.indexOf(this._currentFilterValues) + 1)
            .filter((tag: DtFilterFieldTagData | null) => tag !== null)
        : [];
    }
  }

  /** Updates the list of options or groups displayed in the autocomplete overlay */
  private _updateAutocompleteOptionsOrGroups(): void {
    const currentDef = this._currentDef;

    if (
      isDtAutocompleteDef(currentDef) &&
      !isAsyncDtAutocompleteDef(currentDef)
    ) {
      const def = filterAutocompleteDef(
        currentDef,
        this._getSelectedOptionIds(),
        this._inputValue,
      );
      this._autocompleteOptionsOrGroups = def
        ? def.autocomplete!.optionsOrGroups
        : [];
    } else if (isDtFreeTextDef(currentDef)) {
      const def = filterFreeTextDef(currentDef, this._inputValue);
      this._autocompleteOptionsOrGroups = def ? def.freeText!.suggestions : [];
    } else {
      this._autocompleteOptionsOrGroups = [];
    }
  }

  /** Updates the filterByLabel with the view value of the first currently active filter source. */
  private _updateFilterByLabel(): void {
    const currentFilterNodeDefsOrSources = this._currentFilterValues;
    if (
      currentFilterNodeDefsOrSources &&
      currentFilterNodeDefsOrSources.length
    ) {
      const def = currentFilterNodeDefsOrSources[0] as DtAutocompleteValue<T>;
      if (isDtOptionDef(def)) {
        this._filterByLabel = def.option.viewValue;
      }
    }
  }

  private _updateLoading(): void {
    this._loading = isAsyncDtAutocompleteDef(this._currentDef);
  }

  private _getSelectedOptionIds(): Set<string> {
    const ids = new Set<string>();
    for (const currentFilter of this._filters) {
      let currentId = '';
      for (const value of currentFilter) {
        if (isDtAutocompleteValue(value)) {
          const id = peekOptionId(value, currentId);
          ids.add(id);
          currentId = id;
        }
      }
    }
    return ids;
  }

  private _tryApplyFilters(filters: any[][]): void {
    this._filters = filters.map((sources) => {
      if (this._rootDef) {
        const values = findFilterValuesForSources(
          sources,
          this._rootDef,
          this._asyncDefs,
          this._dataSource,
        );
        if (values === null) {
          throw getDtFilterFieldApplyFilterParseError();
        }
        return values;
      }
      throw getDtFilterFieldApplyFilterNoRootDataProvidedError();
    });
    this._switchToRootDef(false);
  }

  private _closeFilterPanels(): void {
    this._autocompleteTrigger.closePanel();
    this._filterfieldRangeTrigger.closePanel();
    if (this._editModeStashedValue) {
      this._cancelEditMode();
    }
    if (currentlyOpenFilterField === this) {
      currentlyOpenFilterField = null;
    }
  }
}
// tslint:disable:max-file-line-count
