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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtLegendModule } from '@dynatrace/barista-components/legend';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';

import { DtEventChart } from './event-chart';
import {
  DtEventChartEvent,
  DtEventChartLane,
  DtEventChartLegendItem,
  DtEventChartOverlay,
  DtEventChartHeatfieldOverlay,
  DtEventChartField,
} from './event-chart-directives';
import { DtEventChartLegend } from './event-chart-legend';
import { DtFormattersModule } from '@dynatrace/barista-components/formatters';

export const DT_EVENT_CHART_DIRECTIVES = [
  DtEventChart,
  DtEventChartEvent,
  DtEventChartLane,
  DtEventChartLegendItem,
  DtEventChartOverlay,
  DtEventChartHeatfieldOverlay,
  DtEventChartField,
];

@NgModule({
  exports: DT_EVENT_CHART_DIRECTIVES,
  imports: [CommonModule, DtLegendModule, DtOverlayModule, DtFormattersModule],
  declarations: [DtEventChartLegend, ...DT_EVENT_CHART_DIRECTIVES],
})
export class DtEventChartModule {}
