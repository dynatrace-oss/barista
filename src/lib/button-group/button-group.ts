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

import { CanDisable, HasTabIndex, mixinDisabled, mixinTabIndex } from '@dynatrace/angular-components/core';

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
constructor(public _elementRef: ElementRef) { }
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

  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _ngZone: NgZone,
      _elementRef: ElementRef
  ) {
    super(_elementRef);
  }

  @Input()
  get value(): T | undefined {
    return this._value;
  }

  set value(newValue: T | undefined) {
    if (this._value !== newValue) {
      this.writeValue(newValue);
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

  clearSelection(): void {
    this._selectItem(false, undefined);
  }

  selectValue(value: T): void {
    this._setSelectionByValue(value, false);
  }

  private writeValue(value: T | undefined): void {
    if (this._items) {
      this._setSelectionByValue(value);
    }
  }

  /**
   * Sets the selected option based on a value. If no option can be
   * found with the designated value, the select trigger is cleared.
   */
  private _setSelectionByValue(value: T | undefined, isUserInput: boolean = false): void {
    const correspondingOption = value !== undefined ? this._findOptionForValue(value) : undefined;
    if (correspondingOption !== undefined) {
      this._selectItem(false, correspondingOption);
    }
  }

  private _initializeSelection(): void {
    // Defer setting the value in order to avoid the "Expression
    // has changed after it was checked" errors from Angular.
    Promise.resolve().then(() => {
      if (this._value !== undefined) {
        this._setSelectionByValue(this._value);
      }
    })
    .catch(() => {})
    ;
  }

  private _findOptionForValue(value: T): DtButtonGroupItem<T> | undefined {
    const correspondingOption = this._items.find((option: DtButtonGroupItem<T>) => {
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

    return correspondingOption;
  }

  ngOnInit(): void {
    this._selectionModel = new SelectionModel<DtButtonGroupItem<T>>(false, undefined, false);
  }

  ngAfterContentInit(): void {
    this._items.changes
      .pipe(startWith(null), takeUntil(this._destroy))
      .subscribe(() => {
        this._resetOptions();
        this._initializeSelection();
      });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  _resetOptions(): void {
    this.selectionChanges
      .pipe(

      takeUntil(merge<DtButtonGroupItem<T>>(this._destroy, this._items.changes)))

      .subscribe((evt) => {

        this._selectItem(true, evt.source);
      });
    const selectedItem = this._items.filter((item) => item.selected);
    if (selectedItem.length > 0) {
      this._selectItem(false, selectedItem[0]);
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

  private _selectItem(fireEvent: boolean, option?: DtButtonGroupItem<T>): void {
    if (option !== undefined) {
      const wasSelected = this._selectionModel.isSelected(option);

      if (wasSelected) {
        return;
      }

      this._clearSelection(option);
      this._selectionModel.select(option);
      option.select();
      this._value = option.value;

      if (wasSelected !== this._selectionModel.isSelected(option)) {
        if (fireEvent) {
          this.valueChange.emit(this._value);
        }
        this._changeDetectorRef.markForCheck();
      }
    } else {
      const hasValue = this._selectionModel.hasValue();

      if (!hasValue) {
        return;
      }

      this._clearSelection(option);
      this._selectionModel.clear();
      this._value = undefined;

      if (fireEvent) {
        this.valueChange.emit(this._value);
      }
      this._changeDetectorRef.markForCheck();
    }
  }
}
