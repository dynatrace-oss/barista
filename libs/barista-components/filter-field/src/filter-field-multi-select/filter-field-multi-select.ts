/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { ActiveDescendantKeyManager, Highlightable } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { TemplatePortal } from '@angular/cdk/portal';
/* eslint-disable @angular-eslint/template/cyclomatic-complexity */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { DtOption } from '@dynatrace/barista-components/core';
import { merge, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { DtFilterFieldElement } from '../shared/filter-field-element';
import { DtNodeDef, isDtGroupDef } from '../types';

let _uniqueIdCounter = 0;

export class DtFilterFieldMultiSelectSubmittedEvent<T> {
  constructor(
    /** Reference to the filter field multiSelect panel that emitted the event. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public source: DtFilterFieldMultiSelect<any>,
    /** Selected option(s) */
    public multiSelect: T[],
  ) {}
}

@Component({
  selector: 'dt-filter-field-multi-select',
  templateUrl: 'filter-field-multi-select.html',
  styleUrls: ['filter-field-multi-select.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtFilterFieldMultiSelect',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtFilterFieldMultiSelect<T>
  implements DtFilterFieldElement<T>, AfterViewInit
{
  /**
   * Whether the first option should be highlighted when the multi-select panel is opened.
   * Can be configured globally through the `DT_MULTI_SELECT_DEFAULT_OPTIONS` token.
   */
  @Input()
  get autoActiveFirstOption(): boolean {
    return this._autoActiveFirstOption;
  }
  set autoActiveFirstOption(value: boolean) {
    this._autoActiveFirstOption = coerceBooleanProperty(value);
  }
  private _autoActiveFirstOption: boolean;

  /**
   * Specify the width of the multi-select panel.  Can be any CSS sizing value, otherwise it will
   * match the width of its host.
   */
  @Input() panelWidth: string | number;

  /** Function that maps an option's control value to its display value in the trigger. */
  @Input() displayWith: ((value: T) => string) | null = null;

  /** Options or groups to be displayed */
  @Input()
  get optionsOrGroups(): Array<T & DtNodeDef> {
    return this._optionsOrGroups ?? [];
  }
  set optionsOrGroups(opts: Array<T & DtNodeDef>) {
    // eslint-disable-next-line no-extra-boolean-cast
    this._optionsOrGroups = !!opts ? opts : [];
    this._filterOptions();
  }
  _optionsOrGroups: Array<T & DtNodeDef> = [];
  _filteredOptionsOrGroups: Array<T & DtNodeDef> = [];

  /** Value input by the user used to highlight and filter */
  @Input()
  get inputValue(): string {
    return this._inputValue || '';
  }
  set inputValue(value: string) {
    this._inputValue = value.toLowerCase();
    this._checkApplyDisable();
    this._filterOptions();
  }
  _inputValue: string;

  /** Event that is emitted when the filter-field multiSelect panel is opened. */
  @Output() readonly opened = new EventEmitter<void>();

  /** Event that is emitted when the filter-field multiSelect panel is closed. */
  @Output() readonly closed = new EventEmitter<void>();

  /** Event that is emitted whenever an option from the list is selected. */
  @Output() readonly multiSelectSubmitted = new EventEmitter<
    DtFilterFieldMultiSelectSubmittedEvent<T>
  >();

  /** Unique ID to be used by filter-field multiSelect trigger's "aria-owns" property. */
  id = `dt-filter-field-multiSelect-${_uniqueIdCounter++}`;

  /** Whether the filter-field multiSelect panel is open. */
  get isOpen(): boolean {
    return this._isOpen;
  }
  /** @internal Whether the filter-field multiSelect panel is open. */
  _isOpen = false;

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild(TemplateRef, { static: true }) _template: TemplateRef<any>;

  /**
   * @internal Reference to the panel which will be created in the overlay.
   */
  @ViewChild('panel') _panel: ElementRef;

  /** @internal Querylist of options to be used in keymanager */
  @ViewChildren(DtOption)
  _options = new QueryList<DtOption<T>>();

  /**
   * @internal
   * Manages active item in option list based on key events.
   */
  _keyManager: ActiveDescendantKeyManager<DtOption<T>>;

  /** @internal */
  _portal: TemplatePortal;

  /** @internal Holds the current values of the input field for the from value */
  _initialSelection: T[] = [];

  /** @internal Holds the current values of the input field for the from value */
  _currentSelection = new Map<string | null | undefined, T>();

  /** @internal Holds the current values of the input field for the from value */
  _applyDisabled: boolean;

  /** Subject used for unsubscribing */
  private _destroy$ = new Subject<void>();

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._portal = new TemplatePortal<any>(
      this._template,
      this._viewContainerRef,
    );

    // init keymanager with options
    this._keyManager = new ActiveDescendantKeyManager<DtOption<T>>(
      this._options,
    ).withWrap();

    this._options.changes
      .pipe(
        startWith(null),
        switchMap(() =>
          merge(...this._options.map((option) => option._optionHovered)),
        ),
        takeUntil(this._destroy$),
      )
      .subscribe((option) => {
        if (!option.disabled) {
          this._ngZone?.run(() => {
            this._keyManager.setActiveItem(option);
          });
        }
      });
  }

  /**
   * @internal
   * Sets the panel scrollTop. This allows us to manually scroll to display options
   * above or below the fold, as they are not actually being focused when active.
   */
  _setScrollTop(scrollTop: number): void {
    if (this._panel) {
      this._panel.nativeElement.scrollTop = scrollTop;
    }
  }

  /**
   * @internal
   * Returns the panel's scrollTop.
   */
  _getScrollTop(): number {
    return this._panel ? this._panel.nativeElement.scrollTop : 0;
  }

  /** @internal Marks the filter-field multiSelect for change detection. */
  _markForCheck(): void {
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Unique ID to be used on a local element */
  _getLocalId(suffix: string): string {
    return `${this.id}-${suffix}`;
  }

  /** Handles the submit of multiSelect values. */
  _handleSubmit(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    this._emitSelectEvent();
  }

  /**
   * @internal
   * Emits the `select` event.
   */
  _emitSelectEvent(): void {
    const currentMultiSelection = Array.from(this._currentSelection.values());

    this.multiSelectSubmitted.emit(
      new DtFilterFieldMultiSelectSubmittedEvent(this, currentMultiSelection),
    );
    // After emission we need to reset the multiSelect state, to have a fresh one
    // if another multiSelect opens.
    this._currentSelection.clear();
  }

  /** @internal Set pre selected options for the multiSelect input fields. */
  _setInitialSelection(values: Array<T & DtNodeDef>): void {
    if (Array.isArray(values) && values.length) {
      this._initialSelection = values;
      for (const value of values) {
        this._currentSelection.set(value.option?.uid, value);
      }
    } else {
      this._initialSelection = [];
      this._currentSelection.clear();
    }
    this._checkApplyDisable();
  }

  /** Toggle option */
  _toggleOption(option: Highlightable & DtOption<T>): void {
    this._toggleValue((option as DtOption<T & DtNodeDef>).value);
    this._checkApplyDisable();
  }

  /** @internal Toggle option from template */
  _toggleOptionFromTemplate(option: T & DtNodeDef): void {
    this._toggleValue(option);
    this._checkApplyDisable();
  }

  /** Check if option is selected */
  _isOptionSelected(option: T & DtNodeDef): boolean {
    return this._currentSelection.has(option.option?.uid);
  }

  /** Toggle value from current selection list */
  private _toggleValue(option: T & DtNodeDef): void {
    if (this._currentSelection.has(option.option?.uid)) {
      this._currentSelection.delete(option.option?.uid);
    } else {
      this._currentSelection.set(option.option?.uid, option);
    }
  }

  private _checkApplyDisable(): void {
    this._applyDisabled = this._currentSelection.size === 0;
  }

  private _filterOptions(): void {
    if (this.inputValue.trim().length > 0) {
      this._filteredOptionsOrGroups = this.optionsOrGroups
        .map((optOrGroup) =>
          // filter options inside groups
          // if group label matches search it should all be included
          isDtGroupDef(optOrGroup) &&
          !optOrGroup.group.label.toLowerCase().includes(this._inputValue)
            ? {
                ...optOrGroup,
                group: {
                  ...optOrGroup.group,
                  options: optOrGroup.group?.options.filter((option) =>
                    option.option?.viewValue
                      .toLowerCase()
                      .includes(this._inputValue),
                  ),
                },
              }
            : optOrGroup,
        )
        .filter((optOrGroup) =>
          // filter non grouped options
          isDtGroupDef(optOrGroup)
            ? optOrGroup.group?.options?.length
            : optOrGroup.option?.viewValue
                .toLowerCase()
                .includes(this._inputValue),
        );
    } else {
      this._filteredOptionsOrGroups = this.optionsOrGroups;
    }
  }

  focus(): void {
    const firstOption = this._options.find((option) => !option.disabled);
    if (firstOption) {
      this._keyManager.setActiveItem(firstOption);
    }
  }
}
