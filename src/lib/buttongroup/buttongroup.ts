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
import {DtButtongroupItem, DtButtonGroupItemSelectionChange} from './buttongroup-item';

export class DtButtongroupBase {
constructor(public _elementRef: ElementRef) { }
}
export const _DtButtongroup =
mixinTabIndex(mixinDisabled(DtButtongroupBase));

@Component({
  moduleId: module.id,
  selector: 'dt-buttongroup',
  template: '<ng-content></ng-content>',
  styleUrls: ['buttongroup.scss'],
  inputs: ['disabled', 'tabIndex'],
  host: {
    'class': 'dt-buttongroup',
    '[attr.aria-disabled]': 'disabled.toString()',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtButtongroup<T> extends _DtButtongroup implements CanDisable, HasTabIndex, OnInit,
  OnDestroy, AfterContentInit {

  @Output()
  readonly valueChange: EventEmitter<T> = new EventEmitter<T>();

  // tslint:disable-next-line
  @ContentChildren(forwardRef(() => DtButtongroupItem), {descendants: true})
  private _options: QueryList<DtButtongroupItem<T>>;

  private _compareWith = (o1: T, o2: T) => o1 === o2;
  // tslint:disable-next-line:no-any
  private _destroy = new Subject<any>();
  private _selectionModel: SelectionModel<DtButtongroupItem<T>>;
  private _value: T | undefined;

  /** Combined stream of all of the child options' change events. */
  private selectionChanges: Observable<DtButtonGroupItemSelectionChange<T>> = defer(() => {
    if (this._options) {
      // This will create an array of selectionChange Observables and
      // then combine/merge them into one so we can later easily subscribe
      // to all at once and get the event (the option plus isUserEvent flag)
      // of the triggered option
      return merge(...this._options.map((option) => option.selectionChange));
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
    if (this._options) {
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

  private _findOptionForValue(value: T): DtButtongroupItem<T> | undefined {
    const correspondingOption = this._options.find((option: DtButtongroupItem<T>) => {
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
    this._selectionModel = new SelectionModel<DtButtongroupItem<T>>(false, undefined, false);
  }

  ngAfterContentInit(): void {
    this._options.changes
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

      takeUntil(merge<DtButtongroupItem<T>>(this._destroy, this._options.changes)))

      .subscribe((evt) => {

        this._selectItem(true, evt.source);
      });
    const selectedItem = this._options.filter((item) => item.selected);
    if (selectedItem.length > 0) {
      this._selectItem(false, selectedItem[0]);
    }
  }

  private _clearSelection(skip?: DtButtongroupItem<T>): void {
    this._selectionModel.clear();
    this._options.forEach((option) => {
      if (option !== skip) {
        option.deselect();
      }
    });
  }

  private _selectItem(fireEvent: boolean, option?: DtButtongroupItem<T>): void {
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
