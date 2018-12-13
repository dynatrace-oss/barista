import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <button dt-button (click)="counter = counter + 1 ">Increase Counter</button>
    <p>Counter: {{counter}}</p>
  `,
})
export class InteractionButtonExampleComponent {
  counter = 0;
}
