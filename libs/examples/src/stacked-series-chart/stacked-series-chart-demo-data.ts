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

import { DtColors } from '@dynatrace/barista-components/theming';
import {
  DtStackedSeriesChartSeries,
  DtStackedSeriesHeatField,
} from '@dynatrace/barista-components/stacked-series-chart';

export const stackedSeriesChartDemoDataCoffee = [
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

export const stackedSeriesChartDemoDataCoffeeHeatFields: DtStackedSeriesHeatField[] =
  [
    {
      start: {
        label: 'Espresso',
      },
      end: {
        label: 'Macchiato',
      },
      data: {
        name: 'HeatField 1',
      },
    },
    {
      start: {
        label: 'Macchiato',
      },
      data: {
        name: 'HeatField 2',
      },
    },
  ];

export const stackedSeriesChartDemoDataCoffeeOverlapHeatFields: DtStackedSeriesHeatField[] =
  [
    {
      start: {
        label: 'Espresso',
      },
      end: {
        label: 'Macchiato',
      },
      data: {
        name: 'HeatField 1',
      },
    },
    {
      start: {
        label: 'Espresso',
      },
      data: {
        name: 'HeatField 2',
      },
    },
    {
      start: {
        label: 'Americano',
      },
      end: {
        label: 'Mocha',
      },
      data: {
        name: 'HeatField 3',
      },
    },
    {
      start: {
        label: 'Macchiato',
      },
      end: {
        label: 'Americano',
      },
      data: {
        name: 'HeatField 4',
      },
    },
    {
      start: {
        label: 'Americano',
      },
      end: {
        label: 'Americano',
      },
      data: {
        name: 'HeatField 5',
      },
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

export const stackedSeriesChartDemoData_7d = [
  {
    label: 'Jan, 08  / 24:00',
    timeDate: '2022-01-07T23:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 0,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 4977536,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 08  / 12:00',
    timeDate: '2022-01-08T11:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 0,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 4935872,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 09  / 24:00',
    timeDate: '2022-01-08T23:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 0,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 4967168,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 09  / 12:00',
    timeDate: '2022-01-09T11:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 0,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 4985472,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 10  / 24:00',
    timeDate: '2022-01-09T23:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 0,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 4960000,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 10  / 12:00',
    timeDate: '2022-01-10T11:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 0,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 4932160,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 11  / 24:00',
    timeDate: '2022-01-10T23:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 0,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 4998400,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 11  / 12:00',
    timeDate: '2022-01-11T11:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 0,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 4954048,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 12  / 24:00',
    timeDate: '2022-01-11T23:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 0,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 4950720,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 12  / 12:00',
    timeDate: '2022-01-12T11:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 0,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 4917568,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 13  / 24:00',
    timeDate: '2022-01-12T23:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 0,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 4960640,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 13  / 12:00',
    timeDate: '2022-01-13T11:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 0,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 4977920,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 14  / 24:00',
    timeDate: '2022-01-13T23:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 1,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 5019712,
        color: '#612c85',
      },
    ],
  },
  {
    label: 'Jan, 14  / 12:00',
    timeDate: '2022-01-14T11:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 242808,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 1568960,
        color: '#612c85',
      },
    ],
  },
];

export const stackedSeriesChartDemoData_30m = [
  {
    label: '14:56',
    timeDate: '2022-01-14T13:56:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 13448,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 119,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:00',
    timeDate: '2022-01-14T14:00:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 13604,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 121,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:02',
    timeDate: '2022-01-14T14:02:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 13018,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 128,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:04',
    timeDate: '2022-01-14T14:04:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 13909,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 117,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:06',
    timeDate: '2022-01-14T14:06:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 13860,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 126,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:08',
    timeDate: '2022-01-14T14:08:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 13634,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 122,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:10',
    timeDate: '2022-01-14T14:10:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 13499,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 121,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:12',
    timeDate: '2022-01-14T14:12:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 13780,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 119,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:14',
    timeDate: '2022-01-14T14:14:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 13722,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 118,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:16',
    timeDate: '2022-01-14T14:16:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 13732,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 78,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:18',
    timeDate: '2022-01-14T14:18:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 13642,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 38,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:20',
    timeDate: '2022-01-14T14:20:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 12890,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 20,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:22',
    timeDate: '2022-01-14T14:22:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 11422,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 0,
        color: '#612c85',
      },
    ],
  },
  {
    label: '15:24',
    timeDate: '2022-01-14T14:24:00.000Z',
    nodes: [
      {
        label: 'Espresso',
        value: 617,
        color: '#debbf3',
      },
      {
        label: 'Americano',
        value: 0,
        color: '#612c85',
      },
    ],
  },
];

export const stackedSeriesChartDemoData_2h = [
  {
    label: '11:35',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 5,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 3,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 2,
      },
    ],
  },
  {
    label: '11:40',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 0,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 34,
      },
    ],
  },
  {
    label: '11:45',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 0,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 991,
      },
    ],
  },
  {
    label: '11:50',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 3880,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 16550,
      },
    ],
  },
  {
    label: '11:55',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9048,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 24252,
      },
    ],
  },
  {
    label: '12:00',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9178,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 24130,
      },
    ],
  },
  {
    label: '12:05',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9283,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 24197,
      },
    ],
  },
  {
    label: '12:10',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9240,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 23464,
      },
    ],
  },
  {
    label: '12:15',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9113,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 22858,
      },
    ],
  },
  {
    label: '12:20',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9346,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 24407,
      },
    ],
  },
  {
    label: '12:25',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9234,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 22962,
      },
    ],
  },
  {
    label: '12:30',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9139,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 24191,
      },
    ],
  },
  {
    label: '12:35',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9100,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 24208,
      },
    ],
  },
  {
    label: '12:40',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9000,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 24396,
      },
    ],
  },
  {
    label: '12:45',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 8970,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 24362,
      },
    ],
  },
  {
    label: '12:50',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9121,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 24001,
      },
    ],
  },
  {
    label: '12:55',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9116,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 24342,
      },
    ],
  },
  {
    label: '13:00',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9083,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 23997,
      },
    ],
  },
  {
    label: '13:05',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9073,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 24192,
      },
    ],
  },
  {
    label: '13:10',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 9119,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 21318,
      },
    ],
  },
  {
    label: '13:15',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 2760,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 2793,
      },
    ],
  },
  {
    label: '13:20',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 134,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 72,
      },
    ],
  },
  {
    label: '13:25',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 142,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 71,
      },
    ],
  },
  {
    label: '13:30',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 147,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 70,
      },
    ],
  },
  {
    label: '13:35',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 132,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 68,
      },
    ],
  },
  {
    label: '13:40',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 141,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 69,
      },
    ],
  },
  {
    label: '13:45',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 96,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 43,
      },
    ],
  },
  {
    label: '13:50',
    nodes: [
      {
        label: 'Espresso',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Americano',
        color: '#a972cc',
        value: 0,
      },
      {
        label: 'Mocha',
        color: '#debbf3',
        value: 0,
      },
    ],
  },
];
