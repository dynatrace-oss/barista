import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <button dt-button>Button in main color</button>
    <button dt-button color="warning">Button in warning color</button>
    <button dt-button color="cta">Button in cta color</button>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
export class ButtonColorExample {}
