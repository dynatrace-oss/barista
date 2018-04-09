import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  ElementRef,
  ContentChildren,
  QueryList,
  Input,
  NgZone,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  AfterContentInit,
  OnDestroy,
  forwardRef,
  Optional
} from '@angular/core';

import {
  mixinDisabled,
  CanDisable,
  mixinTabIndex,
  HasTabIndex,
} from '@dynatrace/angular-components/core';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, SPACE } from '@angular/cdk/keycodes';

import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { merge } from 'rxjs/observable/merge';
import { take } from 'rxjs/operators/take';
import { switchMap } from 'rxjs/operators/switchMap';
import { startWith } from 'rxjs/operators/startWith';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { SelectionModel } from '@angular/cdk/collections';

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

  @Output() readonly valueChange: EventEmitter<T> = new EventEmitter<T>();

  // tslint:disable-next-line
  @ContentChildren(forwardRef(() => DtButtongroupItem), {descendants: true})
  private _options: QueryList<DtButtongroupItem<T>>;

  private _compareWith = (o1: T, o2: T) => o1 === o2;
  // tslint:disable-next-line:no-any
  private _destroy = new Subject<any>();
  private _selectionModel: SelectionModel<DtButtongroupItem<T>>;
  private _value: T | undefined;

  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _ngZone: NgZone,
      _elementRef: ElementRef
  ) {
    super(_elementRef);
  }

  /** Value of the buttongroup. */
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
        return false;
      }
    });

    return correspondingOption;
  }

  /** Combined stream of all of the child options' change events. */
  selectionChanges: Observable<DtButtonGroupItemSelectionChange<T>> = defer(() => {
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
  }

  clearSelection(): void {
    this._selectItem(false, undefined);
  }

  selectValue(value: T): void {
    this._setSelectionByValue(value, false);
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

/** Event object emitted by GhOption when selected or deselected. */
export interface DtButtonGroupItemSelectionChange<T> {
    /** Reference to the option that emitted the event. */
    source: DtButtongroupItem<T>;
    /** Whether the change in the option's value was a result of a user action. */
    isUserInput: boolean;
}

// Boilerplate for applying mixins to DtButtonGroupItem
export class DtButtonGroupItemBase {
  disabled: boolean;
  constructor(public _elementRef: ElementRef) { }
}

export const _DtButtongroupItem =
mixinTabIndex(DtButtonGroupItemBase);

@Component({
  moduleId: module.id,
  selector: 'dt-buttongroup-item',
  template: `<ng-content></ng-content>`,
  host: {
    'role': 'button',
    '[attr.tabindex]': 'tabIndex',
    '[class.dt-buttongroup-item-selected]': 'selected',
    '[class.dt-buttongroup-item-disabled]': 'disabled',
    'class': 'dt-buttongroup-item',
    '(click)': '_selectViaInteraction()',
    '(keydown)': '_handleKeydown($event)',
  },
  styleUrls: ['buttongroup-item.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtButtongroupItem<T> extends _DtButtongroupItem implements CanDisable, HasTabIndex  {


  private _selected: boolean;
  private _value: T;
  private _disabled = false;

  @Output() readonly selectionChange = new EventEmitter<DtButtonGroupItemSelectionChange<T>>();

  constructor(private _buttonGroup: DtButtongroup<T>,
              private _changeDetectorRef: ChangeDetectorRef,
              _elementRef: ElementRef
  ) {
    super(_elementRef);
  }

  /** Whether the buttongroup item is selected. */
  @Input()
  get selected(): boolean {
    return this._selected && !this.disabled;
  }
  set selected(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    const changed = this._selected !== newValue;
    this._selected = newValue;
    if (changed) {
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Whether the buttongroup item is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled  || this._buttonGroup.disabled;
  }
  set disabled(value: boolean) { this._disabled = coerceBooleanProperty(value); }

  /** The bound value. */
  @Input()
  get value(): T { return this._value; }
  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
    }
  }

  select(selected: boolean = true): void {
    this.selected = selected;
  }

  deselect(): void {
    this.selected = false;
  }

  _selectViaInteraction(): void {
    if (!this.disabled) {
      this._changeDetectorRef.markForCheck();
      this.selectionChange.emit({source: this, isUserInput: true});
    }
  }

  /** Ensures the option is selected when activated from the keyboard. */
  _handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this._selectViaInteraction();

      // Prevent the page from scrolling down and form submits.
      event.preventDefault();
    }
  }
}
