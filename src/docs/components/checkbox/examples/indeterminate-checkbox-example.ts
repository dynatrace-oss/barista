import { Component } from '@angular/core';
import { DtCheckboxChange } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  template: `
    <p>indeterminate: {{_isIndeterminate()}} | checked: {{_isChecked()}}</p>
    <div>
      <dt-checkbox
        [checked]="_isChecked()"
        [indeterminate]="_isIndeterminate()"
        (change)="changeAll($event)"
      >All</dt-checkbox></div>
    <div><dt-checkbox (change)="_checkbox1 = $event.checked" [checked]="_checkbox1">Checkbox 1</dt-checkbox></div>
    <div><dt-checkbox (change)="_checkbox2 = $event.checked" [checked]="_checkbox2">Checkbox 2</dt-checkbox></div>
  `,
})
export class IndeterminateCheckboxExampleComponent {

  _checkbox1 = false;
  _checkbox2 = false;

  _isIndeterminate(): boolean {
    return this._checkbox1 !== this._checkbox2;
  }

  _isChecked(): boolean {
    return this._checkbox1 || this._checkbox2;
  }

  changeAll(event: DtCheckboxChange): void {
    this._checkbox1 = event.checked;
    this._checkbox2 = event.checked;
  }
}
