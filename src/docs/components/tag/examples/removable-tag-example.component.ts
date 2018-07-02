import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: '<dt-tag removable>This can be removed</dt-tag>',
})
@OriginalClassName('RemovableTagExampleComponent')
export class RemovableTagExampleComponent { }
