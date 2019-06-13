import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-form-field>
      <input type="text" dtInput placeholder="Please insert amount" aria-label="Please insert amount"/>
      <dt-icon dtPrefix name="filter">$</dt-icon>
      <dt-loading-spinner dtPrefix></dt-loading-spinner>
      <button dt-icon-button dtSuffix variant="nested" aria-label="Submit changes">
        <dt-icon name="checkmark"></dt-icon>
      </button>
    </dt-form-field>
  `,
})
export class PrefixSuffixFormFieldExample { }
