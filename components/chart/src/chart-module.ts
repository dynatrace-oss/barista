/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import {
  DT_DEFAULT_UI_TEST_CONFIG,
  DT_OVERLAY_ATTRIBUTE_PROPAGATION_CONFIG,
} from '@dynatrace/barista-components/core';

import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtChart } from './chart';
import { DtChartHeatfield } from './heatfield/chart-heatfield';
import { DtChartRange } from './range/range';
import { DtChartSelectionArea } from './selection-area/selection-area';
import { DtChartSelectionAreaAction } from './selection-area/overlay-action';
import { DtChartSelectionAreaOrigin } from './selection-area-deprecated/chart-selection-area-origin';
import { DtChartTimestamp } from './timestamp/timestamp';
import { DtChartTooltip } from './tooltip/chart-tooltip';
import { DtFormattersModule } from '@dynatrace/barista-components/formatters';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import { DtSelectionAreaModule } from '@dynatrace/barista-components/selection-area';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

/** components that should be declared and exported */
const COMPONENTS = [
  DtChart,
  DtChartHeatfield,
  DtChartRange,
  // tslint:disable-next-line: deprecation
  DtChartSelectionAreaOrigin,
  DtChartTimestamp,
  DtChartTooltip,
  DtChartSelectionAreaAction,
];

@NgModule({
  imports: [
    CommonModule,
    DtLoadingDistractorModule,
    A11yModule,
    OverlayModule,
    DtIconModule,
    DtButtonModule,
    // tslint:disable-next-line: deprecation
    DtSelectionAreaModule,
    DtFormattersModule,
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS, DtChartSelectionArea],
  providers: [
    {
      provide: DT_OVERLAY_ATTRIBUTE_PROPAGATION_CONFIG,
      useValue: DT_DEFAULT_UI_TEST_CONFIG,
    },
  ],
})
export class DtChartModule {}
