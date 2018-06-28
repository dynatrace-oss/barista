import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <dt-progress-circle [value]="30">
  <dt-icon name="agent"></dt-icon>
  </dt-progress-circle>`,
})
@OriginalClassName('WithIconProgressCircleExampleComponent')
export class WithIconProgressCircleExampleComponent { }
