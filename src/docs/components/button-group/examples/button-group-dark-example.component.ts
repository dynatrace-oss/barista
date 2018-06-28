import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<section class="dark" dtTheme=":dark">
    <dt-button-group>
    <dt-button-group-item>CPU</dt-button-group-item>
    <dt-button-group-item>Connectivity</dt-button-group-item>
    <dt-button-group-item>Performance</dt-button-group-item>
    <dt-button-group-item color="error" value="error">Failure rate</dt-button-group-item>
      <dt-button-group-item disabled>Disabled state</dt-button-group-item>
  </dt-button-group>
</section>`,
})
@OriginalClassName('ButtonGroupDarkExampleComponent')
export class ButtonGroupDarkExampleComponent { }
