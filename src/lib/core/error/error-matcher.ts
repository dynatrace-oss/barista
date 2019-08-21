import { Injectable } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

/** Error state matcher that matches when a control is invalid and dirty. */
export class DefaultErrorStateMatcher {
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
  abstract isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean;
}
