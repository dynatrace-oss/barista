import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<dt-button-group>
  <dt-button-group-item>CPU</dt-button-group-item>
  <dt-button-group-item>Connectivity</dt-button-group-item>
</dt-button-group>`,
})
@OriginalClassName('ButtonGroupDefaultExampleComponent')
export class ButtonGroupDefaultExampleComponent { }
