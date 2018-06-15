import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <button dt-icon-button><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button variant="secondary"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button variant="nested"><dt-icon name="agent"></dt-icon></button>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 12px; }'],
})
export class IconOnlyButtonExampleComponent { }
