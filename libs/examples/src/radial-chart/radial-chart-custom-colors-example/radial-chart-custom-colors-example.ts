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
  selector: 'dt-example-radial-chart-custom-colors',
  templateUrl: './radial-chart-custom-colors-example.html',
})
export class DtExampleRadialChartCustomColors {
  _chartSeries = [
    {
      name: 'Chrome',
      value: 43,
      color: '#006bba',
    },
    {
      name: 'Safari',
      value: 31,
      color: '#b4e5f9',
    },
    {
      name: 'Firefox',
      value: 17,
      color: '#2ab6f4',
    },
    {
      name: 'Microsoft Edge',
      value: 9,
    },
    {
      name: 'Internet Explorer 11',
      value: 2,
    },
  ];
}
