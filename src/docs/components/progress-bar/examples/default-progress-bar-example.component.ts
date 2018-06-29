import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: '<dt-progress-bar [value]="75"></dt-progress-bar>',
})
@OriginalClassName('DefaultProgressBarExampleComponent')
export class DefaultProgressBarExampleComponent { }
