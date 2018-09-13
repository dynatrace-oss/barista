import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <dt-form-field>
      <input type="text" dtInput placeholder="Please insert amout"/>
      <dt-icon dtPrefix name="filter">$</dt-icon>
      <dt-loading-spinner dtPrefix></dt-loading-spinner>
      <button dt-icon-button dtSuffix variant="nested">
        <dt-icon name="checkmark"></dt-icon>
      </button>
    </dt-form-field>
  `,
})
@OriginalClassName('PrefixSuffixFormFieldExample')
export class PrefixSuffixFormFieldExample { }
