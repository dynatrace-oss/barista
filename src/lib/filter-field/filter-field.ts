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
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ENTER, BACKSPACE } from '@angular/cdk/keycodes';
import { Subject, Subscription } from 'rxjs';
import { DtAutocomplete, DtAutocompleteSelectedEvent, DtAutocompleteTrigger } from '@dynatrace/angular-components/autocomplete';
import { readKeyCode, isDefined } from '@dynatrace/angular-components/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { DtFilterFieldTagEvent } from './filter-field-tag/filter-field-tag';
import {
  DtFilterFieldDataSource,
} from './data-source/filter-field-data-source';
import { NodeDef, NodeFlags, NodeData, isAutocompleteData, isFreeTextData, FilterData, filterData, isOptionData, getNodeDataViewValue } from './types';
import { DtFilterFieldControl, DtFilterFieldViewer, DtFilterNodesChangesEvent } from './data-source/filter-field-control';

// tslint:disable:no-bitwise

// export class DtActiveFilterChangeEvent {
//   constructor(
//     public rootNodes: DtFilterFieldNode[],
//     public activeNode: DtFilterFieldNode | null,
//     public path: DtFilterFieldGroupNode[] = [],
//     // tslint:disable-next-line: no-any
//     public source: DtFilterField<any>
//   ) { }

