/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export type DtFilterFieldValidatorFn = (
  control: DtFilterFieldControl,
) => ValidationErrors | null;

export interface DtFilterFieldValidator {
  validatorFn: DtFilterFieldValidatorFn | ValidatorFn;
  error: string;
}

export class DtFilterFieldControl extends FormControl {
  constructor(private _validators: DtFilterFieldValidator[] = []) {
    super(
      '',
      _validators.map((validator) => validator.validatorFn),
      null,
    );
  }

  /**
   * @internal
   * Validates the control with the provided validators and returns an array of error messages
   */
  _validate(): string[] {
    this.updateValueAndValidity();

    return this._validators
      .map((validator) =>
        validator.validatorFn(this) ? validator.error : null,
      )
      .filter(Boolean) as string[];
  }
}
