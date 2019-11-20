/**
 * @license
 * Copyright 2019 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';

import { DtCheckboxChange } from '@dynatrace/barista-components/checkbox';

@Component({
  selector: 'component-barista-example',
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
