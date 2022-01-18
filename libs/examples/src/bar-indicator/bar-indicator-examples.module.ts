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
import { DtBarIndicatorModule } from '@dynatrace/barista-components/bar-indicator';
import { DtButtonGroupModule } from '@dynatrace/barista-components/button-group';
import { DtTableModule } from '@dynatrace/barista-components/table';
import { DtExampleBarIndicatorAlignment } from './bar-indicator-alignment-example/bar-indicator-alignment-example';
import { DtExampleBarIndicatorColor } from './bar-indicator-color-example/bar-indicator-color-example';
import { DtExampleBarIndicatorDefault } from './bar-indicator-default-example/bar-indicator-default-example';
import { DtExampleBarIndicatorDynamic } from './bar-indicator-dynamic-example/bar-indicator-dynamic-example';
import { DtExampleBarIndicatorTable } from './bar-indicator-table-example/bar-indicator-table-example';

@NgModule({
  imports: [
    CommonModule,
    DtBarIndicatorModule,
    DtButtonGroupModule,
    DtTableModule,
  ],
  declarations: [
    DtExampleBarIndicatorAlignment,
    DtExampleBarIndicatorColor,
    DtExampleBarIndicatorDefault,
    DtExampleBarIndicatorDynamic,
    DtExampleBarIndicatorTable,
  ],
})
export class DtBarIndicatorExamplesModule {}
