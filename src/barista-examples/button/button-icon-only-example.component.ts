import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <button dt-icon-button><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button variant="secondary"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button variant="nested"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button color="warning"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button color="warning" variant="secondary"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button color="warning" variant="nested"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button color="cta"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button color="cta" variant="secondary"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button color="cta" variant="nested"><dt-icon name="agent"></dt-icon></button>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
export class IconOnlyButtonExampleComponent {}
