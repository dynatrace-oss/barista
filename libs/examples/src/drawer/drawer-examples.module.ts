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
import { DtDrawerModule } from '@dynatrace/barista-components/drawer';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtSelectModule } from '@dynatrace/barista-components/select';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtExampleDrawerDefault } from './drawer-default-example/drawer-default-example';
import { DtExampleDrawerDynamic } from './drawer-dynamic-example/drawer-dynamic-example';
import { DtExampleDrawerNested } from './drawer-nested-example/drawer-nested-example';
import { DtExampleDrawerOver } from './drawer-over-example/drawer-over-example';

@NgModule({
  imports: [
    CommonModule,
    DtDrawerModule,
    DtButtonModule,
    DtSelectModule,
    DtFormFieldModule,
  ],
  declarations: [
    DtExampleDrawerDefault,
    DtExampleDrawerDynamic,
    DtExampleDrawerNested,
    DtExampleDrawerOver,
  ],
})
export class DtDrawerExamplesModule {}
