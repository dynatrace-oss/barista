import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<button dt-button>Simple button</button>`,
})
@OriginalClassName('DefaultButtonExampleComponent')
export class DefaultButtonExampleComponent { }
