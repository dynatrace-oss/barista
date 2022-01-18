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
import { CommonModule } from '@angular/common';
import { DtToggleButtonGroupModule } from '@dynatrace/barista-components/toggle-button-group';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtTimelineChartModule } from '@dynatrace/barista-components/timeline-chart';
import { DtExpandableTextModule } from '@dynatrace/barista-components/expandable-text';

import { DtExampleToggleButtonGroupDefault } from './toggle-button-group-default-example/toggle-button-group-default-example';
import { DtExampleToggleButtonGroupDynamicItems } from './toggle-button-group-dynamic-items-example/toggle-button-group-dynamic-items-example';
import { DtExampleToggleButtonGroupShowMore } from './toggle-button-group-show-more-example/toggle-button-group-show-more-example';
@NgModule({
  imports: [
    CommonModule,
    DtToggleButtonGroupModule,
    DtTimelineChartModule,
    DtIconModule,
    DtButtonModule,
    DtExpandableTextModule,
  ],
  declarations: [
    DtExampleToggleButtonGroupDefault,
    DtExampleToggleButtonGroupDynamicItems,
    DtExampleToggleButtonGroupShowMore,
  ],
})
export class DtToggleButtonGroupExamplesModule {}
