import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <dt-form-field>
      <input type="text" dtInput placeholder="Please insert text"/>
      <dt-hint>Left hint</dt-hint>
      <dt-hint align="end">Right hint</dt-hint>
    </dt-form-field>
  `,
})
@OriginalClassName('HintFormFieldExample')
export class HintFormFieldExample { }
