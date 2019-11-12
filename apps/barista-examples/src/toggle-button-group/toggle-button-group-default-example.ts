import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-toggle-button-group>
      <button dt-toggle-button-item value="1">
        <dt-toggle-button-item-icon>
          <dt-icon name="agent"></dt-icon>
        </dt-toggle-button-item-icon>
        One
      </button>
      <button dt-toggle-button-item value="2">
        <dt-toggle-button-item-icon>
          <dt-icon name="agent"></dt-icon>
        </dt-toggle-button-item-icon>
        Two
      </button>
      <button dt-toggle-button-item value="3">
        <dt-toggle-button-item-icon>
          <dt-icon name="agent"></dt-icon>
        </dt-toggle-button-item-icon>
        Three
      </button>
    </dt-toggle-button-group>
  `,
  styles: [
    '.dt-toggle-button-item { margin-right: 16px; }',
    '.dt-toggle-button-item:last-of-type { margin-right: 0; }',
  ],
  preserveWhitespaces: false,
})
export class ToggleButtonGroupDefaultExample {}
