import { Component } from '@angular/core';
import { DtCheckboxChange } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <p>indeterminate: {{ _isIndeterminate() }} | checked: {{ _isChecked() }}</p>
    <dt-checkbox
      [checked]="_isChecked()"
      [indeterminate]="_isIndeterminate()"
      (change)="changeAll($event)"
    >
      All
    </dt-checkbox>
    <dt-checkbox (change)="_checkbox1 = $event.checked" [checked]="_checkbox1">
      Checkbox 1
    </dt-checkbox>
    <dt-checkbox (change)="_checkbox2 = $event.checked" [checked]="_checkbox2">
      Checkbox 2
    </dt-checkbox>
  `,
  styles: [
    `
      dt-checkbox {
        display: block;
      }
      dt-checkbox + dt-checkbox {
        margin-top: 20px;
      }
    `,
  ],
})
export class CheckboxIndeterminateExample {
  _checkbox1 = true;
  _checkbox2 = false;

  _isIndeterminate(): boolean {
    return this._checkbox1 !== this._checkbox2;
  }

  _isChecked(): boolean {
    return this._checkbox1 && this._checkbox2;
  }

  changeAll(event: DtCheckboxChange<string>): void {
    this._checkbox1 = event.checked;
    this._checkbox2 = event.checked;
  }
}
