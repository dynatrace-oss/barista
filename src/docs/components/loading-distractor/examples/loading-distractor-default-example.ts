import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<dt-loading-distractor>Loading …</dt-loading-distractor>`,
})
@OriginalClassName('DefaultLoadingDistractorExampleComponent')
export class DefaultLoadingDistractorExampleComponent { }
