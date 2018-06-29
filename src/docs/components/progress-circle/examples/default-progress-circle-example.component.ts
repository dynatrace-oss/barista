import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: '<dt-progress-circle [value]="75"></dt-progress-circle>',
})
@OriginalClassName('DefaultProgressCircleExampleComponent')
export class DefaultProgressCircleExampleComponent { }
