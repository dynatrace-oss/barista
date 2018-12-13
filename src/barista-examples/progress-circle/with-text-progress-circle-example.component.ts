import { Component } from '@angular/core';

@Component({
  template: `
  <dt-progress-circle [value]="value" [max]="max">
  {{value}}/{{max}}
  </dt-progress-circle>`,
})
export class WithTextProgressCircleExampleComponent {
  value = 300;
  max = 1500;
}
