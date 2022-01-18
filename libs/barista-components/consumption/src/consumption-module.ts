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

import { DtProgressBarModule } from '@dynatrace/barista-components/progress-bar';
import { DtThemingModule } from '@dynatrace/barista-components/theming';

import { DtConsumption } from './consumption';
import {
  DtConsumptionCount,
  DtConsumptionIcon,
  DtConsumptionLabel,
  DtConsumptionOverlay,
  DtConsumptionSubtitle,
  DtConsumptionTitle,
} from './consumption-directives';

const CONSUMPTION_DIRECTIVES = [
  DtConsumption,
  DtConsumptionTitle,
  DtConsumptionSubtitle,
  DtConsumptionIcon,
  DtConsumptionCount,
  DtConsumptionLabel,
  DtConsumptionOverlay,
];

@NgModule({
  exports: CONSUMPTION_DIRECTIVES,
  declarations: CONSUMPTION_DIRECTIVES,
  imports: [DtProgressBarModule, DtThemingModule],
})
export class DtConsumptionModule {}
