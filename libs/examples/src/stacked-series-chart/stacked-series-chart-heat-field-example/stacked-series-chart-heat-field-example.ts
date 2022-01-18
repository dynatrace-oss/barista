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
import {
  stackedSeriesChartDemoDataCoffee,
  stackedSeriesChartDemoDataCoffeeHeatFields,
  stackedSeriesChartDemoDataCoffeeOverlapHeatFields,
} from '../stacked-series-chart-demo-data';

@Component({
  selector: 'dt-example-heat-field-stacked-series-chart',
  templateUrl: './stacked-series-chart-heat-field-example.html',
})
export class DtExampleStackedSeriesChartHeatField {
  series = stackedSeriesChartDemoDataCoffee;

  mode: 'bar' | 'column' = 'column';

  heatFieldType: 'none' | 'normal' | 'overlap' = 'none';
  heatFieldsByType = {
    normal: stackedSeriesChartDemoDataCoffeeHeatFields,
    overlap: stackedSeriesChartDemoDataCoffeeOverlapHeatFields,
  };
}
