import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <p>
      <button dt-button><dt-icon name="agent"></dt-icon>Primary with icon</button>
      <button dt-button variant="secondary"><dt-icon name="agent"></dt-icon>Secondary with icon</button>
    </p><p>
      <button dt-button color="warning"><dt-icon name="agent"></dt-icon>Primary with icon</button>
      <button dt-button color="warning" variant="secondary"><dt-icon name="agent"></dt-icon>Secondary with icon</button>
    </p><p>
      <button dt-button color="cta"><dt-icon name="agent"></dt-icon>Primary with icon</button>
      <button dt-button color="cta" variant="secondary"><dt-icon name="agent"></dt-icon>Secondary with icon</button>
    </p>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
export class IconsButtonExampleComponent {}
