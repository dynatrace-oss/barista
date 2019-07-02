import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `<dt-button-group value="cpu">
  <dt-button-group-item value="cpu">CPU</dt-button-group-item>
  <dt-button-group-item value="conn">Connectivity</dt-button-group-item>
  <dt-button-group-item color="error" value="error">Failure rate</dt-button-group-item>
</dt-button-group>`,
})
export class ButtonGroupErrorExample { }
