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
} from '@angular/core';
import { takeUntil, switchMap, take, debounceTime } from 'rxjs/operators';
import { ENTER, BACKSPACE, ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { Subject, Subscription, fromEvent } from 'rxjs';
import { DtAutocomplete, DtAutocompleteSelectedEvent, DtAutocompleteTrigger } from '@dynatrace/angular-components/autocomplete';
import { readKeyCode, isDefined } from '@dynatrace/angular-components/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { DtFilterFieldTagEvent, DtFilterFieldTag } from './filter-field-tag/filter-field-tag';
import {
  DtFilterFieldDataSource,
} from './data-source/filter-field-data-source';
import {
  DtNodeDef,
  DtNodeFlags,
  DtNodeData,
  isDtAutocompleteData,
  isDtFreeTextData,
  DtFilterData,
  dtFilterData,
  getDtNodeDataViewValue
} from './types';
import { DtFilterFieldControl, DtFilterFieldViewer } from './data-source/filter-field-control';

// tslint:disable:no-bitwise

export class DtFilterChangeEvent {
  constructor(
    /** Filter data objects added */
    public added: DtFilterData[],
    /** Filter data objects removed. */
    public removed: DtFilterData[],
    /** Current state of filter data objects. */
    public filters: DtFilterData[]
  ) { }
}

export const DT_FILTER_FIELD_TYPING_DEBOUNCE = 200;

// tslint:disable:no-any
@Component({
  moduleId: module.id,
  selector: 'dt-filter-field',
  exportAs: 'dtFilterField',
  templateUrl: 'filter-field.html',
  styleUrls: ['filter-field.scss'],
  host: {
    'class': 'dt-filter-field',
    '(click)': '_handleHostClick($event)',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtFilterField implements AfterViewInit, OnDestroy, DtFilterFieldViewer {

  /** Label for the filter field (e.g. "Filter by"). Will be placed next to the filter icon. */
  @Input() label = '';

  @Input()
  get dataSource(): DtFilterFieldDataSource { return this._dataSource; }
  set dataSource(dataSource: DtFilterFieldDataSource) {
    if (this._dataSource !== dataSource) {
      this._switchDataSource(dataSource);
    }
  }
  private _dataSource: DtFilterFieldDataSource;
  private _dataControl: DtFilterFieldControl;
  private _dataSubscription: Subscription | null;
  private _stateChanges = new Subject<void>();

  /** Emits an event with the current value of the input field everytime the user types. */
  @Output() inputChange = new EventEmitter<string>();

  /** Emits when a new filter has been added or removed. */
  @Output() filterChanges = new EventEmitter<DtFilterChangeEvent>();

  /**
   * List of tags that are the visual representation for selected nodes.
   * This can be used to disable certain tags or change their labeling.
   */
  @ViewChildren(DtFilterFieldTag) tags: QueryList<DtFilterFieldTag>;

  /** @internal Current NodeData that renders as an autocomplete, a free-text, ... */
  _currentRenderNode: DtNodeData | null;

  /** @internal Holds all currently applied filters */
  _filters: DtFilterData[] = [];

  /** @internal Filter where options, free texts, ... are applied by the user */
  _currentFilter: DtFilterData | null = null;

  /** @internal Reference to the internal input element */
  @ViewChild('input') _inputEl: ElementRef;

  /** @internal The autocomplete trigger that is placed on the input element */
  @ViewChild(DtAutocompleteTrigger) _autocompleteTrigger: DtAutocompleteTrigger<DtNodeDef>;

  /** @internal Querylist of the autocompletes provided by ng-content */
  @ViewChild(DtAutocomplete) _autocomplete: DtAutocomplete<DtNodeDef>;

  /** @internal Filter nodes to be rendered _before_ the input element. */
  get _prefixFilters(): DtFilterData[] {
    return this._filters.slice(0, this._currentFilter ? this._filters.indexOf(this._currentFilter) : undefined);
  }

  /** @internal Filter nodes to be rendered _after_ the input element. */
  get _suffixFilters(): DtFilterData[] {
    return this._currentFilter ? this._filters.slice(this._filters.indexOf(this._currentFilter) + 1) : [];
  }

  get _autocompleteOptionsOrGroups(): DtNodeData[] {
    const def = this._currentRenderNode ? this._currentRenderNode.def :  null;
    return def && (
      (def.nodeFlags & DtNodeFlags.TypeAutocomplete && this._currentRenderNode!.autocomplete!.optionsOrGroups) ||
      (def.nodeFlags & DtNodeFlags.TypeFreeText && this._currentRenderNode!.freeText!.suggestions)
    ) || [];
  }

  get _filterByLabel(): string {
    return this._currentFilter && this._currentFilter.nodes.length &&
      isDtAutocompleteData(this._currentFilter.nodes[0]) &&
      this._currentFilter.nodes[0].autocomplete!.selectedOption &&
      this._currentFilter.nodes[0].autocomplete!.selectedOption!.option!.viewValue || '';
  }

  /** @internal Value of the input element. */
  _inputValue = '';

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /** Whether the filter field or one of it's child elements is focused. */
  private _isFocused = false;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _zone: NgZone,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef
  ) {
    this._stateChanges.pipe(
      switchMap(() => this._zone.onMicrotaskEmpty.pipe(take(1)))
    ).subscribe(() => {
      if (this._isFocused) {
        if (this._currentRenderNode && this._currentRenderNode.def.nodeFlags & DtNodeFlags.TypeAutocomplete) {
          // When the autocomplete closes after the user has selected an option
          // and the new data is also displayed in an autocomlete we need to open it again.
          // Note: Also trigger openPanel if it already open, so it does a reposition and resize
          this._autocompleteTrigger.openPanel();
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
    this._focusMonitor.monitor(this._elementRef.nativeElement, true)
      .pipe(takeUntil(this._destroy))
      .subscribe((origin) => { this._isFocused = isDefined(origin); });

    // tslint:disable-next-line:no-any
    this._autocomplete.optionSelected
      .subscribe((event: DtAutocompleteSelectedEvent<any>) => { this._handleAutocompleteSelected(event); });

    // Using fromEvent instead of an html binding so we get a stream and can easily do a debounce
    fromEvent(this._inputEl.nativeElement, 'input')
      .pipe(takeUntil(this._destroy), debounceTime(DT_FILTER_FIELD_TYPING_DEBOUNCE))
      .subscribe(() => { this._handleInputChange(); });
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

  /** Submits and finishes the current filter. */
  submitFilter(): void {
    if (this._currentFilter) {
      this._emitFilterChanges([this._currentFilter], []);
      this._currentFilter = null;
    }
  }

  /**
   * @internal
   * Handle click on the host element, prevent the event from bubbling up and open the autocomplete, range inputs, ...
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
      this._dataControl.filterInputChanges(value);
      this.inputChange.emit(value);

      this._changeDetectorRef.markForCheck();
    }
  }

  /** @internal */
  _handleInputKeyDown(event: KeyboardEvent): void {
    const keyCode = readKeyCode(event);
    if (keyCode === BACKSPACE && !this._inputValue.length) {
      if (this._currentFilter) {
        this._removeFilter(this._currentFilter);
      } else if (this._prefixFilters.length) {
        this._removeFilter(this._prefixFilters[this._prefixFilters.length - 1]);
      }
    } else if (keyCode === ESCAPE || (keyCode === UP_ARROW && event.altKey)) {
      this._autocompleteTrigger.closePanel();
    }
  }

  /** @internal */
  _handleInputKeyUp(event: KeyboardEvent): void {
    const keyCode = readKeyCode(event);
    if (keyCode === ENTER && this._inputValue.length && isDtFreeTextData(this._currentRenderNode)) {
      this._handleFreeTextSubmitted();
    }
  }

  _handleTagRemove(event: DtFilterFieldTagEvent): void {
    this._removeFilter(event.data);
  }

  _handleTagEdit(event: DtFilterFieldTagEvent): void {
    const nodesToRemove = event.data.nodes.splice(1);
    this._currentFilter = event.data;
    this._emitFilterNodeChanges(event.data.nodes[0], nodesToRemove);
    this.focus();
    this._changeDetectorRef.markForCheck();
  }

  private _handleAutocompleteSelected(event: DtAutocompleteSelectedEvent<DtNodeData>): void {
    if (this._currentRenderNode) {
      if (isDtAutocompleteData(this._currentRenderNode)) {
        this._currentRenderNode.autocomplete.selectedOption = event.option.value;
      } else if (isDtFreeTextData(this._currentRenderNode)) {
        this._currentRenderNode.freeText.selectedSuggestion = event.option.value;
        this._currentRenderNode.freeText.textValue = event.option.viewValue;
      }
      const filter = this._peekCurrentFilter();
      filter.nodes.push(this._currentRenderNode);
      this._updateFilterDataViewValues(filter);
    }

    this._emitFilterNodeChanges(this._currentRenderNode);

    // Reset input value to empty string after handling the value provided by the autocomplete.
    // Otherwise the value of the autocomplete would be in the input elements.
    this._writeInputValue('');

    // Clear any previous selected option.
    this._autocomplete.options.forEach((option) => {
      if (option.selected) { option.deselect(); }
    });

    this._changeDetectorRef.markForCheck();
  }

  private _handleFreeTextSubmitted(): void {
    if (isDtFreeTextData(this._currentRenderNode)) {
      this._currentRenderNode.freeText.textValue = this._inputValue;
      const filter = this._peekCurrentFilter();
      filter.nodes.push(this._currentRenderNode);
      this._updateFilterDataViewValues(filter);
    }

    this._emitFilterNodeChanges(this._currentRenderNode);
    this._writeInputValue('');
    this._changeDetectorRef.markForCheck();
  }

  /** Write a value to the native input elements and set _inputValue property  */
  private _writeInputValue(value: string): void {
    // tslint:disable-next-line:no-unused-expression
    this._inputEl && (this._inputEl.nativeElement.value = value);
    if (this._inputValue !== value) {
      this._inputValue = value;
      this._dataControl.filterInputChanges(value);
      this.inputChange.emit(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  private _peekCurrentFilter(): DtFilterData {
    let filter = this._currentFilter;
    if (!filter) {
      filter = dtFilterData([]);
      this._currentFilter = filter;
      this._filters.push(filter);
    }
    if (!Array.isArray(filter.nodes)) {
      filter.nodes = [];
    }
    return filter;
  }

  private _removeFilter(filter: DtFilterData): void {
    const removableIndex = this._filters.indexOf(filter);
    if (filter === this._currentFilter) {
      this._currentFilter = null;
    }
    if (removableIndex !== -1) {
      this._filters.splice(removableIndex, 1);
      this._emitFilterNodeChanges(null, filter.nodes);
      this._emitFilterChanges([], [filter]);
      this.focus();
      this._changeDetectorRef.markForCheck();
    }
  }

  private _updateFilterDataViewValues(data: DtFilterData): DtFilterData {
    const nodes = data.nodes || [];
    let key: string | null = null;
    let value: string | null = null;
    let separator: string | null = null;
    if (nodes.length) {
      if (nodes.length > 1) {
        key = getDtNodeDataViewValue(nodes[0]);
      }
      const lastNode = nodes[nodes.length - 1];
      value = getDtNodeDataViewValue(lastNode);
      if (isDtFreeTextData(lastNode)) {
        value = `"${value}"`;
        separator = '~';
      }
    }
    data.viewValues = { key, value, separator };
    return data;
  }

  private _emitFilterNodeChanges(added: DtNodeData | null = null, removed: DtNodeData[] | null = null): void {
    if (this._dataControl) {
      this._dataControl.filterNodeChanges({ added, removed });
    }
  }

  private _emitFilterChanges(added: DtFilterData[], removed: DtFilterData[]): void {
    this.filterChanges.emit(new DtFilterChangeEvent(added, removed, this._filters));
  }

  private _switchDataSource(dataSource: DtFilterFieldDataSource): void {
    if (this._dataControl) {
      this._dataControl.disconnect();
    }

    if (this._dataSubscription) {
      this._dataSubscription.unsubscribe();
      this._dataSubscription = null;
    }

    this._dataSource = dataSource;
    this._dataControl = new DtFilterFieldControl(dataSource, this);

    this._dataSubscription = this._dataControl.connect().pipe(takeUntil(this._destroy)).subscribe((dataNode) => {
      this._currentRenderNode = dataNode;
      this._stateChanges.next();
      this._changeDetectorRef.markForCheck();
    });
  }
}
