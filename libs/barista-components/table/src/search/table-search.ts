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

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Provider,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * An event emitted by the `DtTableSearch` component when the input has changed.
 */
export interface DtTableSearchChangeEvent {
  /** The source that emitted the event. */
  readonly source: DtTableSearch;
  /** The current value. */
  readonly value: string;
}

/**
 * Provider Expression that allows dt-checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 */
export const DT_TABLE_SEARCH_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define, @angular-eslint/no-forward-ref
  useExisting: forwardRef(() => DtTableSearch),
  multi: true,
};

/**
 * A search field that can be used above tables for filtering.
 *
 * Searching data for the table means filtering out rows that are passed via
 * the data source. For highlighting the matched strings in the table the
 * `DtHighlight` component can be used.
 */
@Component({
  selector: 'dt-table-search',
  exportAs: 'dtTableSearch',
  templateUrl: 'table-search.html',
  styleUrls: ['table-search.scss'],
  host: {
    class: 'dt-table-search',
  },
  providers: [DT_TABLE_SEARCH_CONTROL_VALUE_ACCESSOR],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTableSearch implements ControlValueAccessor {
  /** The current search term. */
  @Input()
  get value(): string {
    return this._value;
  }
  set value(value: string) {
    const actualValue = value || '';
    const change = this._value !== actualValue;

    this._value = actualValue;
    this._filterValueChanged.emit({ source: this, value });

    if (change && this._handleChange !== undefined) {
      this._handleChange(actualValue);
    }
  }
  private _value = '';

  /** Placeholder string for the input field (always needs to start with "Search ..."). */
  @Input()
  placeholder: string;

  /** An ARIA label describing the input field. */
  @Input('aria-label')
  ariaLabel: string;
  /** A reference to an ARIA description of the input field. */
  @Input('aria-labelledby')
  ariaLabelledBy: string;

  /** Event emitted when the user changes the search term. */
  @Output()
  readonly valueChange = new EventEmitter<DtTableSearchChangeEvent>();

  /** @internal Event emitted when the search term is changed. */
  @Output()
  readonly _filterValueChanged = new EventEmitter<DtTableSearchChangeEvent>();

  private _handleTouched?: () => void;
  private _handleChange?: (value: string) => void;

  /** @internal Executes _onTouched handler when input loses focus */
  _handleBlur(): void {
    if (this._handleTouched !== undefined) {
      this._handleTouched();
    }
  }

  /** @internal Emits a change event */
  _handleInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.valueChange.emit({ source: this, value });
  }

  /** Implemented as a part of ControlValueAccessor. */
  writeValue(value: string): void {
    this.value = value;
  }

  /** Implemented as a part of ControlValueAccessor. */
  registerOnChange(fn: (value: string) => void): void {
    this._handleChange = fn;
  }

  /** Implemented as a part of ControlValueAccessor. */
  registerOnTouched(fn: () => void = () => {}): void {
    this._handleTouched = fn;
  }
}
