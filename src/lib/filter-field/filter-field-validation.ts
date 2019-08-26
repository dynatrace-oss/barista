import { FormControl, ValidationErrors } from '@angular/forms';

export type DtFilterFieldValidatorFn = (
  control: DtFilterFieldControl,
) => ValidationErrors | null;

export interface DtFilterFieldValidator {
  validatorFn: DtFilterFieldValidatorFn;
  error: string;
}

export class DtFilterFieldControl extends FormControl {
  constructor(private _validators: DtFilterFieldValidator[] = []) {
    super(null, _validators.map(validator => validator.validatorFn), null);
  }

  /**
   * @internal
   * Validates the control with the provided validators and returns an array of error messages
   */
  _validate(): string[] {
    this.updateValueAndValidity();

    return this._validators
      .map(validator => (validator.validatorFn(this) ? validator.error : null))
      .filter(Boolean) as string[];
  }
}
