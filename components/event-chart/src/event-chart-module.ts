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
} from 'components/core/src/testing';
import {
  DtEventChartEvent,
  DtEventChartLane,
  DtEventChartLegendItem,
  DtEventChartOverlay,
} from './event-chart-directives';

import { CommonModule } from '@angular/common';
import { DtEventChart } from './event-chart';
import { DtEventChartLegend } from './event-chart-legend';
import { DtLegendModule } from '@dynatrace/barista-components/legend';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { NgModule } from '@angular/core';

export const DT_EVENT_CHART_DIRECTIVES = [
  DtEventChart,
  DtEventChartEvent,
  DtEventChartLane,
  DtEventChartLegendItem,
  DtEventChartOverlay,
];

@NgModule({
  exports: DT_EVENT_CHART_DIRECTIVES,
  imports: [CommonModule, DtLegendModule, DtOverlayModule],
  declarations: [DtEventChartLegend, ...DT_EVENT_CHART_DIRECTIVES],
  providers: [
    {
      provide: DT_OVERLAY_ATTRIBUTE_PROPAGATION_CONFIG,
      useValue: DT_DEFAULT_UI_TEST_CONFIG,
    },
  ],
})
export class DtEventChartModule {}
