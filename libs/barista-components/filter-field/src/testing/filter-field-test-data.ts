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

export const TEST_DATA_SUGGESTIONS = {
  autocomplete: [
    {
      name: 'Node',
      options: [
        {
          name: 'Custom Simple Option',
        },
        {
          name: 'Node Label',
          key: 'MyKey',
          suggestions: [{ name: 'some cool' }, { name: 'very weird' }],
          validators: [],
        },
      ],
    },
  ],
};

export const TEST_DATA_RANGE = {
  autocomplete: [
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

export const TEST_DATA_MULTI_SELECT = {
  autocomplete: [
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
  ],
};

export const TEST_DATA_MULTI_SELECT_EDIT_MODE = {
  autocomplete: [
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
  ],
};

export const TEST_DATA_EDITMODE = {
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
      autocomplete: [
        { name: 'Los Angeles', suggestions: [] },
        { name: 'San Fran' },
      ],
    },
    {
      name: 'Free',
      suggestions: [],
      validators: [],
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
      name: 'DE (async)',
      async: true,
      autocomplete: [],
    },
  ],
};

export const TEST_DEFAULT_SEARCH_UNIQUE = {
  autocomplete: [
    {
      name: 'DE',
      defaultSearch: true,
      autocomplete: [{ name: 'Berlin' }],
      unique: true,
    },
    {
      name: 'AUT',
      autocomplete: [{ name: 'Vienna' }],
    },
  ],
};

export const TEST_DATA_KEYBOARD_NAVIGATION = {
  autocomplete: [
    {
      name: 'AUT',
      autocomplete: [
        {
          name: 'Upper Austria',
        },
        {
          name: 'Lower Austria',
        },
        {
          name: 'Vienna',
        },
        {
          name: 'Salzburg',
        },
      ],
    },
  ],
};

export const TEST_DATA_PLACEHOLDER = {
  name: 'Category',
  value: 'category',
  autocomplete: [
    {
      name: 'Locations',
      autocomplete: [
        {
          name: 'Linz',
          value: 'linz',
          autocomplete: [
            { name: 'Pöstlingberg' },
            { name: 'Froschgarten' },
            { name: 'Bachlberg' },
            { name: 'St. Magdalena' },
          ],
        },
        { name: 'Wels' },
        { name: 'Steyr' },
        { name: 'Leonding' },
        { name: 'Traun' },
        { name: 'Vöcklabruck' },
      ],
    },
  ],
};
