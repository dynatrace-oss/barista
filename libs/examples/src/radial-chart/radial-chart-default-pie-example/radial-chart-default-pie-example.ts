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

@Component({
  selector: 'dt-example-radial-chart-pie-default',
  templateUrl: './radial-chart-default-pie-example.html',
})
export class DtExampleRadialChartDefaultPie {
  _chartSeries = [
    {
      name: 'Chrome',
      value: 43,
    },
    {
      name: 'Safari',
      value: 22,
    },
    {
      name: 'Firefox',
      value: 15,
    },
    {
      name: 'Microsoft Edge',
      value: 9,
    },
  ];
}
