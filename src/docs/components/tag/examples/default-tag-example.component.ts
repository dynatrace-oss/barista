import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: '<dt-tag>Hello tag</dt-tag>',
})
@OriginalClassName('DefaultTagExampleComponent')
export class DefaultTagExampleComponent { }
