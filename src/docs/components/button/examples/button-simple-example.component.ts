import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <button dt-button>Simple button</button>
    <a href="#" dt-button>Simple anchor button</a>
    <button dt-button disabled>Disabled button</button>
    <a href="#" dt-button disabled>Disabled anchor button</a>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
@OriginalClassName('SimpleButtonExampleComponent')
export class SimpleButtonExampleComponent {
}
