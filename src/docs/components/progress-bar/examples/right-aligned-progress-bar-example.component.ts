import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<dt-progress-bar [value]="30" rightAligned></dt-progress-bar>`,
})
@OriginalClassName('RightAlignedProgressBarExampleComponent')
export class RightAlignedProgressBarExampleComponent { }
