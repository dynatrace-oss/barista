import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <dt-progress-bar [value]="75">
  <dt-progress-bar-description>
    We found more than 100 results. This may take a while, consider narrowing your search.
  </dt-progress-bar-description>
  </dt-progress-bar>`,
})
@OriginalClassName('WithDescriptionProgressBarExampleComponent')
export class WithDescriptionProgressBarExampleComponent { }
