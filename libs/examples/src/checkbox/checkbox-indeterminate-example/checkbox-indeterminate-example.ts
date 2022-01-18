/**
 * @license
 * Copyright 2022 Dynatrace LLC
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
  selector: 'dt-example-checkbox-indeterminate',
  templateUrl: 'checkbox-indeterminate-example.html',
  styleUrls: ['checkbox-indeterminate-example.scss'],
})
export class DtExampleCheckboxIndeterminate {
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
