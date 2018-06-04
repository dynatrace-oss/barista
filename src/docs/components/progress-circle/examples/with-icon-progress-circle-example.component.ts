import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <dt-progress-circle [value]="310" [max]="500">
  <dt-icon name="agent"></dt-icon>
  </dt-progress-circle>`,
})
export class WithIconProgressCircleExampleComponent { }
