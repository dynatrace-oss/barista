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
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { DtSunburstChartModule } from '@dynatrace/barista-components/sunburst-chart';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtExampleSunburstChartCustomColor } from './sunburst-chart-custom-color-example/sunburst-chart-custom-color-example';
import { DtExampleSunburstChartDefault } from './sunburst-chart-default-example/sunburst-chart-default-example';
import { DtExampleSunburstChartRelativeValues } from './sunburst-chart-relative-values-example/sunburst-chart-relative-values-example';
import { DtFormattersModule } from '@dynatrace/barista-components/formatters';

@NgModule({
  imports: [
    DtSunburstChartModule,
    DtButtonModule,
    DtThemingModule,
    DtFormattersModule,
    DtOverlayModule,
  ],
  declarations: [
    DtExampleSunburstChartDefault,
    DtExampleSunburstChartRelativeValues,
    DtExampleSunburstChartCustomColor,
  ],
})
export class DtSunburstChartExamplesModule {}
