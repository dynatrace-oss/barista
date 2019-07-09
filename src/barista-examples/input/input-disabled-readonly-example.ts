import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <input
      dtInput
      placeholder="Please insert text"
      [disabled]="isDisabled"
      aria-label="Please insert text"
    />
    <p
      ><button dt-button (click)="isDisabled = !isDisabled"
        >Toggle disabled</button
      ></p
    >

    <input
      dtInput
      placeholder="Please insert text"
      [readonly]="isReadonly"
      aria-label="Please insert text"
    />
    <p
      ><button dt-button (click)="isReadonly = !isReadonly"
        >Toggle readonly</button
      ></p
    >
  `,
})
export class InputDisabledReadonlyExample {
  isDisabled = false;
  isReadonly = false;
}
