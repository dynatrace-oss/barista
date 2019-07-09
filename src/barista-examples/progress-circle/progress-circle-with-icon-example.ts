import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-progress-circle [value]="30">
      <dt-icon name="agent"></dt-icon>
    </dt-progress-circle>
  `,
})
export class ProgressCircleWithIconExample {}
