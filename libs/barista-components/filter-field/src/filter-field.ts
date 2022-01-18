/**
 * @license
 * Copyright 2022 Dynatrace LLC
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
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  BACKSPACE,
  DELETE,
  ENTER,
  ESCAPE,
  LEFT_ARROW,
  SPACE,
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
  OnInit,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {
  DtAutocomplete,
  DtAutocompleteSelectedEvent,
  DtAutocompleteTrigger,
} from '@dynatrace/barista-components/autocomplete';
import {
  _readKeyCode,
  CanDisable,
  DT_ERROR_ENTER_ANIMATION,
  DT_ERROR_ENTER_DELAYED_ANIMATION,
  ErrorStateMatcher,
  isDefined,
} from '@dynatrace/barista-components/core';
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
  delay,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {
  DT_FILTER_EDITION_VALUES_DEFAULT_PARSER_CONFIG,
  DT_FILTER_EDITION_VALUES_PARSER_CONFIG,
  DT_FILTER_FIELD_CONFIG,
  DT_FILTER_FIELD_DEFAULT_CONFIG,
  DT_FILTER_VALUES_DEFAULT_PARSER_CONFIG,
  DT_FILTER_VALUES_PARSER_CONFIG,
  DtFilterFieldConfig,
  EditionParserFunction,
  TagParserFunction,
} from './filter-field-config';
import { DtFilterFieldDataSource } from './filter-field-data-source';
import {
  getDtFilterFieldApplyFilterNoRootDataProvidedError,
  getDtFilterFieldApplyFilterParseError,
} from './filter-field-errors';
import {
  DtFilterFieldMultiSelect,
  DtFilterFieldMultiSelectSubmittedEvent,
} from './filter-field-multi-select/filter-field-multi-select';
import { DtFilterFieldMultiSelectTrigger } from './filter-field-multi-select/filter-field-multi-select-trigger';
import {
  DtFilterFieldRange,
  DtFilterFieldRangeOperator,
  DtFilterFieldRangeSubmittedEvent,
} from './filter-field-range/filter-field-range';
import { DtFilterFieldRangeTrigger } from './filter-field-range/filter-field-range-trigger';
import { DtFilterFieldTag } from './filter-field-tag/filter-field-tag';
import {
  applyDtOptionIds,
  defUniquePredicate,
  filterAutocompleteDef,
  filterFreeTextDef,
  filterMultiSelectDef,
  findDefaultSearch,
  findFilterValuesForSources,
  isDtAutocompleteValueEqual,
  isDtFreeTextValueEqual,
  isDtRangeValueEqual,
  peekOptionId,
} from './filter-field-util';
import { DtFilterFieldControl } from './filter-field-validation';
import {
  _getSourcesOfDtFilterValues,
  DefaultSearchOption,
  DtAutocompleteValue,
  DtFilterFieldTagData,
  DtFilterValue,
  DtFreeTextDef,
  DtNodeDef,
  DtOptionDef,
  isAsyncDtAutocompleteDef,
  isAsyncDtFreeTextDef,
  isAsyncDtMultiSelectDef,
  isAsyncDtOptionDef,
  isDefaultSearchOption,
  isDtAutocompleteDef,
  isDtAutocompleteValue,
  isDtFreeTextDef,
  isDtFreeTextValue,
  isDtMultiSelectDef,
  isDtMultiSelectValue,
  isDtOptionDef,
  isDtRangeDef,
  isDtRangeValue,
  isPartialDtOptionDef,
} from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

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
  implements CanDisable, OnInit, AfterViewInit, OnDestroy, OnChanges
{
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

  /** A function to override the default or injected configuration for edition parsing text */

  @Input()
  get customEditionParser(): EditionParserFunction | null {
    return this._customEditionParser;
  }
  set customEditionParser(value: EditionParserFunction | null) {
    this._customEditionParser = value;

    if (value !== null) {
      this.editionValuesParser = value;
    }

    this._updateEditionData();
    this._changeDetectorRef.markForCheck();
  }

  private _customTagParser: TagParserFunction | null = null;
  private _customEditionParser: EditionParserFunction | null = null;

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
  static ngAcceptInputType_loading: BooleanInput;

  /** Currently applied filters */
  @Input()
  get filters(): any[][] {
    return this._filterValues.map((values) =>
      _getSourcesOfDtFilterValues(values),
    );
  }
  set filters(value: any[][]) {
    this._tryApplyFilters(value);
    this._changeDetectorRef.markForCheck();
  }
  /** @internal */
  get _filterValues(): DtFilterValue[][] {
    const currentSources = _getSourcesOfDtFilterValues(
      this._currentFilterValues,
    );
    // Only filters that are completed should be part oft the filters API.
    // Filter out the incomplete ones (filters that are currently edited by the user).
    return this._filters.filter((f) =>
      _getSourcesOfDtFilterValues(f).every((v, i) => v !== currentSources[i]),
    );
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
      }

      for (const tag of this._tags) {
        if (this._disabled) {
          this._previousTagDisabledState.set(tag, tag.disabled);
          tag.disabled = this._disabled;
        } else {
          tag.disabled = !!this._previousTagDisabledState.get(tag);
        }
      }

      this._changeDetectorRef.markForCheck();
    }
  }
  private _disabled = false;
  static ngAcceptInputType_disabled: BooleanInput;

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

  /** Emits the interaction-state (whether the filter-field is being interacted with or not) */
  @Output() readonly interactionStateChange = new EventEmitter<boolean>();

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

  /** Whether the filter-field is being interacted with */
  interactionState = false;

  /** @internal Reference to the internal input element */
  @ViewChild('input', { static: true }) _inputEl: ElementRef;

  /** @internal The autocomplete trigger that is placed on the input element */
  @ViewChild(DtAutocompleteTrigger, { static: true })
  _autocompleteTrigger: DtAutocompleteTrigger<DtNodeDef>;

  /** @internal The range input element */
  @ViewChild(DtFilterFieldRange, { static: true })
  _filterfieldRange: DtFilterFieldRange;

  /** @internal The range trigger that is placed on the input element */
  @ViewChild(DtFilterFieldRangeTrigger, { static: true })
  _filterfieldRangeTrigger: DtFilterFieldRangeTrigger;

  /** @internal The multi select input element */
  @ViewChild(DtFilterFieldMultiSelect, { static: true })
  _multiSelect: DtFilterFieldMultiSelect<DtNodeDef>;

  /** @internal The multis select that is placed on the input element */
  @ViewChild(DtFilterFieldMultiSelectTrigger, { static: true })
  _multiSelectTrigger: DtFilterFieldMultiSelectTrigger<DtNodeDef>;

  /** @internal Querylist of the autocompletes provided by ng-content */
  @ViewChild(DtAutocomplete, { static: true })
  _autocomplete: DtAutocomplete<DtNodeDef>;

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

  /** @internal Holds the list of options and groups for displaying it in the multiSelect */
  _multiSelectOptionsOrGroups: DtNodeDef[] = [];

  /** @internal Filter nodes to be rendered _before_ the input element. */
  _prefixTagData: DtFilterFieldTagData[] = [];

  /** @internal Filter nodes to be rendered _after_ the input element. */
  _suffixTagData: DtFilterFieldTagData[] = [];

  /** Holds all tagdata including the data for a tag that might be edited */
  tagData: DtFilterFieldTagData[] = [];

  /** @internal Holds the default search node */
  _defaultSearchDef:
    | (DtNodeDef<unknown> & {
        freeText: DtFreeTextDef<unknown>;
        option: DtOptionDef;
      })
    | null = null;

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
        !this._multiSelect.isOpen &&
        // A label has to be provided to show the button.
        this.clearAllLabel,
    );
  }

  /** Whether we are currently in the edit mode of a filter */
  get _isInFilterEditMode(): boolean {
    return this._currentDef !== null && this._currentDef !== this._rootDef;
  }

  /** Emits whenever the component is destroyed. */
  private readonly _destroy$ = new Subject<void>();

  /** Member value that holds the previous filter values, to reset them if edit-mode is cancelled. */
  private _editModeStashedValue: DtFilterValue[] | null;

  /** Whether the filter field or one of it's child elements is focused. */
  private _isFocused = false;

  /** Whether to allow focusing the tags when navigating in the input element using arrow keys */
  private _allowArrowKeyFocusOnTags = false;

  private _currentFocusState: 'none' | 'input' | 'inputboundary' = 'none';

  private _currentlyFocusedTag:
    | 'none'
    | 'editButton'
    | 'deleteButton'
    | 'last'
    | 'first' = 'none';

  /** Merges the autocomplete and range opened events */
  private _mergedAutocompleteRangeOpened: Observable<unknown>;

  /** Merges the autocomplete and range closed events */
  private _mergedAutocompleteRangeClosed: Observable<unknown>;

  /** A subject that emits every time the input is reset */
  private _inputReset$ = new Subject<void>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _zone: NgZone,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef,
    defaultErrorStateMatcher: ErrorStateMatcher,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Optional()
    @Inject(DOCUMENT)
    private _document: any,
    @Optional()
    @Inject(DT_FILTER_VALUES_PARSER_CONFIG)
    private tagValuesParser: TagParserFunction,
    @Optional()
    @Inject(DT_FILTER_EDITION_VALUES_PARSER_CONFIG)
    private editionValuesParser: EditionParserFunction,
    @Optional()
    @Inject(DT_FILTER_FIELD_CONFIG)
    readonly _filterFieldConfig: DtFilterFieldConfig,
  ) {
    this._filterFieldConfig =
      this._filterFieldConfig || DT_FILTER_FIELD_DEFAULT_CONFIG;

    this.tagValuesParser =
      this.tagValuesParser || DT_FILTER_VALUES_DEFAULT_PARSER_CONFIG;

    this.editionValuesParser =
      this.editionValuesParser ||
      DT_FILTER_EDITION_VALUES_DEFAULT_PARSER_CONFIG;

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
            this._filterfieldRangeTrigger.element.focus();
            // need to return here, otherwise the focus would jump back into the filter field
            return;
          } else if (isDtMultiSelectDef(this._currentDef)) {
            this._multiSelectTrigger.openPanel();
            this._multiSelectTrigger.element.focus();
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
    // provided or default one.
    if (this.customTagParser) {
      this.tagValuesParser = this.customTagParser;
    }

    this._mergedAutocompleteRangeOpened = merge(
      this._filterfieldRange.opened,
      this._autocomplete.opened,
    );

    this._mergedAutocompleteRangeClosed = merge(
      this._filterfieldRange.closed,
      this._autocomplete.closed,
    );

    this._mergedAutocompleteRangeOpened
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._checkInteractionStateChanged(true);
      });

    this._mergedAutocompleteRangeClosed
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        if (this._isFocused) {
          this._checkInteractionStateChanged(true);
        }
        this._checkInteractionStateChanged(false);
      });
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
        // When the filterfield loses focus, we need to check if it was focused before
        // and manage the interaction state
        this._checkInteractionStateChanged(this._isFocused);

        // Assign the currently open filter field when it is focused.
        if (this._isFocused) {
          currentlyOpenFilterField = this;
        }
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._autocomplete.optionSelected
      .pipe(takeUntil(this._destroy$))
      .subscribe((event: DtAutocompleteSelectedEvent<any>) => {
        // Locking keyboardEvents until they are being unlocked again in the next change
        // detection cycle. This is to prevent races between autocomplete and the
        // filterfield keybaord event listeners.
        this._inputFieldKeyboardLocked = true;
        this._handleAutocompleteSelected(event);
      });

    merge(
      fromEvent(this._inputEl.nativeElement, 'input').pipe(
        tap(() => (this._inputValue = this._inputEl.nativeElement.value)),
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
    this._updateDefaultSearchDef();
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
    this._updateDefaultSearchDef();
    this.inputChange.emit(value);

    this._validateInput();
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Handles keydown on the input */
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
    } else if (isDtMultiSelectDef(this._currentDef) && keyCode === SPACE) {
      event.preventDefault();
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

  /** @internal Handles keyup on the input */
  _handleInputKeyUp(event: KeyboardEvent): void {
    const keyCode = _readKeyCode(event);
    this._getCurrentFocusState();

    if (
      !this._tags.length ||
      this._currentFocusState !== 'inputboundary' ||
      keyCode !== LEFT_ARROW
    ) {
      return;
    }

    // The input element moves the cursor on keydown but the navigation with arrow keys is on keyup,
    // causing the cursor to jump over position 0 in the input and focuses the first focusable tag element.
    // For that, allowArrowKeyFocusOnTags retains getting to position 0 before focusing a tag element.
    if (this._allowArrowKeyFocusOnTags || !this._inputValue.length) {
      this._handleArrowKeyNavigation({ direction: 'left' });
    } else {
      this._allowArrowKeyFocusOnTags = this._getAllowArrowKeyFocusOnTags();
    }
  }

  /** @internal Handles the navigation through the list of tags when using arrow keys */
  _handleArrowKeyNavigation(navigationEvent: {
    /** Contains the currently focused tag from which the event was fired from */
    currentTag?: DtFilterFieldTag;
    /** Whether to step back */
    direction: 'left' | 'right';
  }): void {
    const { currentTag, direction } = navigationEvent;

    // Step focus out of input element and into tag list and early exit
    if (currentTag === undefined) {
      this._getFirstTagFromInput(direction)?.nativeElement.focus();
      return;
    }

    const focusedTagIndex = this._tags
      .toArray()
      .findIndex((tag) => tag.editButton === currentTag?.editButton);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._getCurrentlyFocusedTagType(currentTag!);

    if (direction === 'left') {
      this._findPreviousTagDefaultMode(
        currentTag,
        focusedTagIndex,
      )?.nativeElement.focus();
    } else if (direction === 'right') {
      this._findNextTagDefaultMode(
        currentTag,
        focusedTagIndex,
      )?.nativeElement.focus();
    }
  }

  /**
   * @internal Moves the focus from the input to an available tag
   */
  private _getFirstTagFromInput(
    direction: string,
  ): ElementRef<HTMLElement> | undefined {
    const toPreviousTag =
      this._currentFocusState === 'inputboundary' &&
      direction === 'left' &&
      this._prefixTagData.length;

    if (toPreviousTag) {
      return this._getNextFocusableTagButton(
        this._tags.toArray()[this._prefixTagData.length - 1],
        true,
      );
    }
  }

  /** @internal Finds the previous tag in default mode */
  private _findPreviousTagDefaultMode(
    currentTag: DtFilterFieldTag,
    focusedTagIndex: number,
  ): ElementRef<HTMLElement> | undefined {
    const toEditButton =
      this._currentlyFocusedTag === 'deleteButton' ||
      (this._currentlyFocusedTag === 'last' &&
        this._hasDeleteButton(currentTag));
    const toPreviousFocusableTag =
      (this._currentlyFocusedTag !== 'first' &&
        this._currentlyFocusedTag === 'editButton') ||
      this._currentlyFocusedTag === 'last';

    if (toEditButton) {
      return currentTag.editButton;
    } else if (toPreviousFocusableTag) {
      return this._getNextFocusableTagButton(
        this._tags.toArray()[focusedTagIndex - 1],
        true,
      );
    }
  }

  /** @internal Finds the next (subsequent) tag or input in default mode. */
  private _findNextTagDefaultMode(
    currentTag: DtFilterFieldTag,
    focusedTagIndex: number,
  ): ElementRef<HTMLElement> | undefined {
    const toInputElement =
      this._currentlyFocusedTag === 'last' ||
      (this._currentlyFocusedTag === 'first' &&
        this._tags.length === 1 &&
        !this._hasDeleteButton(currentTag));
    const toDeleteButton =
      (this._currentlyFocusedTag === 'editButton' ||
        this._currentlyFocusedTag === 'first') &&
      this._hasDeleteButton(currentTag);
    const toNextFocusableTag =
      this._currentlyFocusedTag === 'editButton' ||
      this._currentlyFocusedTag === 'deleteButton' ||
      this._currentlyFocusedTag === 'first';

    if (toInputElement) {
      this._currentFocusState = 'input';
      return this._inputEl;
    } else if (toDeleteButton) {
      return currentTag?.deleteButton;
    } else if (toNextFocusableTag) {
      return this._getNextFocusableTagButton(
        this._tags.toArray()[focusedTagIndex + 1],
        false,
      );
    }
  }

  /** @internal Sets the type based on the currently focused tag */
  private _getCurrentlyFocusedTagType(currentTag: DtFilterFieldTag): void {
    const firstTagHasFocus =
      this._tags.first.editButton.nativeElement === document.activeElement;
    const lastTagHasFocus =
      this._getNextFocusableTagButton(this._tags.last, true)?.nativeElement ===
      document.activeElement;
    const editButtonHasFocus =
      currentTag.editButton.nativeElement === document.activeElement;
    const deleteButtonHasFocus =
      this._getNextFocusableTagButton(currentTag, true)?.nativeElement ===
      document.activeElement;

    if (firstTagHasFocus) {
      this._currentlyFocusedTag = 'first';
    } else if (lastTagHasFocus) {
      this._currentlyFocusedTag = 'last';
    } else if (editButtonHasFocus) {
      this._currentlyFocusedTag = 'editButton';
    } else if (deleteButtonHasFocus) {
      this._currentlyFocusedTag = 'deleteButton';
    }
  }

  /**
   * @internal Returns a focusable tag element.
   * The member deleteButtonFirst determines whether to check for the delete button first or not
   */
  _getNextFocusableTagButton(
    tag: DtFilterFieldTag,
    deleteButtonFirst: boolean,
  ): ElementRef<HTMLButtonElement> | undefined {
    if (tag && !tag.temporarilyDisabled) {
      if (deleteButtonFirst) {
        if (tag.deleteButton) {
          return tag.deleteButton;
        }
        return tag.editButton;
      } else {
        if (tag.editButton) {
          return tag.editButton;
        }
        return tag.deleteButton;
      }
    }
  }

  /** @internal Whether a DtFilterFieldTag has a deleteButton */
  _hasDeleteButton(tag: DtFilterFieldTag): boolean {
    return tag.deleteButton !== undefined;
  }

  /** @internal Checks where the focus is inside the input element */
  private _getCurrentFocusState(): void {
    const isStart = this._inputEl.nativeElement.selectionStart === 0;
    const isEnd =
      this._inputEl.nativeElement.selectionStart === this._inputValue.length;
    const isInput = document.activeElement === this._inputEl.nativeElement;

    if (isStart || isEnd) {
      this._currentFocusState = 'inputboundary';
    } else if (isInput) {
      this._allowArrowKeyFocusOnTags = this._getAllowArrowKeyFocusOnTags();
      this._currentFocusState = 'input';
    }
  }

  /** @internal Checks whether to allow navigation to the tag elements */
  private _getAllowArrowKeyFocusOnTags(): boolean {
    // The selectionStart attribute of the input element holds the current position of the cursor.
    // selectionEnd is the same value, but differs when a text is selected, then holding the end position of the selection.
    // We only allow the keyup event handler to start the keyboard tag navigation when the focus was once at position zero or the end.
    return this._inputEl.nativeElement.selectionStart !== 0 &&
      this._inputEl.nativeElement.selectionStart !== this._inputValue.length
      ? false
      : true;
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
          isDtMultiSelectDef(value) ||
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
        this._updateMultiSelectOptionsOrGroups();
        this._updateDefaultSearchDef();
        // If the currently edited part is a range it should pre-fill the
        // previously set values.
        if (removed.length === 1) {
          // Needed to reassign in order for typescript to understand the type.
          const initialRecentlyRemoved = removed[0];
          if (
            isDtRangeValue(initialRecentlyRemoved) &&
            this._currentDef.range
          ) {
            // Needed to set this in typescript, because template binding of input would be evaluated to late.
            this._filterfieldRange.enabledOperators =
              this._currentDef.range.operatorFlags;
            this._filterfieldRange._setValues(initialRecentlyRemoved.range);
            this._filterfieldRange._setOperator(
              initialRecentlyRemoved.operator as DtFilterFieldRangeOperator,
            );
          }
          if (isDtFreeTextDef(this._currentDef)) {
            this._inputValue = isDtAutocompleteValue(initialRecentlyRemoved)
              ? initialRecentlyRemoved.option.viewValue
              : initialRecentlyRemoved.toString();
          }
        }
        if (isDtMultiSelectValue<T>(value)) {
          this._multiSelect._setInitialSelection(removed as (T & DtNodeDef)[]);
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
    this._multiSelect._setInitialSelection([]);

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
      this._multiSelect.closed,
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
    if (
      isDtFreeTextDef(this._currentDef) &&
      isDtOptionDef(event.option.value)
    ) {
      this._inputValue = event.option.value.option.viewValue;
      this._handleFreeTextSubmitted();
    } else {
      const submittedOption = event.option.value as
        | DtAutocompleteValue<T>
        | DefaultSearchOption<T>;
      if (isDefaultSearchOption(submittedOption)) {
        this._peekCurrentFilterValues().push(submittedOption.defaultSearchDef);
        this._writeInputValue(submittedOption.inputValue);
        this._handleFreeTextSubmitted();
        this._switchToRootDef(true);
      } else if (
        isDtAutocompleteDef(submittedOption) ||
        isDtFreeTextDef(submittedOption) ||
        isDtRangeDef(submittedOption) ||
        isDtMultiSelectDef(submittedOption)
      ) {
        this._peekCurrentFilterValues().push(submittedOption);
        this._currentDef = submittedOption;
        this._updateControl();
        this._updateLoading();
        this._updateFilterByLabel();
        this._updateAutocompleteOptionsOrGroups();
        this._updateDefaultSearchDef();
        this._emitCurrentFilterChanges([submittedOption], []);

        if (isDtMultiSelectDef(submittedOption)) {
          this._multiSelect._setInitialSelection([]);
        }
      } else {
        this._peekCurrentFilterValues().push(submittedOption);
        this._switchToRootDef(true);
      }
      // Reset input value to empty string after handling the value provided by the autocomplete.
      // Otherwise the value of the autocomplete would be in the input elements and the next options
      // would be filtered by the input value
      this._writeInputValue('');

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

  /**
   * @internal Handles submitting the range field.
   * Usually called when the user hits enter on the input field when a range filter is set
   */
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

  /**
   * @internal Handles submitting the multiselect field.
   * Usually called when the user hits enter on the input field when a multiselect filter is set
   */
  _handleMultiSelectSubmitted(
    event: DtFilterFieldMultiSelectSubmittedEvent<T>,
  ): void {
    for (const option of event.multiSelect) {
      this._peekCurrentFilterValues().push(
        option as T & DtNodeDef<DtOptionDef> & { option: DtOptionDef },
      );
    }

    this._multiSelectTrigger.closePanel(false);
    // this._isFocused = true;
    this._writeInputValue('');
    this._switchToRootDef(true);

    // if any changes happen, cancel the edit-mode.
    this._resetEditMode();

    this._stateChanges.next();
    this._changeDetectorRef.markForCheck();
  }

  /** Write a value to the native input elements and set _inputValue property  */
  private _writeInputValue(value: string): void {
    // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
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
        this._updateMultiSelectOptionsOrGroups();
        this._updateDefaultSearchDef();
        this._emitFilterChanges([], removedFilters);
      }
      this._resetEditMode();
      this._closeFilterPanels();

      this._multiSelect._setInitialSelection([]);
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
    const event = new DtFilterFieldChangeEvent(
      this,
      added.map((values) => _getSourcesOfDtFilterValues(values)),
      removed.map((values) => _getSourcesOfDtFilterValues(values)),
      this.filters,
    );
    this.filterChanges.emit(event);
  }

  private _emitCurrentFilterChanges(
    addedValues: DtFilterValue[],
    removedValues: DtFilterValue[],
  ): void {
    const event = new DtFilterFieldCurrentFilterChangeEvent(
      this,
      _getSourcesOfDtFilterValues(addedValues),
      _getSourcesOfDtFilterValues(removedValues),
      _getSourcesOfDtFilterValues(this._currentFilterValues),
      this.filters,
    );
    this.currentFilterChanges.emit(event);
  }

  /** Creates a stream of clicks outside the filter field in free text mode */
  private _getFreeTextOutsideClickStream(): Observable<void> {
    if (!this._document) {
      return observableOf();
    }

    return merge(
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
    ) as any as Observable<void>;
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
            (isAsyncDtOptionDef(this._currentDef) ||
              isPartialDtOptionDef(this._currentDef)) &&
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
          this._updateDefaultSearchDef();
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
    this._updateDefaultSearchDef();
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
    } else if (this._defaultSearchDef) {
      this._control = new DtFilterFieldControl(
        this._defaultSearchDef.freeText.validators,
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
        if (this._defaultSearchDef && values.length === 1) {
          values.unshift(this._defaultSearchDef);
        }
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
  /** Updates filter by text */
  private _updateEditionData(): void {
    const splitIndex = this._filters.indexOf(this._currentFilterValues);
    this.editionValuesParser(this._filters[splitIndex]);
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
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          def.autocomplete!.optionsOrGroups
        : [];
    } else if (
      isDtFreeTextDef(currentDef) &&
      !isAsyncDtFreeTextDef(currentDef)
    ) {
      const def = filterFreeTextDef(currentDef, this._inputValue);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._autocompleteOptionsOrGroups = def ? def.freeText!.suggestions : [];
    } else {
      this._autocompleteOptionsOrGroups = [];
    }
  }

  /** Updates the _defaultDearchDef member */
  private _updateDefaultSearchDef(): void {
    const currentDef = this._currentDef;
    if (
      isDtAutocompleteDef(currentDef) &&
      !isAsyncDtAutocompleteDef(currentDef) &&
      this._inputValue.length
    ) {
      const defaultSearchDef = findDefaultSearch(currentDef);
      if (
        defaultSearchDef &&
        defUniquePredicate(defaultSearchDef, this._getSelectedOptionIds())
      ) {
        if (this._defaultSearchDef === null) {
          this._defaultSearchDef = defaultSearchDef;
          this._updateControl();
          this._writeControlValue(this._inputValue);
        } else {
          this._defaultSearchDef = findDefaultSearch(currentDef);
        }
      }
      if (this._defaultSearchDef)
        this._defaultSearchDef = filterFreeTextDef(
          this._defaultSearchDef,
          this._inputValue,
        ) as DtNodeDef<unknown> & {
          freeText: DtFreeTextDef<unknown>;
          option: DtOptionDef;
        };
    } else {
      this._defaultSearchDef = null;
    }
  }

  /** Updates the list of options or groups displayed in the multi select overlay */
  private _updateMultiSelectOptionsOrGroups(): void {
    const currentDef = this._currentDef;

    if (
      isDtMultiSelectDef(currentDef) &&
      !isAsyncDtMultiSelectDef(currentDef)
    ) {
      this._multiSelect._setInitialSelection([]);

      const def = filterMultiSelectDef(
        currentDef,
        this._getSelectedOptionIds(),
        this._inputValue,
      );
      this._multiSelectOptionsOrGroups = def
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          def.multiSelect!.multiOptions
        : [];
    } else {
      this._multiSelectOptionsOrGroups = [];
    }
  }

  /** Updates the filterByLabel with the view value of the first currently active filter source. */
  private _updateFilterByLabel(): void {
    const currentFilterNodeDefsOrSources = this._currentFilterValues;
    if (
      currentFilterNodeDefsOrSources &&
      currentFilterNodeDefsOrSources.length
    ) {
      this._filterByLabel = this.editionValuesParser(
        currentFilterNodeDefsOrSources,
      );
    }
  }

  private _updateLoading(): void {
    this._loading = isAsyncDtOptionDef(this._currentDef);
  }

  private _getSelectedOptionIds(): Set<string> {
    const ids = new Set<string>();
    for (const currentFilter of this._filters) {
      let currentId = '';

      for (const [index, value] of currentFilter.entries()) {
        if (isDtAutocompleteValue(value)) {
          const id = peekOptionId(value, currentId);
          ids.add(id);

          // In case of multiSelect filter type, the id must not be concatenated.
          // So it'll only use the first value which is the parent
          if (!isDtMultiSelectValue(currentFilter[0]) || index === 0) {
            currentId = id;
          }
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
    this._multiSelectTrigger.closePanel();

    if (this._editModeStashedValue) {
      this._cancelEditMode();
    }
    if (currentlyOpenFilterField === this) {
      currentlyOpenFilterField = null;
    }
  }

  private _checkInteractionStateChanged(interactionState: boolean): void {
    if (
      this.interactionState !== interactionState &&
      this.interactionState !== this._isFocused
    ) {
      if (this._isFocused) {
        this.interactionState = this._isFocused;
        this.interactionStateChange.emit(this._isFocused);
      } else {
        this.interactionState = interactionState;
        this.interactionStateChange.emit(interactionState);
      }
    }
  }
}
/* eslint-disable max-lines */
