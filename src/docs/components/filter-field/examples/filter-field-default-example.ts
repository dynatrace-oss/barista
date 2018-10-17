import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <dt-filter-field></dt-filter-field>
  `,
})
@OriginalClassName('DefaultFilterFieldExample')
export class DefaultFilterFieldExample { }
