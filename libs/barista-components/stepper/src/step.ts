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

import {
  CdkStep,
  STEPPER_GLOBAL_OPTIONS,
  StepperOptions,
} from '@angular/cdk/stepper';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Inject,
  Optional,
  SkipSelf,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { ErrorStateMatcher } from '@dynatrace/barista-components/core';

import { DtStepLabel } from './step-label';
import { DtStepper } from './stepper';

@Component({
  selector: 'dt-step',
  template: '<ng-template><ng-content></ng-content></ng-template>',
  providers: [{ provide: ErrorStateMatcher, useExisting: DtStep }],
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtStep',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtStep extends CdkStep implements ErrorStateMatcher {
  /** Content for step label given by `<ng-template dtStepLabel>`. */
  @ContentChild(DtStepLabel) stepLabel: DtStepLabel;

  /** @deprecated Not supported yet */
  errorMessage: string;

  constructor(
    // eslint-disable-next-line @angular-eslint/no-forward-ref
    stepper: DtStepper,
    @SkipSelf() private _errorStateMatcher: ErrorStateMatcher,
    @Optional() @Inject(STEPPER_GLOBAL_OPTIONS) stepperOptions: StepperOptions,
  ) {
    super(stepper, stepperOptions);
  }

  /** Custom error state matcher that additionally checks for validity of interacted form. */
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const originalErrorState = this._errorStateMatcher.isErrorState(
      control,
      form,
    );

    // Custom error state checks for the validity of form that is not submitted or touched
    // since user can trigger a form change by calling for another step without directly
    // interacting with the current form.
    const customErrorState = !!(control && control.invalid && this.interacted);

    return originalErrorState || customErrorState;
  }
}
