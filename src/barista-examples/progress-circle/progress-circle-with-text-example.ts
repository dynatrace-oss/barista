import { Component } from '@angular/core';

@Component({
  selector: 'barista-demo',
  template: `
  <dt-progress-circle [value]="value" [max]="max">
  {{value}}/{{max}}
  </dt-progress-circle>`,
})
export class ProgressCircleWithTextExample {
  value = 300;
  max = 1500;
}
