import {Provider} from '@angular/core';
import {FormGroupDirective, NgForm, FormControl} from '@angular/forms';

export abstract class ErrorStateMatcher {
  abstract isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean;
}

/** Error state matcher that matches when a control is invalid and dirty. */
export class DefaultErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || (form && form.submitted)));
  }
}

export const DEFAULT_ERROR_STATE_MATCHER_PROVIDER: Provider = {
  provide: ErrorStateMatcher,
  useClass: DefaultErrorStateMatcher,
};
