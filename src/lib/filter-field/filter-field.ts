import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  EventEmitter,
  Output,
  NgZone,
  Input,
  AfterViewInit,
  SimpleChanges,
  ViewChildren,
  QueryList,
  OnChanges,
  Optional,
  Inject,
} from '@angular/core';
import {
  takeUntil,
  switchMap,
  take,
  debounceTime,
  filter,
} from 'rxjs/operators';
import { ENTER, BACKSPACE, ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import {
  Subject,
  Subscription,
  fromEvent,
  merge,
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  DtAutocomplete,
  DtAutocompleteSelectedEvent,
  DtAutocompleteTrigger,
} from '@dynatrace/angular-components/autocomplete';
import { readKeyCode, isDefined } from '@dynatrace/angular-components/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { DtFilterFieldTag } from './filter-field-tag/filter-field-tag';
import { DtFilterFieldDataSource } from './filter-field-data-source';
import {
  DtNodeDef,
  isDtAutocompleteDef,
  isDtFreeTextDef,
  isDtRangeDef,
  DtFilterFieldTagData,
  isDtOptionDef,
  isAsyncDtAutocompleteDef,
  DtFilterValue,
  getSourcesOfDtFilterValues,
  DtAutocompletValue,
  isDtAutocompletValue,
  isDtRangeValue,
} from './types';
import {
  filterAutocompleteDef,
  filterFreeTextDef,
  peekOptionId,
  createTagDataForFilterValues,
  findFilterValuesForSources,
  applyDtOptionIds,
} from './filter-field-util';
import { DtFilterFieldRangeTrigger } from './filter-field-range/filter-field-range-trigger';
import {
  DtFilterFieldRangeSubmittedEvent,
  DtFilterFieldRange,
  DtFilterFieldRangeOperator,
} from './filter-field-range/filter-field-range';
import {
  getDtFilterFieldApplyFilterNoRootDataProvidedError,
  getDtFilterFieldApplyFilterParseError,
} from './filter-field-errors';
import { DOCUMENT } from '@angular/common';

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

@Component({
  moduleId: module.id,
  selector: 'dt-filter-field',
  exportAs: 'dtFilterField',
  templateUrl: 'filter-field.html',
  styleUrls: ['filter-field.scss'],
  host: {
    class: 'dt-filter-field',
    '(click)': '_handleHostClick($event)',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtFilterField<T> implements AfterViewInit, OnDestroy, OnChanges {
  /** Label for the filter field (e.g. "Filter by"). Will be placed next to the filter icon. */
  @Input() label = '';

  @Input()
  get dataSource(): DtFilterFieldDataSource {
    return this._dataSource;
  }
  set dataSource(dataSource: DtFilterFieldDataSource) {
    if (this._dataSource !== dataSource) {
      this._switchDataSource(dataSource);
    }
  }
  private _dataSource: DtFilterFieldDataSource;
  private _dataSubscription: Subscription | null;
  private _stateChanges = new Subject<void>();
  private _outsideClickSubscription: Subscription | null;

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
    return this._filters.map(values => getSourcesOfDtFilterValues(values));
  }
  set filters(value: any[][]) {
    this._tryApplyFilters(value);
    this._changeDetectorRef.markForCheck();
  }
  private _filters: DtFilterValue[][] = [];

  /** Emits an event with the current value of the input field everytime the user types. */
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
  @ViewChildren(DtFilterFieldTag) tags: QueryList<DtFilterFieldTag>;

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

  /** @internal The root NodeDef. The filter field will always switch to this def once the user completes a filter. */
  _rootDef: DtNodeDef | null = null;

  /**
   * @internal
   * The NodeDefs of the asynchronously loaded data.
   * The key represents the Def that triggerd the async loading,
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

  /** @internal Holds the view value of the filter by label. Will be set when the first part of a filter has been selected. */
  _filterByLabel = '';

  /** @internal Value of the input element. */
  _inputValue = '';

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /** Member value that holds the previous filter values, to reset them if editmode is cancelled. */
  private _editModeStashedValue: DtFilterValue[] | null;

  /** Whether the filter field or one of it's child elements is focused. */
  private _isFocused = false;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _zone: NgZone,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef,
    // tslint:disable-next-line:no-any
    @Optional() @Inject(DOCUMENT) private _document: any,
  ) {
    this._stateChanges
      .pipe(switchMap(() => this._zone.onMicrotaskEmpty.pipe(take(1))))
      .subscribe(() => {
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
          } else if (isDtRangeDef(this._currentDef)) {
            this._filterfieldRangeTrigger.openPanel();
            this._filterfieldRangeTrigger.range.focus();
            // need to return here, otherwise the focus would jump back into the filter field
            return;
          }
          // It is necessary to restore the focus back to the input field
          // so the user can directly coninue creating more filter nodes.
          // This be done once all microtasks have been completed (the zone is stable)
          // and the rendering has been finished.
          this.focus();
        }
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
      .pipe(takeUntil(this._destroy))
      .subscribe(origin => {
        this._isFocused = isDefined(origin);
      });

    // tslint:disable-next-line:no-any
    this._autocomplete.optionSelected.subscribe(
      (event: DtAutocompleteSelectedEvent<any>) => {
        this._handleAutocompleteSelected(event);
      },
    );

    // Using fromEvent instead of an html binding so we get a stream and can easily do a debounce
    fromEvent(this._inputEl.nativeElement, 'input')
      .pipe(
        takeUntil(this._destroy),
        debounceTime(DT_FILTER_FIELD_TYPING_DEBOUNCE),
      )
      .subscribe(() => {
        this._handleInputChange();
      });
  }

  ngOnDestroy(): void {
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
    this._destroy.next();
    this._destroy.complete();
  }

  /** Focuses the filter-element element. */
  focus(): void {
    // As the host element is not focusable by it's own, we need to focus the internal input element
    if (this._inputEl) {
      this._inputEl.nativeElement.focus();
    }
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
    const value = this._inputEl.nativeElement.value;
    if (value !== this._inputValue) {
      this._inputValue = value;
      this._updateAutocompleteOptionsOrGroups();
      this.inputChange.emit(value);

      this._changeDetectorRef.markForCheck();
    }
  }

  /** @internal */
  _handleInputKeyDown(event: KeyboardEvent): void {
    const keyCode = readKeyCode(event);
    if (keyCode === BACKSPACE && !this._inputValue.length) {
      if (this._currentFilterValues.length) {
        this._removeFilter(this._currentFilterValues);
      } else if (this._prefixTagData.length) {
        this._removeFilter(
          this._prefixTagData[this._prefixTagData.length - 1].filterValues,
        );
      }
    } else if (keyCode === ESCAPE || (keyCode === UP_ARROW && event.altKey)) {
      this._autocompleteTrigger.closePanel();
      this._filterfieldRangeTrigger.closePanel();
      if (this._editModeStashedValue) {
        this._cancelEditMode();
      }
    }
  }

  /** @internal */
  _handleInputKeyUp(event: KeyboardEvent): void {
    const keyCode = readKeyCode(event);
    if (
      keyCode === ENTER &&
      this._inputValue.length &&
      isDtFreeTextDef(this._currentDef)
    ) {
      this._handleFreeTextSubmitted();
    }
  }

  /**
   * @internal
   * Handles removing a filter from the filters list.
   * Called when the user clicks on the remove button of a filter tag.
   */
  _handleTagRemove(event: DtFilterFieldTag): void {
    this._removeFilter(event.data.filterValues);
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
        (isDtAutocompletValue(value) && isDtAutocompleteDef(value)) ||
        isDtRangeDef(value) ||
        isDtFreeTextDef(value)
      ) {
        const removed = event.data.filterValues.splice(1);
        // Keep the removed values in the stashed member, to reapply them if necessary.
        this._editModeStashedValue = removed;
        this._listenForEditModeCancellation();
        this._currentFilterValues = event.data.filterValues;
        this._currentDef = value;

        this._updateLoading();
        this._updateAutocompleteOptionsOrGroups();
        // If the currently edited part is a range it should prefill the
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
        this._removeFilter(event.data.filterValues);
      }
      this.focus();
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
   * Cancels the editmode and resets the filter to the root definition.
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
   * If any changes to the filter have been made during the editmode, the editmode should be exited and the
   * usual behaviour of writing filters should continue.
   */
  private _resetEditMode(): void {
    this._clearOutsideClickSubscription();
    this._editModeStashedValue = null;
  }

  /** Handles selecting an option from the autocomplete. */
  private _handleAutocompleteSelected(
    event: DtAutocompleteSelectedEvent<DtNodeDef>,
  ): void {
    const optionDef = event.option.value as DtAutocompletValue;
    this._peekCurrentFilterValues().push(optionDef);
    // Reset input value to empty string after handling the value provided by the autocomplete.
    // Otherwise the value of the autocomplete would be in the input elements and the next options would be filtered by the inputvalue
    this._writeInputValue('');
    if (
      isDtAutocompleteDef(optionDef) ||
      isDtFreeTextDef(optionDef) ||
      isDtRangeDef(optionDef)
    ) {
      this._currentDef = optionDef;
      this._updateLoading();
      this._updateFilterByLabel();
      this._updateAutocompleteOptionsOrGroups();
      this._emitCurrentFilterChanges([optionDef], []);
    } else {
      this._switchToRootDef(true);
    }

    // Clear any previous selected option.
    this._autocomplete.options.forEach(option => {
      if (option.selected) {
        option.deselect();
      }
    });

    // if any changes happen, cancel the editmode.
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

    // if any changes happen, cancel the editmode.
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
    this._filterfieldRangeTrigger.closePanel();
    this._isFocused = true;
    this._writeInputValue('');
    this._switchToRootDef(true);

    // if any changes happen, cancel the editmode.
    this._resetEditMode();

    this._stateChanges.next();
    this._changeDetectorRef.markForCheck();
  }

  /** Write a value to the native input elements and set _inputValue property  */
  private _writeInputValue(value: string): void {
    // tslint:disable-next-line:no-unused-expression
    this._inputEl && (this._inputEl.nativeElement.value = value);
    if (this._inputValue !== value) {
      this._inputValue = value;
      this.inputChange.emit(value);
      this._changeDetectorRef.markForCheck();
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
  private _removeFilter(filterValues: DtFilterValue[]): void {
    const removableIndex = this._filters.indexOf(filterValues);
    if (removableIndex !== -1) {
      const removedFilters = this._filters.splice(removableIndex, 1);
      if (filterValues === this._currentFilterValues) {
        this._switchToRootDef(false);
      } else {
        this._updateTagData();
        this._updateAutocompleteOptionsOrGroups();
        this._filterByLabel = '';
      }
      this._emitFilterChanges([], removedFilters);
      this._stateChanges.next();
      this._changeDetectorRef.markForCheck();
    }
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
        added.map(values => getSourcesOfDtFilterValues(values)),
        removed.map(values => getSourcesOfDtFilterValues(values)),
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
        getSourcesOfDtFilterValues(addedValues),
        getSourcesOfDtFilterValues(removedValues),
        getSourcesOfDtFilterValues(this._currentFilterValues),
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
   * Takes a new Datasource and switches the filter date to the provided one.
   * Handles all the disconnecting and data switching.
   */
  private _switchDataSource(dataSource: DtFilterFieldDataSource): void {
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
      .pipe(takeUntil(this._destroy))
      .subscribe(
        def => {
          if (isAsyncDtAutocompleteDef(this._currentDef) && def) {
            this._asyncDefs.set(this._currentDef, def);
            if (
              def &&
              isDtOptionDef(this._currentDef) &&
              this._currentDef.option.uid
            ) {
              applyDtOptionIds(def, this._currentDef.option.uid);
            }
          } else {
            if (def) {
              applyDtOptionIds(def);
            }
            this._rootDef = def;
          }
          this._currentDef = def;
          this._updateLoading();
          this._updateAutocompleteOptionsOrGroups();
          this._stateChanges.next();
          this._changeDetectorRef.markForCheck();
        },
        (error: Error) => {
          // If parsing the data in the datasource fails, we need to throw to notify the developer about the error.
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
    this._updateLoading();
    this._updateAutocompleteOptionsOrGroups();
    if (shouldEmit && this._currentFilterValues.length) {
      this._emitFilterChanges([this._currentFilterValues], []);
    }
    this._currentFilterValues = [];
    this._updateTagData();
  }

  /** Updates prefix and suffix tag data for displaying filter tags. */
  private _updateTagData(): void {
    if (this._rootDef) {
      const splitIndex = this._filters.indexOf(this._currentFilterValues);
      this._prefixTagData = this._filters
        .slice(0, this._currentFilterValues.length ? splitIndex : undefined)
        .map(
          (values, i) =>
            createTagDataForFilterValues(values) ||
            this._prefixTagData[i] ||
            null,
        );

      this._suffixTagData = this._currentFilterValues.length
        ? this._filters
            .slice(this._filters.indexOf(this._currentFilterValues) + 1)
            .map(
              (values, i) =>
                createTagDataForFilterValues(values) ||
                this._suffixTagData[i] ||
                null,
            )
            .filter((tag: DtFilterFieldTagData | null) => tag !== null)
        : [];
    }
  }

  /** Updates the list of options or groups displayed in the autocomplete overlay */
  private _updateAutocompleteOptionsOrGroups(): void {
    const currentDef = this._currentDef;

    if (isDtAutocompleteDef(currentDef)) {
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
      const def = currentFilterNodeDefsOrSources[0];
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
        if (isDtAutocompletValue(value)) {
          const id = peekOptionId(value, currentId);
          ids.add(id);
          currentId = id;
        }
      }
    }
    return ids;
  }

  private _tryApplyFilters(filters: any[][]): void {
    this._filters = filters.map(sources => {
      if (this._rootDef) {
        const values = findFilterValuesForSources(
          sources,
          this._rootDef,
          this._asyncDefs,
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
}
