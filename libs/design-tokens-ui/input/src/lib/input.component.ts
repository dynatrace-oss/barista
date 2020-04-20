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
  onChange = (_: string) => {};
  onTouched = () => {};

  constructor(private _elementRef: ElementRef) {}

  writeValue(value: string): void {
    this._elementRef.nativeElement.value =
      value !== undefined && value !== null ? value : '';
    this.onChange(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /** @internal Handles the input change - noop method */
  _onInput(event: Event): void {
    this.onChange((event.target as HTMLInputElement).value);
  }
}
