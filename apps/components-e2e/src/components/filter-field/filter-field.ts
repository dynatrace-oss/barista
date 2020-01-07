/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers deprecation
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component } from '@angular/core';
import { Validators } from '@angular/forms';

import { DtFilterFieldDefaultDataSource } from '@dynatrace/barista-components/filter-field';

const TEST_DATA = {
  autocomplete: [
    {
      name: 'custom normal',
      suggestions: [],
    },
    {
      name: 'custom required',
      suggestions: [],
      validators: [
        { validatorFn: Validators.required, error: 'field is required' },
      ],
    },
    {
      name: 'custom with multiple',
      suggestions: [],
      validators: [
        { validatorFn: Validators.required, error: 'field is required' },
        { validatorFn: Validators.minLength(3), error: 'min 3 characters' },
      ],
    },
    {
      name: 'outer-option',
      autocomplete: [
        {
          name: 'inner-option',
        },
      ],
    },
  ],
};

@Component({
  selector: 'dt-e2e-filter-field',
  templateUrl: './filter-field.html',
})
export class DtE2EFilterField {
  _dataSource = new DtFilterFieldDefaultDataSource<any>(TEST_DATA);
}
