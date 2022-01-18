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
import { DtRadioModule } from '@dynatrace/barista-components/radio';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { DtExampleRadioDark } from './radio-dark-example/radio-dark-example';
import { DtExampleRadioDefault } from './radio-default-example/radio-default-example';
import { DtExampleRadioNameGrouping } from './radio-name-grouping-example/radio-name-grouping-example';
import { DtExampleRadioResponsive } from './radio-responsive-example/radio-responsive-example';

@NgModule({
  imports: [DtRadioModule, DtThemingModule],
  declarations: [
    DtExampleRadioDark,
    DtExampleRadioDefault,
    DtExampleRadioNameGrouping,
    DtExampleRadioResponsive,
  ],
})
export class DtRadioExamplesModule {}
