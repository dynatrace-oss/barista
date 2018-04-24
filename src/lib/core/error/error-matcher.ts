import {Provider} from '@angular/core';
import {FormGroupDirective, NgForm, FormControl} from '@angular/forms';

export abstract class ErrorStateMatcher {
  abstract isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean;
}

/** Error state matcher that matches when a control is invalid and dirty. */
export class DefaultErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
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

export const DEFAULT_ERROR_STATE_MATCHER_PROVIDER: Provider = {
  provide: ErrorStateMatcher,
  useClass: DefaultErrorStateMatcher,
};
