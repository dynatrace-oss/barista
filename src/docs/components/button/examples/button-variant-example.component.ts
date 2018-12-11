import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <button dt-button>Primary button</button>
    <button dt-button variant="secondary">Secondary button</button>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
@OriginalClassName('VariantButtonExampleComponent')
export class VariantButtonExampleComponent {}
