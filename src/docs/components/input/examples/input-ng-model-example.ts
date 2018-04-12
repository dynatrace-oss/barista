import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <input dtInput
      type="email"
      placeholder="Enter Text"
      [(ngModel)]="emailValue"/>
    <p>Output: <em>{{emailValue || 'none'}}</em></p>
  `,
})
export class NgModelInputExample {
  emailValue = '';
}
