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
import { Validators } from '@angular/forms';

export const FILTER_FIELD_TEST_DATA_VALIDATORS = {
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
    {
      name: 'Autocomplete with free text options',
      autocomplete: [
        { name: 'Autocomplete option 1' },
        { name: 'Autocomplete option 2' },
        { name: 'Autocomplete option 3' },
        {
          name: 'Autocomplete free text',
          suggestions: ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'],
          validators: [],
        },
      ],
    },
  ],
};
