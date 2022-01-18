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

import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtFormattersModule } from '@dynatrace/barista-components/formatters';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';

import { DtChart } from './chart';
import { DtChartHeatfield } from './heatfield/chart-heatfield';
import { DtChartRange } from './range/range';
import { DtChartSelectionAreaAction } from './selection-area/overlay-action';
import { DtChartSelectionArea } from './selection-area/selection-area';
import { DtChartTimestamp } from './timestamp/timestamp';
import { DtChartTooltip } from './tooltip/chart-tooltip';
import { DtChartFocusAnchor, DtChartFocusTarget } from './chart-focus-anchor';

@NgModule({
  imports: [
    CommonModule,
    DtLoadingDistractorModule,
    A11yModule,
    OverlayModule,
    DtIconModule,
    DtButtonModule,
    DtFormattersModule,
  ],
  exports: [
    DtChart,
    DtChartHeatfield,
    DtChartRange,
    DtChartTimestamp,
    DtChartTooltip,
    DtChartSelectionAreaAction,
  ],
  declarations: [
    DtChart,
    DtChartHeatfield,
    DtChartRange,
    DtChartTimestamp,
    DtChartTooltip,
    DtChartSelectionAreaAction,
    DtChartFocusAnchor,
    DtChartFocusTarget,
    DtChartSelectionArea,
  ],
})
export class DtChartModule {}
