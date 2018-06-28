import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<dt-show-more [showLess]="showLess" (changed)="showLess=!showLess">
  Show more
  <dt-show-less-label>Show less</dt-show-less-label>
</dt-show-more>`,
})
@OriginalClassName('DefaultShowMoreExampleComponent')
export class DefaultShowMoreExampleComponent {
  showLess = false;
}
