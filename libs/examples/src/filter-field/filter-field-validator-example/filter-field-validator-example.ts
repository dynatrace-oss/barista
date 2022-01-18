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
import { DtFilterFieldDefaultDataSource } from '@dynatrace/barista-components/filter-field';
import { Validators } from '@angular/forms';

@Component({
  selector: 'dt-example-filter-field-validator',
  templateUrl: 'filter-field-validator-example.html',
})
export class DtExampleFilterFieldValidator {
  private DATA = {
    autocomplete: [
      {
        name: 'AUS',
        autocomplete: [
          {
            name: 'Custom',
            suggestions: [
              { name: 'Linz' },
              { name: 'Vienna' },
              { name: 'Graz' },
            ],
            validators: [
              { validatorFn: Validators.required, error: 'is required' },
            ],
          },
        ],
      },
    ],
  };
  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);
}
