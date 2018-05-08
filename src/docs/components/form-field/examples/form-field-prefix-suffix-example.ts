import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <dt-form-field>
      <input type="text" dtInput placeholder="Please insert amout"/>
      <span dtPrefix>$</span>
      <button dtSuffix dt-button>Submit</button>
    </dt-form-field>
  `,
})
export class PrefixSuffixFormFieldExample { }
