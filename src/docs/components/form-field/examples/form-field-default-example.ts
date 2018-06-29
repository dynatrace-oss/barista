import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <dt-form-field>
      <dt-label>Some text</dt-label>
      <input type="text" dtInput placeholder="Please insert text"/>
    </dt-form-field>
  `,
})
@OriginalClassName('DefaultFormFieldExample')
export class DefaultFormFieldExample { }
