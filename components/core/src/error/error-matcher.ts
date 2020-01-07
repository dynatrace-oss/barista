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

import { Injectable } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

/** Error state matcher that matches when a control is invalid and dirty. */
export class DefaultErrorStateMatcher {
  /** Whether the control is in an error state an errors should be displayed. */
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const isFormSubmitted = !!form && form.submitted;
    const isControlInvalid = !!control && control.invalid;

    // Disabling no-unnecessary-type-assertion because of a conflict between typescript and tslint.
    //
    // `return isControlInvalid && (control!.dirty || isFormSubmitted);`
    // will pass typescript but throw on the tslint part
    //
    // `return isControlInvalid && (control.dirty || isFormSubmitted);`
    // will fail typescript but pass tslint
    //
    // tslint:disable-next-line:no-unnecessary-type-assertion
    return isControlInvalid && (control!.dirty || isFormSubmitted);
  }
}

@Injectable({ providedIn: 'root', useClass: DefaultErrorStateMatcher })
export abstract class ErrorStateMatcher {
  /** Whether the control is in an error state and errors should be displayed. */
  abstract isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean;
}
