import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ContentChild,
  ContentChildren,
  AfterContentInit,
  QueryList,
  ChangeDetectorRef,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { DtAutocomplete, DtAutocompleteSelectedEvent } from '@dynatrace/angular-components/autocomplete';
import {
  DtFilterFieldNode,
  DtFilterFieldNodeValue,
  DtFilterFieldFilterNode,
  DtFilterFieldGroup,
  getParents as getParentsForNode,
} from './nodes/filter-field-node';
import { switchMap, map, takeUntil, filter, startWith } from 'rxjs/operators';
import { Subject } from 'rxjs';

export class DtActiveFilterChangeEvent {
  constructor(
    public rootNodes: DtFilterFieldNode[],
    public activeNode: DtFilterFieldNode,
    public path: DtFilterFieldGroup[] = []
  ) { }
}

@Component({
  moduleId: module.id,
  selector: 'dt-filter-field',
  exportAs: 'dtFilterField',
  templateUrl: 'filter-field.html',
  styleUrls: ['filter-field.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtFilterField implements AfterContentInit, OnDestroy {

  @Output() inputChange = new EventEmitter<string>();
  @Output() activeFilterChange = new EventEmitter<DtActiveFilterChangeEvent>();
  @Output() change = new EventEmitter<void>();

  @ViewChild('input') _inputEl: ElementRef;
  @ContentChildren(DtAutocomplete) _autocompletes: QueryList<DtAutocomplete<any>>;

  get _prefixNodes(): DtFilterFieldNode[] {
    return this._rootNodes.slice(0, this._currentNode ? this._rootNodes.indexOf(this._currentNode) : undefined);
  }
  get _suffixNodes(): DtFilterFieldNode[] {
    return this._currentNode ? this._rootNodes.slice(this._rootNodes.indexOf(this._currentNode) + 1) : [];
  }

  get _filterByLabel(): string {
    const lastProperty = this._currentNode && this._currentNode.properties.length ?
      this._currentNode.properties[this._currentNode.properties.length - 1] : null;
    return lastProperty ? ` ${(lastProperty as DtFilterFieldNodeValue<any>).viewValue}:` : '';
  }

  _rootNodes: DtFilterFieldNode[] = [];
  _currentNode: DtFilterFieldFilterNode | null = null;
  // tslint:disable-next-line:no-any
  _autocomplete: DtAutocomplete<any> | null = null;

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  private _inputValue = '';

  constructor(private _changeDetectorRef: ChangeDetectorRef) { }

  ngAfterContentInit(): void {
    if (this._autocompletes) {
      console.log(this._autocompletes);
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
        switchMap((autocomplete: DtAutocomplete<any>) => autocomplete.optionSelected!))
        // tslint:disable-next-line:no-any
        .subscribe((event: DtAutocompleteSelectedEvent<any>) => this._handleAutocompleteSelected(event));
    }
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  _handleInputKeyUp(event: KeyboardEvent): void {
    const value = this._inputEl.nativeElement.value;
    const keyCode = event.keyCode;
    if (keyCode === ENTER && !this._autocomplete) {
      event.preventDefault();
      this._handleInputSubmitted(value);
    } else if (this._inputValue !== value) {
      this._inputValue = value;
      this.inputChange.emit(value);
    }
  }

  // tslint:disable-next-line:no-any
  private _handleAutocompleteSelected(event: DtAutocompleteSelectedEvent<any>): void {
    const property = new DtFilterFieldNodeValue(event.option.value, event.option.viewValue);
    let currentNode = this._currentNode;
    if (!currentNode) {
      // TODO @thomas.pink: Handle non root nodes (parents, path)
      currentNode = new DtFilterFieldFilterNode();
      this._currentNode = currentNode;
      this._rootNodes.push(currentNode);
    }
    currentNode.properties.push(property);
    this.activeFilterChange.emit(
      new DtActiveFilterChangeEvent(this._rootNodes, currentNode, getParentsForNode(currentNode)));
    this._restetInput();
    this._changeDetectorRef.markForCheck();
  }

  private _handleInputSubmitted(value: string): void {

  }

  private _finishCurrentNode<T>(): void {
    this._currentNode = null;
  }

  private _restetInput(): void {
    const currentValue = this._inputEl.nativeElement.value;
    if (currentValue !== '') {
      this._inputEl.nativeElement.value = '';
      this._inputValue = '';
      this.inputChange.emit('');
    }
  }
}
