import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<dt-button-group>
  <dt-button-group-item>CPU</dt-button-group-item>
  <dt-button-group-item disabled>Connectivity</dt-button-group-item>
  <dt-button-group-item selected>Failure rate</dt-button-group-item>
</dt-button-group>`,
})
export class ButtonGroupItemDisabledExampleComponent { }
