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

import { ErrorStateMatcher } from '@dynatrace/angular-components/core';

import { DtStepLabel } from './step-label';
import { DtStepper } from './stepper';

/**
 * TODO ChMa: write linting rule for aria-label
 */
@Component({
  moduleId: module.id,
  selector: 'dt-step',
  template: '<ng-template><ng-content></ng-content></ng-template>',
  providers: [{ provide: ErrorStateMatcher, useExisting: DtStep }],
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtStep',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtStep extends CdkStep implements ErrorStateMatcher {
  /** Content for step label given by `<ng-template dtStepLabel>`. */
  @ContentChild(DtStepLabel, { static: false }) stepLabel: DtStepLabel;

  /** @deprecated Not supported yet */
  errorMessage: string;

  constructor(
    // tslint:disable-next-line: no-forward-ref
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
