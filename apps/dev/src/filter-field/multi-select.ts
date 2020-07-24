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

export const MULTI_SELECT_DATA = {
  autocomplete: [
    {
      name: 'Months',
      multiOptions: [
        { name: 'All' },
        {
          name: 'Winter',
          options: [
            { name: 'January' },
            { name: 'February' },
            { name: 'March' },
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
        {
          name: 'Work days',
          options: [
            { name: 'Monday' },
            { name: 'Tuesday' },
            { name: 'Wednesday' },
            { name: 'Thursday' },
            { name: 'Friday' },
          ],
        },
        {
          name: 'Weekend',
          options: [{ name: 'Saturday' }, { name: 'Sunday' }],
        },
      ],
    },
  ],
};
