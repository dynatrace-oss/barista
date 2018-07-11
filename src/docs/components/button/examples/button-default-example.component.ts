import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <button dt-button>Simple button</button>
    <a href="#" dt-button>Simple anchor button</a>
  `,
})
@OriginalClassName('DefaultButtonExampleComponent')
export class DefaultButtonExampleComponent { }
