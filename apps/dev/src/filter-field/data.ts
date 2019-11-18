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

export const COMPLEX_DATA = {
  name: 'Category',
  value: 'category',
  autocomplete: [
    {
      name: 'Locations',
      options: [
        {
          name: 'State',
          value: 'state',
          distinct: true,
          autocomplete: [
            {
              name: 'Oberösterreich',
              value: 'OOE',
              autocomplete: [
                'Linz',
                'Wels',
                'Steyr',
                'Leonding',
                'Traun',
                'Vöcklabruck',
              ],
            },
            {
              name: 'Niederösterreich',
              value: 'NOE',
              autocomplete: [
                'St. Pölten',
                'Melk',
                'Krems',
                'St. Valentin',
                'Amstetten',
              ],
            },
            {
              name: 'Wien',
              value: 'W',
            },
            {
              name: 'Burgenland',
              value: 'B',
            },
            {
              name: 'Steiermark',
              value: 'SMK',
            },
            {
              name: 'Kärnten',
              value: 'KTN',
            },
            {
              name: 'Tirol',
              value: 'TRL',
            },
            {
              name: 'Vorarlberg',
              value: 'VRB',
            },
            {
              name: 'Salzburg',
              value: 'SBZ',
            },
          ],
        },
        {
          name: 'Custom',
          value: 'custom-location',
          suggestions: [],
        },
      ],
    },
    {
      name: 'Browsers',
      options: [
        {
          name: 'Internet Explorer',
          value: 'IE',
          autocomplete: ['< 7', '7', '8', '9', '10', '11'],
        },
        {
          name: 'Edge',
          value: 'IE',
          autocomplete: ['12', '13', { name: 'Custom', suggestions: [] }],
        },
        {
          name: 'Chrome',
          value: 'IE',
          autocomplete: [
            'Latest',
            { name: 'Custom', suggestions: [] },
            {
              name: 'Version',
              range: {
                operators: {
                  range: true,
                  equal: true,
                  greaterThanEqual: true,
                  lessThanEqual: true,
                },
                unit: '',
              },
            },
          ],
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
