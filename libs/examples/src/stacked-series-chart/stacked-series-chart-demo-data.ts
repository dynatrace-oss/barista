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
      start: 'Espresso',
      end: 'Macchiato',
      data: {
        name: 'HeatField 1',
      },
    },
    {
      start: 'Macchiato',
      data: {
        name: 'HeatField 2',
      },
    },
  ];

export const stackedSeriesChartDemoDataCoffeeOverlapHeatFields: DtStackedSeriesHeatField[] =
  [
    {
      start: 'Espresso',
      end: 'Macchiato',
      data: {
        name: 'HeatField 1',
      },
    },
    {
      start: 'Espresso',
      data: {
        name: 'HeatField 2',
      },
    },
    {
      start: 'Americano',
      end: 'Mocha',
      data: {
        name: 'HeatField 3',
      },
    },
    {
      start: 'Macchiato',
      end: 'Americano',
      data: {
        name: 'HeatField 4',
      },
    },
    {
      start: 'Americano',
      end: 'Americano',
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

export const stackedSeriesChartDemoDataConvertedBouncedDates = [
  {
    label: '11:35',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 5,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 3,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 2,
      },
    ],
  },
  {
    label: '11:40',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 0,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 34,
      },
    ],
  },
  {
    label: '11:45',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 0,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 991,
      },
    ],
  },
  {
    label: '11:50',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 3880,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 16550,
      },
    ],
  },
  {
    label: '11:55',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9048,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 24252,
      },
    ],
  },
  {
    label: '12:00',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9178,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 24130,
      },
    ],
  },
  {
    label: '12:05',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9283,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 24197,
      },
    ],
  },
  {
    label: '12:10',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9240,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 23464,
      },
    ],
  },
  {
    label: '12:15',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9113,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 22858,
      },
    ],
  },
  {
    label: '12:20',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9346,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 24407,
      },
    ],
  },
  {
    label: '12:25',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9234,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 22962,
      },
    ],
  },
  {
    label: '12:30',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9139,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 24191,
      },
    ],
  },
  {
    label: '12:35',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9100,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 24208,
      },
    ],
  },
  {
    label: '12:40',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9000,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 24396,
      },
    ],
  },
  {
    label: '12:45',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 8970,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 24362,
      },
    ],
  },
  {
    label: '12:50',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9121,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 24001,
      },
    ],
  },
  {
    label: '12:55',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9116,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 24342,
      },
    ],
  },
  {
    label: '13:00',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9083,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 23997,
      },
    ],
  },
  {
    label: '13:05',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9073,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 24192,
      },
    ],
  },
  {
    label: '13:10',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 9119,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 21318,
      },
    ],
  },
  {
    label: '13:15',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 2760,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 2793,
      },
    ],
  },
  {
    label: '13:20',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 134,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 72,
      },
    ],
  },
  {
    label: '13:25',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 142,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 71,
      },
    ],
  },
  {
    label: '13:30',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 147,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 70,
      },
    ],
  },
  {
    label: '13:35',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 132,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 68,
      },
    ],
  },
  {
    label: '13:40',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 141,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 69,
      },
    ],
  },
  {
    label: '13:45',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 96,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 43,
      },
    ],
  },
  {
    label: '13:50',
    nodes: [
      {
        label: 'Converted',
        color: '#612c85',
        value: 0,
      },
      {
        label: 'Bounced',
        color: '#a972cc',
        value: 0,
      },
      {
        label: 'Neither converted or bounced',
        color: '#debbf3',
        value: 0,
      },
    ],
  },
];
