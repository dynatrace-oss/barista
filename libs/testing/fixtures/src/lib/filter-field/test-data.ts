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

export const FILTER_FIELD_TEST_DATA = {
  autocomplete: [
    {
      name: 'AUT',
      distinct: true,
      autocomplete: [{ name: 'Linz' }, { name: 'Vienna' }, { name: 'Graz' }],
    },
    {
      name: 'USA',
      autocomplete: [
        { name: 'San Francisco' },
        { name: 'Los Angeles' },
        { name: 'New York' },
        { name: 'Custom', suggestions: [] },
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
    {
      name: 'Seasoning',
      multiOptions: [
        { name: 'None' },
        {
          name: 'Homemade',
          options: [{ name: 'Ketchup' }, { name: 'Mustard' }, { name: 'Mayo' }],
        },
        { name: 'Imported', disabled: true },
      ],
    },
    {
      name: 'Not in Quickfilter',
      autocomplete: [
        { name: 'Option1' },
        { name: 'Option2' },
        { name: 'Option3' },
      ],
    },
  ],
};

export const FILTER_FIELD_TEST_DATA_SINGLE_DISTINCT = {
  autocomplete: [
    {
      name: 'AUT',
      distinct: true,
      autocomplete: [
        {
          name: 'Vienna',
        },
        {
          name: 'Linz',
        },
      ],
    },
  ],
};

export const FILTER_FIELD_TEST_DATA_SINGLE_OPTION = {
  autocomplete: [{ name: 'option' }],
};

export const FILTER_FIELD_TEST_DATA_ASYNC = {
  autocomplete: [
    {
      name: 'AUT',
      autocomplete: [
        {
          name: 'Upper Austria',
          distinct: true,
          autocomplete: [
            {
              name: 'Cities',
              options: [{ name: 'Linz' }, { name: 'Wels' }, { name: 'Steyr' }],
            },
          ],
        },
        {
          name: 'Vienna',
        },
      ],
    },
    {
      name: 'USA',
      autocomplete: [{ name: 'Los Angeles' }, { name: 'San Fran' }],
    },
    {
      name: 'Free',
      suggestions: [],
      validators: [],
    },
    {
      name: 'DE (async)',
      async: true,
      autocomplete: [{ name: 'Berlin' }],
    },
  ],
};

export const FILTER_FIELD_TEST_DATA_FOR_TRUNCATION = {
  autocomplete: [
    {
      name: 'Country',
      distinct: false,
      autocomplete: Array.from(new Array(6), (_, i) => ({
        name: `State ${i + 1}`,
      })),
    },
  ],
};
