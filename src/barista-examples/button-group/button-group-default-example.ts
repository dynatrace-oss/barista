import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-button-group>
      <dt-button-group-item>CPU</dt-button-group-item>
      <dt-button-group-item>Connectivity</dt-button-group-item>
    </dt-button-group>
  `,
})
export class ButtonGroupDefaultExample {}
