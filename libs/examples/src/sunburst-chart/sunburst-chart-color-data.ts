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

import { DtColors } from '@dynatrace/barista-components/theming';

export const sunburstChartColorData = [
  {
    label: 'Red',
    color: DtColors.RED_500,
    children: [
      {
        value: 1,
        label: 'Strawberry',
      },
      {
        value: 1,
        label: 'Cherry',
      },
      {
        value: 2,
        label: 'Tomato',
      },
    ],
  },
  {
    label: 'Yellow',
    color: DtColors.YELLOW_500,
    children: [
      {
        value: 1,
        label: 'Banana',
      },
      {
        value: 1,
        label: 'Pinneapple',
      },
      {
        value: 1,
        label: 'Lemon',
      },
    ],
  },
  {
    label: 'Green',
    color: DtColors.SHAMROCKGREEN_500,
    children: [
      {
        value: 1,
        label: 'Lime',
      },
      {
        value: 1,
        label: 'Avocado',
      },
      {
        value: 2,
        label: 'Kiwi',
      },
    ],
  },
  {
    label: 'Purple',
    color: DtColors.PURPLE_500,
    children: [
      {
        value: 1,
        label: 'Fig',
      },
      {
        value: 1,
        label: 'Grape',
      },
      {
        value: 1,
        label: 'Plum',
      },
    ],
  },
];