//   // submitActiveFilter(viewValue?: string): void {
//   //   if (this.activeNode) {
//   //     this.source.submitFilter(viewValue);
//   //   }
//   // }
// }

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

  /** Label for the filter field. Will be placed next to the filter icon. */
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

  /** Data subscription */
  private _dataSubscription: Subscription | null;

  _currentRenderNode: NodeData | null;
  _filters: FilterData[] = [];
  _currentFilter: FilterData | null = null;

  /** Emits an event with the current value of the input field everytime the user types. */
  @Output() inputChange = new EventEmitter<string>();

  /**
   * Emits an active-filter-change event when a free text has been submitted,
   * an autocomplete option has been selected or a range has been defined
   */
  @Output() activeFilterChange = new EventEmitter<void>();

  // dataStateChanges = new Subject<DtFilterFieldDataStateChanges<any>>();

  /** @internal Reference to the internal input element */
  @ViewChild('input') _inputEl: ElementRef;

  /** @internal The autocomplete trigger that is placed on the input element */
  @ViewChild(DtAutocompleteTrigger) _autocompleteTrigger: DtAutocompleteTrigger<NodeDef>;

  /** @internal Querylist of the autocompletes provided by ng-content */
  @ViewChild(DtAutocomplete) _autocomplete: DtAutocomplete<NodeDef>;

  _filterNodesChanges = new Subject<DtFilterNodesChangesEvent>();

  /** @internal Filter nodes to be rendered _before_ the input element. */
  get _prefixFilters(): FilterData[] {
    return this._filters.slice(0, this._currentFilter ? this._filters.indexOf(this._currentFilter) : undefined);
  }

  /** @internal Filter nodes to be rendered _after_ the input element. */
  get _suffixFilters(): FilterData[] {
    return this._currentFilter ? this._filters.slice(this._filters.indexOf(this._currentFilter) + 1) : [];
  }

  get _filterByLabel(): string {
    return '';
    // const lastProperty = this._currentNode && this._currentNode.properties.length ?
    //   this._currentNode.properties[this._currentNode.properties.length - 1] : null;
    // return lastProperty ? ` ${(lastProperty as DtFilterFieldValueProperty<any>).toString()}:` : '';
  }

  get _autocompleteOptionsOrGroups(): NodeData[] {
    const def = this._currentRenderNode ? this._currentRenderNode.def :  null;
    return def && (
      (def.nodeFlags & NodeFlags.TypeAutocomplete && this._currentRenderNode!.autocomplete!.optionsOrGroups) ||
      (def.nodeFlags & NodeFlags.TypeFreeText && this._currentRenderNode!.freeText!.suggestions)
    ) || [];
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
  ) { }

  ngAfterViewInit(): void {
    // Monitoring the host element and every focusable child element on focus an blur events.
    // This is necessary so we can detect and restore focus after the input type has been changed.
    this._focusMonitor.monitor(this._elementRef.nativeElement, true)
      .pipe(takeUntil(this._destroy))
      .subscribe((origin) => { this._isFocused = isDefined(origin); });

    // tslint:disable-next-line:no-any
    this._autocomplete.optionSelected
      .subscribe((event: DtAutocompleteSelectedEvent<any>) => { this._handleAutocompleteSelected(event); });

    this._zone.onStable.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this._isFocused) {
        if (this._currentRenderNode && this._currentRenderNode.def.nodeFlags & NodeFlags.TypeAutocomplete) {
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

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);

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

  submitFilter(): void {
    if (this._currentFilter) {
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
  _handleInputChange(event: Event): void {
    const value = event.target instanceof HTMLInputElement ? event.target.value : this._inputValue;
    if (value !== this._inputValue) {
      this._inputValue = value;
      this.inputChange.emit(value);

      // if (this._dataSource) {
      //   this._dataSource.autocompleteFilter = value;
      // }

      this._changeDetectorRef.markForCheck();
    }
  }

  /** @internal */
  _handleInputKeyDown(event: KeyboardEvent): void {
    // const keyCode = readKeyCode(event);
    // if (keyCode === BACKSPACE && !this._inputValue.length) {
    //   if (this._currentNode) {
    //     this._nodesHost.removeNode(this._currentNode);
    //     this._currentNode = null;
    //     this._resetDataSource();
    //     this._emitChangeEvent();
    //   } else if (this._prefixNodes.length) {
    //     const node = this._prefixNodes[this._prefixNodes.length - 1];
    //     this._nodesHost.removeNode(node);
    //     this._resetDataSource();
    //     this._emitChangeEvent();
    //   }
    // }
  }

  /** @internal */
  _handleInputKeyUp(event: KeyboardEvent): void {
    // const keyCode = readKeyCode(event);
    // if (keyCode === ENTER && this._inputValue.length && this._currentDef && this._currentDef.dataType === 'free-text') {
    //   this._handleFreeTextSubmitted();
    // }
  }

  _handleTagRemove(event: DtFilterFieldTagEvent): void {
    const removableIndex = this._filters.indexOf(event.data);
    if (removableIndex !== -1) {
      this._filters.splice(removableIndex, 1);
      this._emitFilterNodeChanges(null, event.data.nodes);
    }
  }

  _handleTagEdit(event: DtFilterFieldTagEvent): void {
    // const node = event.node as DtFilterFieldFilterNode;
    // if (node) {
    //   if (this._currentNode) {
    //     // TODO @thomas.pink: What to do here????
    //     throw new Error(`Can not edit tag, because there is currently another tag edited or a new on in creation`);
    //   }
    //   node.properties = [node.properties[0]];
    //   this._currentNode = node;
    //   this.focus();
    //   this._emitChangeEvent();
    //   this._changeDetectorRef.markForCheck();
    // }
  }

  private _handleAutocompleteSelected(event: DtAutocompleteSelectedEvent<NodeData>): void {

    if (this._currentRenderNode) {
      if (isAutocompleteData(this._currentRenderNode)) {
        this._currentRenderNode.autocomplete.selectedOption = event.option.value;
      } else if (isFreeTextData(this._currentRenderNode)) {
        this._currentRenderNode.freeText.selectedSuggestion = event.option.value;
        this._currentRenderNode.freeText.textValue = event.option.viewValue;
      }
      const filter = this._peekCurrentFilter();
      filter.nodes.push(this._currentRenderNode);
      this._updateFilterDataViewValues(filter);
    }

    // Reset input value to empty string after handling the value provided by the autocomplete.
    // Otherwise the value of the autocomplete would be in the input elements.
    this._writeInputValue('');

    // Clear any previous selected option.
    this._autocomplete.options.forEach((option) => {
      if (option.selected) { option.deselect(); }
    });

    this._emitFilterNodeChanges(this._currentRenderNode);
    // this._dataControl.currentDef = event.option.value.def;

    // this._emitChangeEvent();
    this._changeDetectorRef.markForCheck();
  }

  private _handleFreeTextSubmitted(): void {
    if (isFreeTextData(this._currentRenderNode)) {
      this._currentRenderNode.freeText.textValue = this._inputValue;
      const filter = this._peekCurrentFilter();
      filter.nodes.push(this._currentRenderNode);
      this._updateFilterDataViewValues(filter);
    }

    this._writeInputValue('');
    // this._resetDataSource();
    // this._emitChangeEvent();
    this._changeDetectorRef.markForCheck();
  }

  /** Write a value to the native input elements and set _inputValue property  */
  private _writeInputValue(value: string): void {
    // tslint:disable-next-line:no-unused-expression
    this._inputEl && (this._inputEl.nativeElement.value = value);
    if (this._inputValue !== value) {
      this._inputValue = value;
      // if (this._dataSource) {
      //   this._dataSource.autocompleteFilter = value;
      // }
      this.inputChange.emit(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  private _emitChangeEvent(): void {
    // const nodeToEmit = node || this._currentNode || null;
    // this.activeFilterChange.emit(new DtActiveFilterChangeEvent(
    //   this._nodesHost.rootNodes,
    //   nodeToEmit!,
    //   nodeToEmit ? getParentsForNode(nodeToEmit) : [],
    //   this
    // ));
  }

  private _peekCurrentFilter(): FilterData {
    let filter = this._currentFilter;
    if (!filter) {
      filter = filterData([]);
      this._currentFilter = filter;
      this._filters.push(filter);
    }
    if (!Array.isArray(filter.nodes)) {
      filter.nodes = [];
    }
    return filter;
  }

  private _updateFilterDataViewValues(data: FilterData): FilterData {
    const nodes = data.nodes || [];
    let key: string | null = null;
    let value: string | null = null;
    let separator: string | null = null;
    if (nodes.length) {
      if (nodes.length > 1) {
        key = getNodeDataViewValue(nodes[0]);
      }
      const lastNode = nodes[nodes.length - 1];
      value = getNodeDataViewValue(lastNode);
      if (isFreeTextData(lastNode)) {
        value = `"${value}"`;
        separator = '~';
      }
    }
    data.viewValues = { key, value, separator };
    return data;
  }

  private _emitFilterNodeChanges(added: NodeData | null = null, removed: NodeData[] | null = null): void {
    this._filterNodesChanges.next({ added, removed });
  }

  private _switchDataSource(dataSource: DtFilterFieldDataSource): void {
    if (this._dataSource) {
      this._dataSource.disconnect();
    }

    if (this._dataSubscription) {
      this._dataSubscription.unsubscribe();
      this._dataSubscription = null;
    }

    this._dataSource = dataSource;
    this._dataControl = new DtFilterFieldControl(dataSource, this);

    this._dataSubscription = this._dataControl.changes.pipe(takeUntil(this._destroy)).subscribe((dataNode) => {
      this._currentRenderNode = dataNode;
      this._changeDetectorRef.markForCheck();
    });
  }
}
