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
} from '@angular/core';
import { DtAutocomplete, DtAutocompleteSelectedEvent, DtAutocompleteTrigger } from '@dynatrace/angular-components/autocomplete';
import {
  DtFilterFieldNode,
  DtFilterFieldNodeValue,
  DtFilterFieldFilterNode,
  DtFilterFieldNodeGroup,
  getParents as getParentsForNode,
} from './nodes/filter-field-nodes';
import { switchMap, map, takeUntil, filter, startWith } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DtFilterFieldTagEvent } from '@dynatrace/angular-components/filter-field/filter-field-tag/filter-field-tag';
import { DtFilterFieldNodesHost } from '@dynatrace/angular-components/filter-field/nodes/filter-field-nodes-host';

export class DtActiveFilterChangeEvent {
  constructor(
    public rootNodes: DtFilterFieldNode[],
    public activeNode: DtFilterFieldNode,
    public path: DtFilterFieldNodeGroup[] = [],
    public source: DtFilterField
  ) { }

  submitActiveFilter(viewValue?: string): void {
    this.activeNode.viewValue = viewValue;
    this.source._finishCurrentNode();
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
   * Whether the autocomplete input field is focused.
   */
  _isAutocompleteTriggerFocused = false;

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

    // When the autocomplete closes after the user has selected an option we need to reopen the autocomplete panel
    // if the input field is still focused.
    // The reopen can be done once all microtasks have been finished (the zone is stable) and the rendering has been finished.
    this._zone.onStable.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this._isAutocompleteTriggerFocused && this._autocomplete && !this._autocomplete.isOpen && this._autocompleteTrigger) {
        this._autocompleteTrigger.openPanel();
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  focus(): void {
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

  // _handleInputKeyUp(event: KeyboardEvent): void {
  //   const value = event.srcElement instanceof HTMLInputElement ? event.srcElement.value : this._inputValue;
  //   const keyCode = event.keyCode;

  //   if (this._inputValue !== value) {
  //     console.log('setting input value', value);
  //     this._inputValue = value;
  //     this.inputChange.emit(value);
  //   }

  //   this._changeDetectorRef.markForCheck();
  //   // if (keyCode === ENTER && !this._autocomplete) {
  //   //   event.preventDefault();
  //   //   this._handleInputSubmitted(value);
  //   // } else
  // }

  private _handleAutocompleteSelected(event: DtAutocompleteSelectedEvent<any>): void {
    const property = new DtFilterFieldNodeValue(event.option.value, event.option.viewValue);
    let currentNode = this._currentNode;
    if (!currentNode) {
      // TODO @thomas.pink: Handle non root nodes (parents, path)
      currentNode = new DtFilterFieldFilterNode();
      this._currentNode = currentNode;
      this._nodesHost.addNode(currentNode);
    }
    currentNode.properties.push(property);

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
    const nodeToEmit = node || this._currentNode;
    this.activeFilterChange.emit(new DtActiveFilterChangeEvent(
      this._nodesHost.rootNodes,
      nodeToEmit!,
      getParentsForNode(nodeToEmit!),
      this
    ));
  }
}
