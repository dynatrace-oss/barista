import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <button dt-button (click)="counter = counter + 1">Increase Counter</button>
    <p>Counter: {{ counter }}</p>
  `,
})
export class ButtonInteractionExample {
  counter = 0;
}
