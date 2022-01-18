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

export const MULTI_SELECT_DATA = {
  autocomplete: [
    {
      name: 'Years (async)',
      multiOptions: [],
      async: true,
    },
    {
      name: 'Months',
      multiOptions: [
        { name: 'All' },
        { name: 'None (disabled)', disabled: true },
        {
          name: 'Winter',
          options: [
            { name: 'January' },
            { name: 'February' },
            { name: 'March' },
            { name: 'April (disabled)', disabled: true },
          ],
        },
        {
          name: 'Spring',
          options: [{ name: 'April' }, { name: 'May' }, { name: 'June' }],
        },
        {
          name: 'Summer',
          options: [
            { name: 'July' },
            { name: 'August' },
            { name: 'September' },
          ],
        },
        {
          name: 'Autumn',
          options: [
            { name: 'October' },
            { name: 'November' },
            { name: 'December' },
          ],
        },
      ],
    },
    {
      name: 'Days',
      multiOptions: [
        { name: 'All' },
        { name: 'All work days' },
        { name: 'All weekends' },
        { name: 'None (disabled)', disabled: true },
        {
          name: 'Work days',
          options: [
            { name: 'Monday' },
            { name: 'Tuesday' },
            { name: 'Wednesday' },
            { name: 'Thursday' },
            { name: 'Friday' },
            { name: 'Sunday (disabled)', disabled: true },
          ],
        },
        {
          name: 'Weekend',
          options: [{ name: 'Saturday' }, { name: 'Sunday' }],
        },
      ],
    },
    {
      name: 'CH (async, partial)',
      multiOptions: [],
      async: true,
    },
    {
      name: 'Season',
      autocomplete: [
        {
          name: 'Winter',
          multiOptions: [
            { name: 'January' },
            { name: 'February' },
            { name: 'March' },
            { name: 'April (disabled)' },
          ],
        },
        {
          name: 'Spring',
          multiOptions: [{ name: 'April' }, { name: 'May' }, { name: 'June' }],
        },
        {
          name: 'Summer',
          multiOptions: [
            { name: 'July' },
            { name: 'August' },
            { name: 'September' },
          ],
        },
      ],
    },
  ],
};
