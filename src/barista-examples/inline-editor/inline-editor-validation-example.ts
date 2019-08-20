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
    <form [formGroup]="queryTitleForm">
      <em
        dt-inline-editor
        [(ngModel)]="value"
        formControlName="queryTitleControl"
        aria-label-save="Save text"
        aria-label-cancel="Cancel and discard changes"
        required
      >
        <dt-error *ngIf="queryTitleControl.hasError('required')">
          The query title must not be empty.
        </dt-error>
        <dt-error *ngIf="queryTitleControl.hasError('minlength')">
          The query title must be at least 4 characters long
        </dt-error>
        <dt-error *ngIf="hasCustomError">
          Password must include the string 'barista'
        </dt-error>
      </em>
    </form>
  `,
})
export class InlineEditorValidationExample {
  queryTitleControl = new FormControl('', [
    // tslint:disable-next-line: no-unbound-method
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
    // tslint:disable-next-line: no-any
    return (control: AbstractControl): { [key: string]: any } | null => {
      const required = !control.value.includes('barista');
      return required ? { barista: { value: control.value } } : null;
    };
  }
}
