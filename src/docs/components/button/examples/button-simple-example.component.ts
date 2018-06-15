import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <button dt-button>Simple button</button>
    <a href="#" dt-button>Simple anchor button</a>
    <button dt-button disabled>Disabled button</button>
    <a href="#" dt-button disabled>Disabled anchor button</a>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 12px; }'],
})
export class SimpleButtonExampleComponent { }
