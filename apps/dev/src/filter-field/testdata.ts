/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector
import { Validators } from '@angular/forms';

export const TEST_DATA = {
  autocomplete: [
    {
      name: 'DE',
      defaultSearch: true,
      autocomplete: [
        { name: 'Berlin', options: [{ name: 'test1', disabled: true }] },
        { name: 'Bremen' },
        { name: 'Munich' },
      ],
      unique: true,
      validators: [
        {
          validatorFn: Validators.minLength(2),
        },
      ],
    },
    {
      name: 'AUT',
      distinct: true,
      autocomplete: [
        { name: 'Vienna' },
        { name: 'Linz', disabled: true },
        {
          name: 'custom',
          suggestions: [],
        },
      ],
    },
    {
      name: 'US',
      autocomplete: [
        { name: 'Miami' },
        { name: 'Los Angeles' },
        {
          name: 'custom',
          suggestions: [],
        },
      ],
    },
    {
      name: 'DE (async)',
      async: true,
      distinct: false,
      autocomplete: [{ name: 'Berlin' }],
    },
    {
      name: 'DE (async, distinct)',
      async: true,
      distinct: true,
      autocomplete: [],
    },
    {
      name: 'DE (async, freeText)',
      async: true,
      unique: true,
      suggestions: [],
    },
    {
      name: 'CH (async, partial)',
      async: true,
      autocomplete: [],
    },
    {
      name: 'Different Country',
      suggestions: [{ name: 'IT' }, { name: 'ES' }, { name: 'UK' }],
      validators: [
        { validatorFn: Validators.required, error: 'is required' },
        {
          validatorFn: Validators.minLength(2),
          error: 'Country code needs at least 2 characters',
        },
      ],
    },
    {
      name: 'Requests per minute',
      range: {
        operators: {
          range: true,
          equal: true,
          greaterThanEqual: true,
          lessThanEqual: true,
        },
        unit: 's',
      },
    },
  ],
};

export const TEST_DATA_ASYNC = {
  name: 'DE (async)',
  autocomplete: [
    { name: 'Berlin' },
    {
      name: 'München',
      suggestions: [],
      validators: [{ validatorFn: Validators.required, error: 'is required' }],
    },
  ],
};

export const TEST_DATA_ASYNC_2 = {
  name: 'DE (async, distinct)',
  distinct: true,
  autocomplete: [
    { name: 'Berlin' },
    {
      name: 'München',
      suggestions: [],
      validators: [{ validatorFn: Validators.required, error: 'is required' }],
    },
  ],
};

export const TEST_DATA_ASYNC_FREETEXT = {
  name: 'DE (async, freeText)',
  unique: true,
  suggestions: [{ name: 'Berlin' }, { name: 'München' }],
};

export const MULTI_SELECT_DATA_ASYNC = {
  name: 'Years (async)',
  multiOptions: [
    { name: '1999 (disabled)', disabled: true },
    { name: '2018' },
    { name: '2019' },
    { name: '2020' },
    { name: '2021' },
    { name: '2022' },
    { name: '2023' },
  ],
};

export const MULTI_SELECT_DATA_ASYNC_PARTIAL = {
  name: 'CH (async, partial)',
  multiOptions: [
    { name: 'Zürich (disabled)', disabled: true },
    { name: 'Genf' },
    { name: 'Basel' },
    { name: 'Bern' },
  ],
  partial: true,
};

export const TEST_DATA_PARTIAL = {
  name: 'CH (async, partial)',
  multiOptions: [
    { name: 'Zürich (disabled)', disabled: true },
    { name: 'Genf' },
    { name: 'Basel' },
    { name: 'Bern' },
  ],
  partial: true,
};

export const TEST_DATA_PARTIAL_2 = {
  name: 'CH (async, partial)',
  autocomplete: [
    { name: 'Zug' },
    { name: 'Schaffhausen' },
    { name: 'Luzern' },
    { name: 'St. Gallen (disabled)', disabled: true },
  ],
  partial: true,
};
