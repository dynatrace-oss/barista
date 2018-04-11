import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<dt-button-toggle>
  <dt-button-toggle-item>CPU</dt-button-toggle-item>
  <dt-button-toggle-item>Connectivity</dt-button-toggle-item>
  <dt-button-toggle-item color="error">Failure rate</dt-button-toggle-item>
</dt-button-toggle>`,
})
export class ButtonToggleErrorExampleComponent { }
