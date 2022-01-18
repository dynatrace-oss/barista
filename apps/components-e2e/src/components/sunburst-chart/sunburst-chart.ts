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

import { Component } from '@angular/core';
import { DtSunburstChartNode } from '@dynatrace/barista-components/sunburst-chart';
import { DtColors } from '@dynatrace/barista-components/theming';

@Component({
  selector: 'dt-e2e-sunburst-chart',
  templateUrl: 'sunburst-chart.html',
  styles: ['.dt-sunburst-chart ::ng-deep svg { max-width: 700px; }'],
})
export class DtE2ESunburstChart {
  selected: DtSunburstChartNode[];
  valueDisplayMode: 'absolute' | 'percent' = 'absolute';

  series: DtSunburstChartNode[] = [
    {
      // value: 4,
      label: 'Locke',
      children: [
        {
          value: 2,
          label: 'John',
        },
        {
          value: 1,
          label: 'Terry',
        },
        {
          value: 1,
          label: "O'Quinn",
        },
      ],
    },
    {
      // value: 8,
      label: 'Reyes',
      children: [
        {
          value: 4,
          label: 'Hugo',
        },
        {
          value: 2,
          label: 'Jorge',
        },
        {
          value: 2,
          label: 'Garcia',
        },
      ],
    },
    {
      // value: 15,
      label: 'Ford',
      children: [
        {
          value: 8,
          label: 'James',
        },
        {
          value: 4,
          label: 'Josh',
        },
        {
          value: 3,
          label: 'Holloway',
        },
      ],
    },
    {
      // value: 16,
      label: 'Jarrah',
      color: DtColors.SHAMROCKGREEN_500,
      children: [
        {
          value: 8,
          label: 'Sayid',
        },
        {
          value: 4,
          label: 'Naveen',
        },
        {
          value: 4,
          label: 'Andrews',
        },
      ],
    },
    {
      // value: 23,
      label: 'Shephard',
      children: [
        {
          value: 15,
          label: 'Jack',
        },
        {
          value: 4,
          label: 'Matthew',
        },
        {
          value: 4,
          label: 'Fox',
        },
      ],
    },
    {
      // value: 42,
      label: 'Kwon',
      children: [
        {
          value: 15,
          label: 'Jin',
        },
        {
          label: 'Daniel Dae',
          children: [
            {
              value: 15,
              label: 'Daniel',
            },
            {
              value: 8,
              label: 'Dae',
            },
          ],
        },
        {
          value: 4,
          label: 'Kim',
        },
      ],
    },
  ];
}
