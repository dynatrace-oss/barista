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
} from '@angular/core';
import {
  DtAutocomplete,
  DtAutocompleteSelectedEvent,
} from '@dynatrace/barista-components/autocomplete';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import {
  CanDisable,
  DtOption,
  ErrorStateMatcher,
  HasTabIndex,
  mixinDisabled,
  mixinErrorState,
  mixinTabIndex,
} from '@dynatrace/barista-components/core';
import { DtFormFieldControl } from '@dynatrace/barista-components/form-field';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';

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
    role: 'listbox',
    '[class.dt-checkbox-disabled]': 'disabled',
    '[class.dt-checkbox-invalid]': 'errorState',
    '[class.dt-checkbox-required]': 'required',
    '[class.dt-checkbox-open]': '_panelOpen',
    '[attr.id]': 'id',
    '[attr.tabindex]': 'tabIndex',
    // '[attr.aria-label]': '_getAriaLabel()',
    // '[attr.aria-labelledby]': '_getAriaLabelledby()',
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
    AfterViewInit,
    OnDestroy,
    CanDisable,
    HasTabIndex,
    DtFormFieldControl<T> {
  @Input() id: string;
  @Input() value: T | null;
  @Input() loading: boolean = false;
  @Input() required: boolean = false;
  @Input() panelClass: string = '';
  @Input() placeholder: string | undefined;
  @Input() compareWith: (v1: T, v2: T) => boolean = (v1, v2) => v1 === v2;
  @Input() displayWith: (value: T) => string = (value: T) => `${value}`;

  @Input() autofilled?: boolean | undefined;
  @Input() focused: boolean;

  @Output() valueChange = new EventEmitter<T>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() openedChange = new EventEmitter<boolean>();

  @ViewChild('searchInput', { static: true }) _searchInput: ElementRef;
  @ViewChild('autocompleteContent') templatePortalContent: TemplateRef<any>;
  @ViewChild(DtAutocomplete) _autocomplete: DtAutocomplete<T>;

  @ContentChildren(DtOption, { descendants: true })
  _options: QueryList<DtOption<T>>;

  get empty(): boolean {
    return this.value === null;
  }
  _displayString = '';
  _panelOpen = false;

  private _filterChangeSubscription: Subscription;

  constructor(
    public _elementRef: ElementRef,
    @Optional() public _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() public _parentForm: NgForm,
    @Optional() public _parentFormGroup: FormGroupDirective,
    @Optional() public ngControl: NgControl,
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(
      _elementRef,
      _defaultErrorStateMatcher,
      _parentForm,
      _parentFormGroup,
      ngControl,
    );
  }

  ngOnInit(): void {
    this._filterChangeSubscription = fromEvent(
      this._searchInput.nativeElement,
      'keyup',
    )
      .pipe(
        map((event: KeyboardEvent): string => {
          event.stopPropagation();
          return this._searchInput.nativeElement.value;
        }),
        distinctUntilChanged(),
        debounceTime(150),
      )
      .subscribe((query) => this.filterChange.emit(query));
  }

  ngAfterViewInit(): void {
    this._autocomplete._additionalPortal = new TemplatePortal(
      this.templatePortalContent,
      this._viewContainerRef,
    );
    this._autocomplete._additionalOptions = this._options.toArray();
  }

  ngOnDestroy(): void {
    this._filterChangeSubscription.unsubscribe();
  }

  toggle(): void {
    this.openedChange.emit(true);
  }

  optionSelected(event: DtAutocompleteSelectedEvent<T>): void {
    const value = event.option.value;

    this.value = value;
    this._changeDetectorRef.markForCheck();

    this.valueChange.emit(value);
  }

  setDescribedByIds(ids: string[]): void {
    console.log(`setDescribedByIds(${ids})`);
  }

  onContainerClick(event: MouseEvent): void {
    console.log(`onContainerClick(${event})`);
  }

  _opened(): void {
    this._panelOpen = true;
    this.openedChange.emit(true);
    this._changeDetectorRef.markForCheck();
  }

  _closed(): void {
    this._panelOpen = false;
    this.openedChange.emit(false);
    this._changeDetectorRef.markForCheck();
  }
}
