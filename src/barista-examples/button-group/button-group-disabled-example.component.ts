import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<dt-button-group disabled>
  <dt-button-group-item>CPU</dt-button-group-item>
  <dt-button-group-item>Connectivity</dt-button-group-item>
  <dt-button-group-item>Failure rate</dt-button-group-item>
</dt-button-group>`,
})
@OriginalClassName('ButtonGroupDisabledExampleComponent')
export class ButtonGroupDisabledExampleComponent { }
