import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  isDevMode,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';

import {CanDisable, HasTabIndex, mixinDisabled, mixinTabIndex} from '../core/index';

import {Observable} from 'rxjs/Observable';
import {defer} from 'rxjs/observable/defer';
import {merge} from 'rxjs/observable/merge';
import {take} from 'rxjs/operators/take';
import {switchMap} from 'rxjs/operators/switchMap';
import {startWith} from 'rxjs/operators/startWith';
import {takeUntil} from 'rxjs/operators/takeUntil';
import {Subject} from 'rxjs/Subject';
import {SelectionModel} from '@angular/cdk/collections';
import {DtButtonGroupItem, DtButtonGroupItemSelectionChange} from './button-group-item';

export class DtButtonGroupBase {
  constructor(public _elementRef: ElementRef) {
  }
}

export const _DtButtonGroup =
  mixinTabIndex(mixinDisabled(DtButtonGroupBase));

@Component({
  moduleId: module.id,
  selector: 'dt-button-group',
  template: '<ng-content></ng-content>',
  styleUrls: ['button-group.scss'],
  inputs: ['disabled', 'tabIndex'],
  host: {
    'class': 'dt-button-group',
    '[attr.aria-disabled]': 'disabled.toString()',
    'aria-multiselectable': 'false',
    'role': 'radiogroup',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtButtonGroup<T> extends _DtButtonGroup implements CanDisable, HasTabIndex, OnInit,
  OnDestroy, AfterContentInit {

  @Output()
  readonly valueChange: EventEmitter<T> = new EventEmitter<T>();

  // tslint:disable-next-line:no-forward-ref
  @ContentChildren(forwardRef(() => DtButtonGroupItem), {descendants: true})
  private _items: QueryList<DtButtonGroupItem<T>>;

  private _compareWith = (o1: T, o2: T) => o1 === o2;
  // tslint:disable-next-line:no-any
  private _destroy = new Subject<any>();
  private _selectionModel: SelectionModel<DtButtonGroupItem<T>>;
  private _value: T | undefined;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    _elementRef: ElementRef
  ) {
    super(_elementRef);
  }

  @Input()
  get value(): T | undefined {
    return !this.disabled ? this._value : undefined;
  }

  set value(newValue: T | undefined) {
    if (this._items) {
      const correspondingOption = newValue !== undefined ? this._findItemForValue(newValue) : undefined;
      this._selectItem(false, correspondingOption);
    } else {
      this._value = newValue;
    }
  }

  /**
   * A function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned.
   */
  @Input()
  get compareWith(): (o1: T, o2: T) => boolean {
    return this._compareWith;
  }

  set compareWith(fn: (o1: T, o2: T) => boolean) {
    this._compareWith = fn;
    if (this._selectionModel) {
      // A different comparator means the selection could change.
      this._initializeSelection();
    }
  }

  selectValue(value: T): void {
    this.value = value;
  }

  /** Combined stream of all of the child options' change events. */
  private selectionChanges: Observable<DtButtonGroupItemSelectionChange<T>> = defer(() => {
    if (this._items) {
      // This will create an array of selectionChange Observables and
      // then combine/merge them into one so we can later easily subscribe
      // to all at once and get the event (the option plus isUserEvent flag)
      // of the triggered option
      return merge(...this._items.map((option) => option.selectionChange));
    }

    return this._ngZone.onStable
      .asObservable()
      .pipe(take(1), switchMap(() => this.selectionChanges));
  });

  private _initializeSelection(): void {
    // Defer setting the value in order to avoid the "Expression
    // has changed after it was checked" errors from Angular.

    // tslint:disable-next-line:no-floating-promises
    Promise.resolve().then(() => {
      // ensure selection, or selected value
      this.value = this._value;
    })
    ;
  }

  private _findItemForValue(value: T): DtButtonGroupItem<T> | undefined {
    return this._items.find((option: DtButtonGroupItem<T>) => {
      try {
        // Treat null as a special reset value.
        return option.value !== null && this._compareWith(option.value, value);
      } catch (error) {
        if (isDevMode()) {
          // tslint:disable-next-line:no-console
          console.error('Error in compareWith', error);
        }

        return false;
      }
    });
  }

  ngOnInit(): void {
    this._selectionModel = new SelectionModel<DtButtonGroupItem<T>>(false, undefined, false);
  }

  ngAfterContentInit(): void {
    this._items.changes
      .pipe(startWith(null), takeUntil(this._destroy))
      .subscribe(() => {
        this._reset();
        this._initializeSelection();
      });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  private _reset(): void {
    this.selectionChanges
      .pipe(takeUntil(merge<DtButtonGroupItem<T>>(this._destroy, this._items.changes)))
      .subscribe((evt) => {

        this._selectItem(true, evt.isDeselection ? undefined : evt.source);
      });
    const selectedItem = this._items.find((item) => item.selected);
    if (selectedItem !== undefined) {
      this._selectItem(false, selectedItem);
    }
  }

  private _clearSelection(skip?: DtButtonGroupItem<T>): void {
    this._selectionModel.clear();
    this._items.forEach((option) => {
      if (option !== skip) {
        option.deselect();
      }
    });
  }

  private _selectItem(fireEvent: boolean, newOption?: DtButtonGroupItem<T>): void {

    let option = newOption;

    if (option === undefined) {
      option = this._items.find((item) => !item.disabled && item.selected);
      if (option === undefined) {
        option = this._items.find((item) => !item.disabled);
      }
    }

    if ((option !== undefined && this._selectionModel.isSelected(option))
      || (option === undefined && !this._selectionModel.hasValue())) {

      return;
    }

    this._clearSelection(option);

    if (option !== undefined) {
      this._selectionModel.select(option);
      option.select();
      this._value = option.value;
    } else {
      this._selectionModel.clear();
      this._value = undefined;
    }

    if (fireEvent) {
      this.valueChange.emit(this._value);
    }
    this._changeDetectorRef.markForCheck();
  }
}
