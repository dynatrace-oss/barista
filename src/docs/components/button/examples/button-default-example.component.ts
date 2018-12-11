import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <button dt-button>Simple button</button>
    <a href="#" dt-button>Simple anchor button</a>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
@OriginalClassName('DefaultButtonExampleComponent')
export class DefaultButtonExampleComponent { }
