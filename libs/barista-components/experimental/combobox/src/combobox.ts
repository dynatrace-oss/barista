/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  Self,
  Attribute,
  AfterContentInit,
  NgZone,
} from '@angular/core';
import {
  DtAutocomplete,
  DtAutocompleteSelectedEvent,
  DtAutocompleteTrigger,
} from '@dynatrace/barista-components/autocomplete';
import { fromEvent, Subject, Observable, defer, merge } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
  take,
  switchMap,
} from 'rxjs/operators';
import {
  CanDisable,
  DtOption,
  ErrorStateMatcher,
  HasTabIndex,
  mixinDisabled,
  mixinErrorState,
  mixinTabIndex,
  DtOptionSelectionChange,
  isDefined,
  DtLogger,
  DtLoggerFactory,
  DT_COMPARE_WITH_NON_FUNCTION_VALUE_ERROR_MSG,
} from '@dynatrace/barista-components/core';
import { DtFormFieldControl } from '@dynatrace/barista-components/form-field';
import {
  FormGroupDirective,
  NgControl,
  NgForm,
  ControlValueAccessor,
} from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';

const LOG: DtLogger = DtLoggerFactory.create('DtCombobox');

/** Change event object that is emitted when the combobox value has changed. */
export class DtComboboxChange<T> {
  constructor(
    /** Reference to the combobox that emitted the change event. */
    public source: DtCombobox<T>,
    /** Current value of the combobox that emitted the event. */
    public value: T,
  ) {}
}

export class DtComboboxBase {
  constructor(
    public _elementRef: ElementRef,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl,
  ) {}
}
export const _DtComboboxMixinBase = mixinTabIndex(
  mixinDisabled(mixinErrorState(DtComboboxBase)),
);

