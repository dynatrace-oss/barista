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
  Inject,
} from '@angular/core';
import {
  DtAutocomplete,
  DtAutocompleteSelectedEvent,
  DtAutocompleteTrigger,
} from '@dynatrace/barista-components/autocomplete';
import { fromEvent, Subject, Observable, defer, merge } from 'rxjs';
import {
  map,
  takeUntil,
  take,
  switchMap,
  startWith,
  tap,
  debounceTime,
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
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { DOCUMENT } from '@angular/common';

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

export class DtComboboxFilterChange {
  constructor(public filter: string, public isResetEvent: boolean = false) {}
}

// We need to save the instance of the combobox that currently
// has a flap open, to make sure we can close the old one.
let currentlyOpenCombobox: DtCombobox<any> | null = null;

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
    // Moved dt-combobox-open to trigger, because the host seems to be out of sync with the members when using
    // a class binding on the host
    '[class.dt-combobox-loading]': '_loading',
    '[class.dt-combobox-disabled]': 'disabled',
    '[class.dt-combobox-invalid]': 'errorState',
    '[class.dt-combobox-required]': 'required',
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
export class DtCombobox<T>
  extends _DtComboboxMixinBase
  implements
    OnInit,
    AfterContentInit,
    AfterViewInit,
    OnDestroy,
    CanDisable,
    HasTabIndex,
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
      this._value = newValue;
      this._setSelectionByValue(newValue);
      this._resetInputValue();
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
        this._closePanel();
      } else if (this.focused) {
        this._openPanel();
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

  /**
   * Function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned. This function is needed to match new options that come in at runtime with the value
   * that was stored previously.
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
    } else {
      this._compareWith = fn;
    }

    if (this._selectionModel) {
      // A different comparator means the selection could change.
      this._initializeSelection();
    }
  }
  private _compareWith = (v1: T, v2: T) => v1 === v2;

  /** Event emitted when a new value has been selected. */
  @Output() valueChange = new EventEmitter<T>();
  /** Event emitted when the filter changes. */
  @Output() filterChange = new EventEmitter<DtComboboxFilterChange>();
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
  _autocompleteTrigger: DtAutocompleteTrigger<T>;

  /** @internal The elementRef of the input used internally */
  @ViewChild('searchInput', { static: true }) _searchInput: ElementRef;
  /**
   * @internal The templateRef used to capture the options passed via ng-content
   * to pass through to the autocomplete
   */
  @ViewChild('autocompleteContent') _templatePortalContent: TemplateRef<any>;
  /** @internal The autocomplete instance that holds all options */
  @ViewChild(DtAutocomplete, { static: true }) _autocomplete: DtAutocomplete<T>;

  /** @internal The options received via ng-content */
  @ContentChildren(DtOption, { descendants: true })
  _options: QueryList<DtOption<T>>;

  /** Whether the selection is currently empty. */
  get empty(): boolean {
    return !this._selectionModel || this._selectionModel.isEmpty();
  }

  /** The currently selected option. */
  get selected(): DtOption<T> {
    return this._selectionModel && this._selectionModel.selected[0];
  }

  get focused(): boolean {
    return this._searchInput.nativeElement === this._document.activeElement;
  }

  /** @internal whether the autocomplete panel is shown. Initially false. */
  _panelOpen = false;

  /** @internal Deals with the selection logic. */
  _selectionModel: SelectionModel<DtOption<T>>;

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /** @internal Helps determine if the selection happened programmatically, or the first time. */
  private _initialOptionChange: boolean = true;

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
    @Inject(DOCUMENT) private _document: any,
  ) {
    super(
      _elementRef,
      _defaultErrorStateMatcher,
      _parentForm,
      _parentFormGroup,
      ngControl,
    );

    this.tabIndex = parseInt(tabIndex, 10) || 0;

    // Force setter to be called in case id was not specified.
    this.id = this.id;
  }

  ngOnInit(): void {
    this._selectionModel = new SelectionModel<DtOption<T>>();
    this.stateChanges.next();

    fromEvent(this._searchInput.nativeElement, 'input')
      .pipe(
        tap(() => this._openPanel()),
        debounceTime(100),
        map((event: KeyboardEvent): string => {
          event.stopPropagation();
          return this._searchInput.nativeElement.value;
        }),
        takeUntil(this._destroy),
      )
      .subscribe((query) => {
        this.filterChange.emit(new DtComboboxFilterChange(query));
      });
    fromEvent(this._searchInput.nativeElement, 'blur')
      .pipe(takeUntil(this._destroy))
      .subscribe(() => {
        this._resetInputValue();
      });

    this._autocomplete.opened.pipe(takeUntil(this._destroy)).subscribe(() => {
      this._closeOtherComboboxInstances();
    });
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
    this._options.changes
      .pipe(startWith(null))
      .pipe(takeUntil(this._destroy))
      .subscribe(() => {
        this._autocomplete._additionalOptions = this._options.toArray();
        // To prevent an expression has changed after checked
        // error in the when setting the value.
        Promise.resolve().then(() => {
          this._setSelectionByValue(this._value, this._initialOptionChange);
        });

        if (this._initialOptionChange) {
          this._initializeSelection();
          this._initialOptionChange = false;
        }
      });

    this._autocompleteTrigger.panelClosingActions.subscribe((event) => {
      // Whenever the panelCloses without a selection event we need to reset the
      // value in the input to the currently selected value
      if (!event) {
        this._resetInputValue();
      }
    });

    this._resetInputValue();
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  // /** Sets the list of element IDs that currently describe this control. Part of the FormFieldControl */
  setDescribedByIds(_: string[]): void {
    // TODO ChMa: implement (what does this even do?)
  }

  // /** Handles a click on the control's container.Part of the FormFieldControl */
  onContainerClick(_: MouseEvent): void {
    // TODO ChMa: implement (do we even need this handler?)
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
      this._propagateChanges();
    }

    if (wasSelected !== this._selectionModel.isSelected(option)) {
      this._propagateChanges();
    }

    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal called when user clicks on trigger,
   * stops event propagation to handle toggling correctly on the trigger
   */
  _toggle(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this._panelOpen ? this._closePanel() : this._openPanel();
    this._changeDetectorRef.markForCheck();
  }

  private _closeOtherComboboxInstances(): void {
    if (currentlyOpenCombobox && currentlyOpenCombobox !== this) {
      currentlyOpenCombobox._autocompleteTrigger.closePanel();
    }
    currentlyOpenCombobox = this;
  }

  /**
   * Opens the autocomplete panel and makes sure that all
   * other combobox panels are closed correctly.
   */
  private _openPanel(): void {
    this._autocompleteTrigger.openPanel();
  }

  /**
   * Closes the autocomplete panel and makes sure handles
   * the global autocomplete panel case correctly.
   */
  private _closePanel(): void {
    this._autocompleteTrigger.closePanel();
    currentlyOpenCombobox = null;
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
  private _propagateChanges(): void {
    const valueToEmit = this.selected ? this.selected.value : null;
    this._value = valueToEmit!;
    this.valueChange.emit(valueToEmit!);
    this._changeDetectorRef.markForCheck();
  }

  private _resetInputValue(): void {
    const value = this._writeValue();
    this.filterChange.next(new DtComboboxFilterChange(value, true));
  }

  /** Write the current selected value into the input field */
  private _writeValue(): string {
    const value = this.selected ? this.displayWith(this.selected.value) : '';
    this._searchInput.nativeElement.value = value;
    return value;
  }

  /** Handles the initial value selection */
  private _initializeSelection(): void {
    // Defer setting the value in order to avoid the "Expression
    // has changed after it was checked" errors from Angular.
    Promise.resolve().then(() => {
      this._setSelectionByValue(
        this.ngControl ? this.ngControl.value : this._value,
      );
      this._writeValue();
    });
  }

  /** Updates the selection by value using selection model and keymanager to handle the active item */
  private _setSelectionByValue(value: T, triggered: boolean = true): void {
    // If value is being reset programmatically
    if (value === null && this._selectionModel) {
      // Deselect all values in the selection model
      for (const selected of this._selectionModel.selected) {
        this._selectionModel.deselect(selected);
      }
      this._writeValue();
      this._changeDetectorRef.markForCheck();
      return;
    }

    const correspondingOption = this._selectValue(value, triggered);

    // Shift focus to the active item
    if (correspondingOption && this._autocomplete?._keyManager) {
      this._autocomplete._keyManager.setActiveItem(correspondingOption);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Searches for an option matching the value and selects it if found */
  private _selectValue(value: T, triggered: boolean): DtOption<T> | undefined {
    const correspondingOption =
      this._options &&
      this._options.find((option: DtOption<T>) => {
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

    if (correspondingOption && triggered) {
      this._selectionModel.select(correspondingOption);
    }

    return correspondingOption;
  }
}
