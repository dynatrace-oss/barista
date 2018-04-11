import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<dt-button-toggle>
  <dt-button-toggle-item>CPU</dt-button-toggle-item>
  <dt-button-toggle-item disabled>Connectivity</dt-button-toggle-item>
  <dt-button-toggle-item>Failure rate</dt-button-toggle-item>
</dt-button-toggle>`,
})
export class ButtonToggleItemDisabledExampleComponent { }