@Component({
  selector: 'dt-combobox',
  exportAs: 'dtCombobox',
  templateUrl: 'combobox.html',
  styleUrls: ['combobox.scss'],
  host: {
    class: 'dt-combobox',
    // role: 'listbox', // TODO ChMa: a11y build still fails with "Certain ARIA roles must contain particular children"
    '[class.dt-combobox-loading]': '_loading',
    '[class.dt-combobox-disabled]': 'disabled',
    '[class.dt-combobox-invalid]': 'errorState',
    '[class.dt-combobox-required]': 'required',
    '[class.dt-combobox-open]': '_panelOpen',
    '[attr.id]': 'id',
    '[attr.tabindex]': 'tabIndex',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': 'errorState',
  },
  inputs: ['disabled', 'tabIndex'],
  providers: [{ provide: DtFormFieldControl, useExisting: DtCombobox }],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtCombobox<T> extends _DtComboboxMixinBase
  implements
    OnInit,
    AfterContentInit,
    AfterViewInit,
    OnDestroy,
    CanDisable,
    HasTabIndex,
    ControlValueAccessor,
    DtFormFieldControl<T> {
  /** The ID for the combobox. */
  @Input() id: string;
  /** The currently selected value in the combobox. */
  @Input()
  get value(): T {
    return this._value;
  }
  set value(newValue: T) {
    if (newValue !== this._value) {
      this.writeValue(newValue);
      this._value = newValue;
    }
  }
  private _value: T;

  /** When set to true, a loading indicator is shown to show to the user that data is currently being loaded/filtered. */
  @Input()
  get loading(): boolean {
    return this._loading;
  }
  set loading(value: boolean) {
    const coercedValue = coerceBooleanProperty(value);

    if (coercedValue !== this._loading) {
      this._loading = coercedValue;

      if (this._loading) {
        this._reopenAutocomplete = true;
        this._autocompleteTrigger.closePanel();
      } else if (this._reopenAutocomplete) {
        this._reopenAutocomplete = false;
        this._autocompleteTrigger.openPanel();
      }
      this._changeDetectorRef.markForCheck();
    }
  }
  _loading = false;

  /** Whether the control is required. */
  @Input() required: boolean = false;
  /** An arbitrary class name that is added to the combobox dropdown. */
  @Input() panelClass: string = '';
  /** A placeholder text for the input field. */
  @Input() placeholder: string | undefined;
  /** A function returning a display name for a given object that represents an option from the combobox. */
  @Input() displayWith: (value: T) => string = (value: T) => `${value}`;
  /** Aria label of the combobox. */
  @Input('aria-label') ariaLabel: string;
  /** Input that can be used to specify the `aria-labelledby` attribute. */
  @Input('aria-labelledby') ariaLabelledBy: string;
  /** Whether the control is focused. (TODO ChMa: implement!) */
  @Input() focused: boolean;

  /**
   * Function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned.
   * Defaults to value equality.
   */
  @Input()
  get compareWith(): (v1: T, v2: T) => boolean {
    return this._compareWith;
  }
  set compareWith(fn: (v1: T, v2: T) => boolean) {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof fn !== 'function') {
      LOG.error(DT_COMPARE_WITH_NON_FUNCTION_VALUE_ERROR_MSG);
    }
    this._compareWith = fn;
    if (this._selectionModel) {
      // A different comparator means the selection could change.
      this._initializeSelection();
    }
  }
  private _compareWith = (v1: T, v2: T) => v1 === v2;

  /** Event emitted when a new value has been selected. */
  @Output() valueChange = new EventEmitter<T>();
  /** Event emitted when the selected value has been changed by the user. */
  @Output() readonly selectionChange = new EventEmitter<DtComboboxChange<T>>();
  /** Event emitted when the filter changes. */
  @Output() filterChange = new EventEmitter<string>();
  /** Event emitted when the combobox panel has been toggled. */
  @Output() openedChange = new EventEmitter<boolean>();

  /** Combined stream of all of the child options' change events. */
  readonly optionSelectionChanges: Observable<
    DtOptionSelectionChange<T>
  > = defer(() => {
    if (this._options) {
      return merge<DtOptionSelectionChange<T>>(
        ...this._options.map((option) => option.selectionChange),
      );
    }

    return this._ngZone.onStable.asObservable().pipe(
      take(1),
      switchMap(() => this.optionSelectionChanges),
    );
  });

  /** @internal The trigger of the internal autocomplete trigger */
  @ViewChild('autocompleteTrigger', { static: true })
  _autocompleteTrigger: DtAutocompleteTrigger<any>;
  /** @internal The elementRef of the input used internally */
  @ViewChild('searchInput', { static: true }) _searchInput: ElementRef;
  /**
   * @internal The templateRef used to capture the options passed via ng-content
   * to pass through to the autocomplete
   */
  @ViewChild('autocompleteContent') _templatePortalContent: TemplateRef<any>;
  /** @internal The autocomplete instance that holds all options */
  @ViewChild(DtAutocomplete) _autocomplete: DtAutocomplete<T>;

  /** @internal The options received via ng-content */
  @ContentChildren(DtOption, { descendants: true })
  _options: QueryList<DtOption<T>>;

  /** @return <code>false</code> if no value is currently selected. */
  get empty(): boolean {
    return !this._selectionModel || this._selectionModel.isEmpty();
  }

  /** The currently selected option. */
  get selected(): DtOption<T> {
    return this._selectionModel.selected[0];
  }

  /** The value displayed in the trigger. */
  get triggerValue(): string {
    return !this.empty ? this._selectionModel.selected[0].viewValue : '';
  }

  /** @internal is <code>false</code> if the autocomplete panel is not shown */
  _panelOpen = false;

  /** @internal `View -> model callback called when value changes` */
  _onChange: (value: any) => void = () => {};

  /** @internal `View -> model callback called when combobox has been touched` */
  _onTouched = () => {};

  /** @internal Deals with the selection logic. */
  _selectionModel: SelectionModel<DtOption<T>>;

  private _reopenAutocomplete = false;
  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  constructor(
    public _elementRef: ElementRef,
    @Optional() public _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() public _parentForm: NgForm,
    @Optional() public _parentFormGroup: FormGroupDirective,
    @Self() @Optional() public ngControl: NgControl,
    @Attribute('tabindex') tabIndex: string,
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
  ) {
    super(
      _elementRef,
      _defaultErrorStateMatcher,
      _parentForm,
      _parentFormGroup,
      ngControl,
    );

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this.tabIndex = parseInt(tabIndex, 10) || 0;

    // Force setter to be called in case id was not specified.
    this.id = this.id;
  }

  ngOnInit(): void {
    this._selectionModel = new SelectionModel<DtOption<T>>();
    this.stateChanges.next();

    fromEvent(this._searchInput.nativeElement, 'input')
      .pipe(
        map((event: KeyboardEvent): string => {
          event.stopPropagation();
          return this._searchInput.nativeElement.value;
        }),
        distinctUntilChanged(),
        debounceTime(150),
        takeUntil(this._destroy),
      )
      .subscribe((query) => this.filterChange.emit(query));
  }

  ngAfterContentInit(): void {
    this._selectionModel.changed
      .pipe(takeUntil(this._destroy))
      .subscribe((event) => {
        event.added.forEach((option) => {
          option.select();
        });
        event.removed.forEach((option) => {
          option.deselect();
        });
      });
  }

  ngAfterViewInit(): void {
    this._autocomplete._additionalPortal = new TemplatePortal(
      this._templatePortalContent,
      this._viewContainerRef,
    );
    this._autocomplete._additionalOptions = this._options.toArray();
    this._autocompleteTrigger.registerOnChange(() => this._onChange);
    this._autocompleteTrigger.registerOnTouched(() => this._onTouched);
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  /** Toggles the panel containing the options of the combobox */
  toggle(): void {
    // TODO: note that currently if the toggle method is called inside an event handler
    // e.g. onclick of a button and the event is not stopped from bubbling to the document
    // the click outside event stream in the autocomplete fires and immediately closes the overlay after opening
    if (this._panelOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /** Opens the panel containing the options of the combobox */
  open(): void {
    this._panelOpen = true;
    this._autocompleteTrigger.openPanel(); // implicitly triggers _opened()
    this._changeDetectorRef.markForCheck();
  }

  /** Closes the panel containing the options of the combobox */
  close(): void {
    this._panelOpen = false;
    this._autocompleteTrigger.closePanel(); // implicitly triggers _closed()
    this._changeDetectorRef.markForCheck();
  }

  /** Sets the list of element IDs that currently describe this control. */
  setDescribedByIds(_: string[]): void {
    // TODO ChMa: implement (what does this even do?)
  }

  /** Handles a click on the control's container. */
  onContainerClick(_: MouseEvent): void {
    // TODO ChMa: implement (do we even need this handler?)
  }

  /** Sets the combobox's value. Part of the ControlValueAccessor. */
  writeValue(value: T): void {
    if (this._options) {
      this._setSelectionByValue(value);
      if (this._autocompleteTrigger) {
        this._autocompleteTrigger.writeValue(value);
      }
    }
  }

  /**
   * Saves a callback function to be invoked when the select's value
   * changes from user input. Part of the ControlValueAccessor.
   */
  registerOnChange(fn: (value: any) => {}): void {
    this._onChange = fn;
    this._autocompleteTrigger.registerOnChange(fn);
  }

  /**
   * Saves a callback function to be invoked when the combobox is blurred
   * by the user. Part of the ControlValueAccessor.
   */
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
    this._autocompleteTrigger.registerOnTouched(fn);
  }

  /** Disables the combobox. Part of the ControlValueAccessor. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }

  /** @internal called when the user selects a different option */
  _optionSelected(event: DtAutocompleteSelectedEvent<T>): void {
    const option = event.option;
    const wasSelected = this._selectionModel.isSelected(option);

    if (isDefined(option.value)) {
      if (option.selected) {
        this._selectionModel.select(option);
      } else {
        this._selectionModel.deselect(option);
      }
    } else {
      option.deselect();
      this._selectionModel.clear();
      this._propagateChanges(option.value);
    }

    if (wasSelected !== this._selectionModel.isSelected(option)) {
      this._propagateChanges();
    }

    this.stateChanges.next();

    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal called when user clicks on trigger,
   * stops event propagation to handle toggling correctly on the trigger
   */
  _toggle(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.toggle();
  }

  /** @internal called when dt-autocomplete emits an open event */
  _opened(): void {
    this._panelOpen = true;
    this.openedChange.emit(true);
    this._changeDetectorRef.markForCheck();
  }

  /** @internal called when dt-autocomplete emits a close event */
  _closed(): void {
    this._panelOpen = false;
    this.openedChange.emit(false);
    this._changeDetectorRef.markForCheck();
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(fallbackValue?: T): void {
    const valueToEmit = this.selected ? this.selected.value : fallbackValue;
    this._value = valueToEmit!;
    this.valueChange.emit(valueToEmit);
    this._onChange(valueToEmit!);
    this.selectionChange.emit(new DtComboboxChange(this, valueToEmit!));
    this._changeDetectorRef.markForCheck();
  }

  /** Handles the initial value selection */
  private _initializeSelection(): void {
    // Defer setting the value in order to avoid the "Expression
    // has changed after it was checked" errors from Angular.
    Promise.resolve().then(() => {
      this._setSelectionByValue(
        this.ngControl ? this.ngControl.value : this._value,
      );
    });
  }

  /** Updates the selection by value using selection model and keymanager to handle the active item */
  private _setSelectionByValue(value: T): void {
    this._selectionModel.clear();
    const correspondingOption = this._selectValue(value);

    // Shift focus to the active item. Note that we shouldn't do this in multiple
    // mode, because we don't know what option the user interacted with last.
    if (correspondingOption && this._autocomplete?._keyManager) {
      this._autocomplete._keyManager.setActiveItem(correspondingOption);
    }

    this._changeDetectorRef.markForCheck();
  }

  /** Searches for an option matching the value and selects it if found */
  private _selectValue(value: T): DtOption<T> | undefined {
    const correspondingOption = this._options.find((option: DtOption<T>) => {
      try {
        // Treat null as a special reset value.
        return (
          isDefined(option.value) && this._compareWith(option.value, value)
        );
      } catch (error) {
        // Notify developers of errors in their comparator.
        LOG.warn(error);
        return false;
      }
    });

    if (correspondingOption) {
      this._selectionModel.select(correspondingOption);
    }

    return correspondingOption;
  }
}
