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
import { DtTabsModule } from '@dynatrace/barista-components/tabs';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { CommonModule } from '@angular/common';
import { DtExampleTabsDynamic } from './tabs-dynamic-example/tabs-dynamic-example';
import { DtExampleTabsDefault } from './tabs-default-example/tabs-default-example';
import { DtExampleTabsInteractive } from './tabs-interactive-example/tabs-interactive-example';

@NgModule({
  imports: [DtTabsModule, DtButtonModule, CommonModule],
  declarations: [
    DtExampleTabsDefault,
    DtExampleTabsDynamic,
    DtExampleTabsInteractive,
  ],
})
export class DtExamplesTabsModule {}
