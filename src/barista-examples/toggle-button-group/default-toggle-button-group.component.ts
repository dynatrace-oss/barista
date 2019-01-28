import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
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
  </dt-toggle-button-group>`,
})
export class DefaultToggleButtonExampleComponent { }
