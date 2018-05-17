import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <button dt-icon-button><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button variant="secondary"><dt-icon name="agent"></dt-icon></button>
  `,
})
export class IconOnlyButtonExampleComponent { }
