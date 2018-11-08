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
import { Subject } from 'rxjs';
import { ENTER, BACKSPACE } from '@angular/cdk/keycodes';
import { DtAutocomplete, DtAutocompleteSelectedEvent, DtAutocompleteTrigger } from '@dynatrace/angular-components/autocomplete';
import {
  DtFilterFieldNode,
  DtFilterFieldNodeValue,
  DtFilterFieldFilterNode,
  DtFilterFieldNodeGroup,
  getParents as getParentsForNode,
  DtFilterFieldNodeText,
  DtFilterFieldNodeProperty,
} from './nodes/filter-field-nodes';
import { DtFilterFieldNodesHost } from './nodes/filter-field-nodes-host';
import { DtFilterFieldTagEvent } from './filter-field-tag/filter-field-tag';

export class DtActiveFilterChangeEvent {
  constructor(
    public rootNodes: DtFilterFieldNode[],
    public activeNode: DtFilterFieldNode | null,
    public path: DtFilterFieldNodeGroup[] = [],
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

  @Output() inputChange = new EventEmitter<string>();
  @Output() activeFilterChange = new EventEmitter<DtActiveFilterChangeEvent>();
  @Output() change = new EventEmitter<void>();

  @ViewChild('autocompleteInput') _autocompleteInputEl: ElementRef;
  @ViewChild('freeTextInput') _freeTextInputEl: ElementRef;
  @ViewChild(DtAutocompleteTrigger) _autocompleteTrigger: DtAutocompleteTrigger<any>;
  @ContentChildren(DtAutocomplete) _autocompletes: QueryList<DtAutocomplete<any>>;

  get _prefixNodes(): DtFilterFieldNode[] {
    const rootNodes = this._nodesHost.rootNodes;
    return rootNodes.slice(0, this._currentNode ? rootNodes.indexOf(this._currentNode) : undefined);
  }
  get _suffixNodes(): DtFilterFieldNode[] {
    const rootNodes = this._nodesHost.rootNodes;
    return this._currentNode ? rootNodes.slice(rootNodes.indexOf(this._currentNode) + 1) : [];
  }

  get _filterByLabel(): string {
    const lastProperty = this._currentNode && this._currentNode.properties.length ?
      this._currentNode.properties[this._currentNode.properties.length - 1] : null;
    return lastProperty ? ` ${(lastProperty as DtFilterFieldNodeValue<any>).toString()}:` : '';
  }

  _nodesHost = new DtFilterFieldNodesHost();
  _currentNode: DtFilterFieldFilterNode | null = null;
  // tslint:disable-next-line:no-any
  _autocomplete: DtAutocomplete<any> | null = null;

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /**
   * @internal
   * Whether the input fields should be focused once the component is stable again.
   */
  _shouldFocusWhenStable = false;

  /**
   * @internal
   * Value of the internal input elements.
   */
  _inputValue = '';

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _zone: NgZone) { }

  ngAfterContentInit(): void {
    if (this._autocompletes) {
      const autocomplete$ = this._autocompletes.changes.pipe(
        startWith(null),
        map(() => this._autocompletes.length ? this._autocompletes.first : null));

      autocomplete$.pipe(takeUntil(this._destroy)).subscribe((autocomplete) => {
        this._autocomplete = autocomplete;
        this._changeDetectorRef.markForCheck();
      });

      autocomplete$.pipe(
        takeUntil(this._destroy),
        filter((autocomplete) => autocomplete !== null),
        // tslint:disable-next-line:no-any
        switchMap((autocomplete: DtAutocomplete<any>) => autocomplete.optionSelected))
        // tslint:disable-next-line:no-any
        .subscribe((event: DtAutocompleteSelectedEvent<any>) => { this._handleAutocompleteSelected(event); });
    }

    this._zone.onStable.pipe(takeUntil(this._destroy)).subscribe(() => {
      // If the autocomplete was previously focused but we swiched now to free text, change focus to the free texte input
      if (this._shouldFocusWhenStable) {
        // When the autocomplete closes after the user has selected an option we need to reopen the autocomplete panel
        // if the input field is still focused.
        // The reopen can be done once all microtasks have been finished (the zone is stable) and the rendering has been finished.
        // Note: Also trigger openPanel if it already open, so it does a reposition and resize
        if (this._autocomplete && this._autocompleteTrigger) {
          this._autocompleteTrigger.openPanel();
        }
        this.focus();
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  focus(): void {
    this._shouldFocusWhenStable = false;
    if (this._autocompleteInputEl) {
      this._autocompleteInputEl.nativeElement.focus();
    } else if (this._freeTextInputEl) {
      this._freeTextInputEl.nativeElement.focus();
    }
  }

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

  /**
   * @internal
   * Keep track of the values in the input fields. Write the current value to the _inputValue property
   */
  _handleInputChange(event: Event): void {
    const value = event.srcElement instanceof HTMLInputElement ? event.srcElement.value : this._inputValue;
    if (value !== this._inputValue) {
      this._inputValue = value;
      this.inputChange.emit(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  _handleInputKeyDown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    if (keyCode === BACKSPACE && !this._inputValue.length) {
      let emitChange = false;
      if (this._currentNode) {
        this._nodesHost.removeNode(this._currentNode);
        this._currentNode = null;
        emitChange = true;
      } else if (this._prefixNodes.length) {
        const node = this._prefixNodes[this._prefixNodes.length - 1];
        this._nodesHost.removeNode(node);
        emitChange = true;
      }

      if (emitChange) {
        this._shouldFocusWhenStable = true;
        this._emitChangeEvent();
      }
    }
  }

  _handleInputKeyUp(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    if (keyCode === ENTER && this._inputValue.length && this._freeTextInputEl) {
     this._handleFreeTextSubmited();
    }
  }

  _handleTagRemove(event: DtFilterFieldTagEvent): void {
    if (event.node) {
      this._nodesHost.removeNode(event.node);
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
    const property = new DtFilterFieldNodeValue(event.option.value, event.option.viewValue);
    this._addPropertyToCurrentFilterNode(property);

    // Reset input value to empty string after handling the value provided by the autocomplete.
    // Otherwise the value of the autocomplete would be in the input elements.
    this._writeInputValue('');

    // Clear any previous selected option.
    this._autocomplete!.options.forEach((option) => {
      if (option.selected) { option.deselect(); }
    });

    this._shouldFocusWhenStable = true;
    this._emitChangeEvent();
    this._changeDetectorRef.markForCheck();
  }

  private _handleFreeTextSubmited(): void {
    const property = new DtFilterFieldNodeText(this._inputValue);
    this._addPropertyToCurrentFilterNode(property);

    this._shouldFocusWhenStable = true;
    this._writeInputValue('');
    this._emitChangeEvent();
    this._changeDetectorRef.markForCheck();
  }

  /** Write a value to the native input elements and set _inputValue property  */
  private _writeInputValue(value: string): void {
    // tslint:disable:no-unused-expression
    this._autocompleteInputEl && (this._autocompleteInputEl.nativeElement.value = value);
    this._freeTextInputEl && (this._freeTextInputEl.nativeElement.value = value);
    // tslint:enable:no-unused-expression
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
