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

import { NgModule } from '@angular/core';
import { DtLegendModule } from '@dynatrace/barista-components/legend';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { DtTimelineChartModule } from '@dynatrace/barista-components/timeline-chart';
import { DtExampleLegendDefault } from './legend-default-example/legend-default-example';
import { DtExampleLegendOverlay } from './legend-overlay-example/legend-overlay-example';
import { DtExampleLegendSymbolAttribute } from './legend-symbol-attribute-example/legend-symbol-attribute-example';
import { DtExampleLegendTimelineChart } from './legend-timeline-chart-example/legend-timeline-chart-example';

@NgModule({
  imports: [
    DtLegendModule,
    DtIconModule,
    DtOverlayModule,
    DtTimelineChartModule,
  ],
  declarations: [
    DtExampleLegendDefault,
    DtExampleLegendOverlay,
    DtExampleLegendSymbolAttribute,
    DtExampleLegendTimelineChart,
  ],
})
export class DtLegendExamplesModule {}
