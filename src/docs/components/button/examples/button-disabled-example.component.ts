import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <button dt-button disabled>Disabled Button</button>
    <button dt-button disabled variant="secondary">Disabled Secondary Button</button>
    <button dt-button disabled><dt-icon name="agent"></dt-icon>Default with icon</button>
    <button dt-button disabled variant="secondary"><dt-icon name="agent"></dt-icon>Warning with icon</button>
    <button dt-icon-button disabled><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button disabled variant="secondary"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button disabled variant="nested"><dt-icon name="agent"></dt-icon></button>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
@OriginalClassName('DisabledButtonExampleComponent')
export class DisabledButtonExampleComponent {
}
