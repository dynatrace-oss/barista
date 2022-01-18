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

/* eslint-disable no-magic-numbers */

import { Component } from '@angular/core';
import { merge as lodashMerge } from 'lodash-es';

import { generateData } from '../chart/chart-data';

@Component({
  selector: 'micro-chart-dev-app-demo',
  templateUrl: './micro-chart-demo.component.html',
  styleUrls: ['./micro-chart-demo.component.scss'],
})
export class MicroChartDemo {
  series = {
    name: 'Requests',
    data: lodashMerge([], generateData(40, 1000, 2000, 1370304000000, 900000)),
  };

  seriesWithGaps = {
    name: 'Requests with Gaps',
    data: lodashMerge(
      [],
      [
        { x: 1370304000000 },
        { x: 1370304900000, y: 1001 },
        { x: 1370305800000, y: null },
        { x: 1370306700000, y: null },
        { x: 1370307600000, y: null },
        { x: 1370308500000, y: null },
        { x: 1370309400000, y: null },
        { x: 1370310300000, y: 1847 },
        { x: 1370311200000, y: 1940 },
        { x: 1370312100000, y: 1830 },
        { x: 1370313000000, y: 1043 },
        { x: 1370313900000 },
        { x: 1370314800000, y: 1187 },
        { x: 1370315700000, y: 1363 },
        { x: 1370316600000, y: 1063 },
        { x: 1370317500000, y: 1723 },
        { x: 1370318400000, y: 1728 },
        { x: 1370319300000, y: 1302 },
        { x: 1370320200000, y: 1747 },
        { x: 1370321100000, y: 1721 },
        { x: 1370322000000, y: 1858 },
        { x: 1370322900000, y: 0 },
        { x: 1370323800000, y: 1078 },
        { x: 1370324700000, y: 1173 },
        { x: 1370325600000, y: 1282 },
        { x: 1370326500000 },
        { x: 1370327400000 },
        { x: 1370328300000, y: 1455 },
        { x: 1370329200000, y: 1869 },
        { x: 1370330100000, y: 1753 },
        { x: 1370331000000, y: 1314 },
        { x: 1370331900000 },
        { x: 1370332800000, y: 1129 },
        { x: 1370333700000, y: 1676 },
        { x: 1370334600000, y: 1196 },
        { x: 1370335500000, y: 1459 },
        { x: 1370336400000 },
        { x: 1370337300000 },
        { x: 1370338200000 },
        { x: 1370339100000 },
      ],
    ),
  };
}
