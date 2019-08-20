import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <form [formGroup]="passwordForm">
      <dt-form-field>
        <input
          type="password"
          dtInput
          placeholder="Please insert super secure password"
          aria-label="Please insert super secure password"
          required
          formControlName="password"
        />
        <dt-error *ngIf="passwordHasMinLengthError"
          >Password needs to be at least 4 characters long
        </dt-error>
        <dt-error *ngIf="passwordHasCustomError">
          Password must include the string 'barista'
        </dt-error>
      </dt-form-field>
    </form>
  `,
})
export class FormFieldErrorCustomValidatorExample {
  passwordFormControl = new FormControl('', [
    // tslint:disable-next-line: no-unbound-method
    Validators.required,
    Validators.minLength(4),
    this.baristaValidator(),
  ]);

  passwordForm = new FormGroup({
    password: this.passwordFormControl,
  });

  get passwordHasMinLengthError(): boolean {
    return this.passwordFormControl.hasError('minlength');
  }

  get passwordHasCustomError(): boolean {
    return this.passwordFormControl.hasError('barista');
  }

  /**
   * Note that this validator function does not have to be part of the class
   * exporting/importing this function is preferred since it increases reusability
   */
  baristaValidator(): ValidatorFn {
    // tslint:disable-next-line: no-any
    return (control: AbstractControl): { [key: string]: any } | null => {
      const required = !control.value.includes('barista');
      return required ? { barista: { value: control.value } } : null;
    };
  }
}
