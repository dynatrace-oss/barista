import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <p>
      <button dt-button disabled>Disabled Button</button>
      <button dt-button disabled variant="secondary">Disabled Secondary Button</button>
    </p><p>
      <button dt-button disabled><dt-icon name="agent"></dt-icon>Default with icon</button>
      <button dt-button disabled variant="secondary"><dt-icon name="agent"></dt-icon>Warning with icon</button>
    </p><p>
      <button dt-icon-button disabled><dt-icon name="agent"></dt-icon></button>
      <button dt-icon-button disabled variant="secondary"><dt-icon name="agent"></dt-icon></button>
      <button dt-icon-button disabled variant="nested"><dt-icon name="agent"></dt-icon></button>
    </p>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
@OriginalClassName('DisabledButtonExampleComponent')
export class DisabledButtonExampleComponent {
}
