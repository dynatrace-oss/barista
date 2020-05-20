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

import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

type ValidationResult = { [key: string]: any } | null;

/** Base class for float value validators */
abstract class NumberValidator implements Validator {
  /** @inheritdoc */
  validate(control: AbstractControl): ValidationResult {
    if (isNaN(control.value)) {
      return { noValue: true };
    }
    return this.validateNumber(parseFloat(control.value));
  }

  /**
   * Performs synchronous validation against the provided number.
   * @see {@link Validator#validate}
   */
  abstract validateNumber(value: number): ValidationResult;
}

/** Validator for positive exponents */
@Directive({
  selector: '[designTokensUiValidateExponent]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ExponentValidateDirective,
      multi: true,
    },
  ],
})
export class ExponentValidateDirective extends NumberValidator {
  validateNumber(value: number): ValidationResult {
    if (value <= 0) {
      return { greaterThanZero: true };
    }
    return null;
  }
}

const MIN_CONTRAST = 1;
const MAX_CONTRAST = 21;

/** Validator for Leonardo-compatible contrast values */
@Directive({
  selector: '[designTokensUiValidateContrast]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ContrastValidateDirective,
      multi: true,
    },
  ],
})
export class ContrastValidateDirective extends NumberValidator {
  validateNumber(value: number): ValidationResult {
    if (value < MIN_CONTRAST) {
      return { tooSmall: true };
    }
    if (value > MAX_CONTRAST) {
      return { tooBig: true };
    }
    return null;
  }
}
