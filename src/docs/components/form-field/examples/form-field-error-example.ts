import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <dt-form-field>
      <input type="text" required dtInput placeholder="Please insert text" [(ngModel)]="textValue"/>
      <dt-error>A wild error appears</dt-error>
    </dt-form-field>
  `,
})
@OriginalClassName('ErrorFormFieldExample')
export class ErrorFormFieldExample {
  textValue: string;
}
