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
import { DtStackedSeriesChartSeries } from './stacked-series-chart.util';

export const stackedSeriesChartDemoDataCoffee: DtStackedSeriesChartSeries[] = [
  {
    label: 'Espresso',
    nodes: [
      {
        value: 1,
        label: 'Coffee',
      },
    ],
  },
  {
    label: 'Macchiato',
    nodes: [
      {
        value: 2,
        label: 'Coffee',
      },
      {
        value: 1,
        label: 'Milk',
      },
    ],
  },
  {
    label: 'Americano',
    nodes: [
      {
        value: 2,
        label: 'Coffee',
      },
      {
        value: 3,
        label: 'Water',
      },
    ],
  },
  {
    label: 'Mocha',
    nodes: [
      {
        value: 2,
        label: 'Coffee',
      },
      {
        value: 2,
        label: 'Chocolate',
      },
      {
        value: 1,
        label: 'Milk',
      },
    ],
  },
];

export const stackedSeriesChartDemoDataShows: DtStackedSeriesChartSeries[] = [
  {
    label: 'Lost',
    nodes: [
      {
        value: 25,
        label: 'Season 1',
        color: DtColors.RED_500,
      },
      {
        value: 24,
        label: 'Season 2',
        color: DtColors.ORANGE_400,
      },
      {
        value: 23,
        label: 'Season 3',
        color: DtColors.YELLOW_500,
      },
      {
        value: 14,
        label: 'Season 4',
        color: DtColors.GREEN_500,
      },
      {
        value: 17,
        label: 'Season 5',
        color: DtColors.BLUE_500,
      },
      {
        value: 18,
        label: 'Season 6',
        color: DtColors.PURPLE_500,
      },
    ],
  },
  {
    label: 'Six feet under',
    nodes: [
      {
        value: 13,
        label: 'Season 1',
      },
      {
        value: 13,
        label: 'Season 2',
      },
      {
        value: 13,
        label: 'Season 3',
      },
      {
        value: 12,
        label: 'Season 4',
      },
      {
        value: 12,
        label: 'Season 5',
      },
    ],
  },
  {
    label: 'Halt and catch fire',
    nodes: [
      {
        value: 10,
        label: 'Season 1',
      },
      {
        value: 10,
        label: 'Season 2',
      },
      {
        value: 10,
        label: 'Season 3',
      },
      {
        value: 10,
        label: 'Season 4',
      },
    ],
  },
];
