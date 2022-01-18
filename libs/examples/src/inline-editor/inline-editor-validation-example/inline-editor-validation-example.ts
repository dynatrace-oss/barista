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

import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';

@Component({
  selector: 'dt-example-inline-editor-validation',
  templateUrl: 'inline-editor-validation-example.html',
})
export class DtExampleInlineEditorValidation {
  queryTitleControl = new FormControl('', [
    // eslint-disable-next-line @typescript-eslint/unbound-method
    Validators.minLength(4),
    this.baristaValidator(),
  ]);
  queryTitleForm = new FormGroup({
    queryTitleControl: this.queryTitleControl,
  });
  value = '123';

  get hasCustomError(): boolean {
    return this.queryTitleControl.hasError('barista');
  }

  /**
   * Note that this validator function does not have to be part of the class
   * exporting/importing this function is preferred since it increases reusability
   */
  baristaValidator(): ValidatorFn {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (control: AbstractControl): { [key: string]: any } | null => {
      const required = !control.value.includes('barista');
      return required ? { barista: { value: control.value } } : null;
    };
  }
}
