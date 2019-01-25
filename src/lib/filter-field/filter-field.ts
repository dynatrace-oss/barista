import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ContentChildren,
  AfterContentInit,
  QueryList,
  ChangeDetectorRef,
  OnDestroy,
  EventEmitter,
  Output,
  NgZone,
  Input,
} from '@angular/core';
import { switchMap, map, takeUntil, filter, startWith } from 'rxjs/operators';
import { ENTER, BACKSPACE } from '@angular/cdk/keycodes';
import { Subject } from 'rxjs';
import { DtAutocomplete, DtAutocompleteSelectedEvent, DtAutocompleteTrigger } from '@dynatrace/angular-components/autocomplete';
import { readKeyCode, isDefined } from '@dynatrace/angular-components/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import {
  DtFilterFieldNode,
  DtFilterFieldValueProperty,
  DtFilterFieldFilterNode,
  DtFilterFieldGroupNode,
  getParents as getParentsForNode,
  DtFilterFieldTextProperty,
  DtFilterFieldNodeProperty,
} from './nodes/filter-field-nodes';
import { DtFilterFieldNodesHost } from './nodes/filter-field-nodes-host';
import { DtFilterFieldTagEvent } from './filter-field-tag/filter-field-tag';

export class DtActiveFilterChangeEvent {
  constructor(
    public rootNodes: DtFilterFieldNode[],
    public activeNode: DtFilterFieldNode | null,
    public path: DtFilterFieldGroupNode[] = [],
    public source: DtFilterField
  ) { }

  submitActiveFilter(viewValue?: string): void {
    if (this.activeNode) {
      this.activeNode.viewValue = viewValue;
      this.source._finishCurrentNode();
    }
  }
}

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
export class DtFilterField implements AfterContentInit, OnDestroy {

  /** Label for the filter field. Will be placed next to the filter icon. */
  @Input() label = '';

  /** Emits an event with the current value of the input field everytime the user types. */
  @Output() inputChange = new EventEmitter<string>();

  /**
   * Emits an active-filter-change event when a free text has been submitted,
   * an autocomplete option has been selected or a range has been defined
   */
  @Output() activeFilterChange = new EventEmitter<DtActiveFilterChangeEvent>();

  /** @internal Reference to the internal input element */
  @ViewChild('input') _inputEl: ElementRef;

  /** @internal The autocomplete trigger that is placed on the input element */
  @ViewChild(DtAutocompleteTrigger) _autocompleteTrigger: DtAutocompleteTrigger<any>;

  /** @internal Querylist of the autocompletes provided by ng-content */
  @ContentChildren(DtAutocomplete) _autocompletes: QueryList<DtAutocomplete<any>>;

  /** @internal Filter nodes that are rendered _before_ the input element. */
  get _prefixNodes(): DtFilterFieldNode[] {
    const rootNodes = this._nodesHost.rootNodes;
    return rootNodes.slice(0, this._currentNode ? rootNodes.indexOf(this._currentNode) : undefined);
  }

  /** @internal Filter nodes that are rendered _after_ the input element. */
  get _suffixNodes(): DtFilterFieldNode[] {
    const rootNodes = this._nodesHost.rootNodes;
    return this._currentNode ? rootNodes.slice(rootNodes.indexOf(this._currentNode) + 1) : [];
  }

  get _filterByLabel(): string {
    const lastProperty = this._currentNode && this._currentNode.properties.length ?
      this._currentNode.properties[this._currentNode.properties.length - 1] : null;
    return lastProperty ? ` ${(lastProperty as DtFilterFieldValueProperty<any>).toString()}:` : '';
  }

  _nodesHost = new DtFilterFieldNodesHost();
  _currentNode: DtFilterFieldFilterNode | null = null;
  // tslint:disable-next-line:no-any
  _autocomplete: DtAutocomplete<any> | null = null;

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

