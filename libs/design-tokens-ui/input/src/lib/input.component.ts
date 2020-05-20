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

import { Directive, forwardRef, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: `input[designTokensUiInput], textarea[designTokensUiInput]`,
  host: {
    class: 'design-tokens-ui-input',
    '(input)': '_onInput($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DesignTokensUiInputComponent),
      multi: true,
    },
  ],
})
export class DesignTokensUiInputComponent implements ControlValueAccessor {
  onChange = (_: string | number) => {};
  onTouched = () => {};

  constructor(private _elementRef: ElementRef) {}

  writeValue(value: string): void {
    const convertedValue = this._convertValue(value);

    this._elementRef.nativeElement.value = convertedValue;
    this.onChange(convertedValue);
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /** @internal Handles the input change - noop method */
  _onInput(event: Event): void {
    const value = this._convertValue((event.target as HTMLInputElement).value);
    this.onChange(value);
  }

  /** Convert values in numeric input fields to numbers */
  private _convertValue(value: string): string | number {
    if (
      this._elementRef.nativeElement.getAttribute('inputmode') === 'numeric'
    ) {
      return parseFloat(value) ?? 0;
    } else {
      return value ?? '';
    }
  }
}
