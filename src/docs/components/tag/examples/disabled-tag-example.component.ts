import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: '<dt-tag disabled>Disabled tag</dt-tag>',
})
@OriginalClassName('DisabledTagExampleComponent')
export class DisabledTagExampleComponent { }