  ngAfterContentInit(): void {
    // Monitoring the host element and every focusable child element on focus an blur events.
    // This is necessary so we can detect and restore focus after the input type has been changed.
    this._focusMonitor.monitor(this._elementRef.nativeElement, true)
      .pipe(takeUntil(this._destroy))
      .subscribe((origin) => { this._isFocused = isDefined(origin); });

    // There should always be only one autocomplete active/provided at a time.
    // If there are more we will take the first one.
    // Note: We could of course use @ContentChild for this use-case, but when using
    // @ContentChildren it is more easily for us to track the autocomplete changes.
    const autocomplete$ = this._autocompletes.changes.pipe(
      startWith(null),
      map(() => this._autocompletes.length ? this._autocompletes.first : null));

    autocomplete$.pipe(takeUntil(this._destroy)).subscribe((autocomplete) => {
      if (this._autocomplete !== autocomplete) {
        this._autocomplete = autocomplete;
        this._changeDetectorRef.markForCheck();
      }
    });

    // Subscribing to the optionSelected events of the provided and active autocomplete
    autocomplete$.pipe(
      takeUntil(this._destroy),
      filter((autocomplete) => autocomplete !== null),
      // tslint:disable-next-line:no-any
      switchMap((autocomplete: DtAutocomplete<any>) => autocomplete.optionSelected))
      // tslint:disable-next-line:no-any
      .subscribe((event: DtAutocompleteSelectedEvent<any>) => { this._handleAutocompleteSelected(event); });

    this._zone.onStable.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this._isFocused) {
        if (this._autocomplete && this._autocompleteTrigger) {
          // When the autocomplete closes after the user has selected an option
          // or a new autocomplete has been provided we need to open it.
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

  /** @internal */
  _finishCurrentNode(): void {
    if (this._currentNode) {
      this._currentNode = null;
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
    const value = event.srcElement instanceof HTMLInputElement ? event.srcElement.value : this._inputValue;
    if (value !== this._inputValue) {
      this._inputValue = value;
      this.inputChange.emit(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** @internal */
  _handleInputKeyDown(event: KeyboardEvent): void {
    const keyCode = readKeyCode(event);
    if (keyCode === BACKSPACE && !this._inputValue.length) {
      if (this._currentNode) {
        this._nodesHost.removeNode(this._currentNode);
        this._currentNode = null;
        this._emitChangeEvent();
      } else if (this._prefixNodes.length) {
        const node = this._prefixNodes[this._prefixNodes.length - 1];
        this._nodesHost.removeNode(node);
        this._emitChangeEvent();
      }
    }
  }

  /** @internal */
  _handleInputKeyUp(event: KeyboardEvent): void {
    const keyCode = readKeyCode(event);
    if (keyCode === ENTER && this._inputValue.length && !this._autocomplete) {
     this._handleFreeTextSubmitted();
    }
  }

  _handleTagRemove(event: DtFilterFieldTagEvent): void {
    if (event.node) {
      this._nodesHost.removeNode(event.node);
      this._emitChangeEvent();
    }
  }

  _handleTagEdit(event: DtFilterFieldTagEvent): void {
    const node = event.node as DtFilterFieldFilterNode;
    if (node) {
      if (this._currentNode) {
        // TODO @thomas.pink: What to do here????
        throw new Error(`Can not edit tag, because there is currently another tag edited or a new on in creation`);
      }
      node.properties = [node.properties[0]];
      this._currentNode = node;
      this.focus();
      this._emitChangeEvent();
      this._changeDetectorRef.markForCheck();
    }
  }

  private _handleAutocompleteSelected(event: DtAutocompleteSelectedEvent<any>): void {
    const property = new DtFilterFieldValueProperty(event.option.value, event.option.viewValue);
    this._addPropertyToCurrentFilterNode(property);

    // Reset input value to empty string after handling the value provided by the autocomplete.
    // Otherwise the value of the autocomplete would be in the input elements.
    this._writeInputValue('');

    // Clear any previous selected option.
    this._autocomplete!.options.forEach((option) => {
      if (option.selected) { option.deselect(); }
    });

    this._emitChangeEvent();
    this._changeDetectorRef.markForCheck();
  }

  private _handleFreeTextSubmitted(): void {
    const property = new DtFilterFieldTextProperty(this._inputValue);
    this._addPropertyToCurrentFilterNode(property);

    this._writeInputValue('');
    this._emitChangeEvent();
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

  private _emitChangeEvent(node?: DtFilterFieldNode): void {
    const nodeToEmit = node || this._currentNode || null;
    this.activeFilterChange.emit(new DtActiveFilterChangeEvent(
      this._nodesHost.rootNodes,
      nodeToEmit!,
      nodeToEmit ? getParentsForNode(nodeToEmit) : [],
      this
    ));
  }

  private _peekCurrentNode(): DtFilterFieldNode {
    let currentNode = this._currentNode;
    if (!currentNode) {
      // TODO @thomas.pink: Handle non root nodes (parents, path)
      currentNode = new DtFilterFieldFilterNode();
      this._currentNode = currentNode;
      this._nodesHost.addNode(currentNode);
    }
    return currentNode;
  }

  private _addPropertyToCurrentFilterNode(property: DtFilterFieldNodeProperty): void {
    const currentNode = this._peekCurrentNode();
    if (!(currentNode instanceof DtFilterFieldFilterNode)) {
      throw new Error(`Cannot add property to current node because the node's type is not DtFilterFieldFilterNode`);
    }
    currentNode.properties.push(property);
  }
}
