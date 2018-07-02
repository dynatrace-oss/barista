import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: '<dt-show-more [showLess]="showLess" (changed)="showLess=!showLess"></dt-show-more>',
})
@OriginalClassName('NoTextShowMoreExampleComponent')
export class NoTextShowMoreExampleComponent {
  showLess = false;
}
