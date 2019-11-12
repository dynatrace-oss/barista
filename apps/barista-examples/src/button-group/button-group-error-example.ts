import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-button-group value="cpu">
      <dt-button-group-item value="cpu">CPU</dt-button-group-item>
      <dt-button-group-item value="conn">Connectivity</dt-button-group-item>
      <dt-button-group-item color="error" value="error">
        Failure rate
      </dt-button-group-item>
    </dt-button-group>
  `,
})
export class ButtonGroupErrorExample {}
