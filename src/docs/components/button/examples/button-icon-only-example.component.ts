import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <button dt-icon-button><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button variant="secondary"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button variant="nested"><dt-icon name="agent"></dt-icon></button>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
@OriginalClassName('IconOnlyButtonExampleComponent')
export class IconOnlyButtonExampleComponent {}
