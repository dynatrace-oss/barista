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
import { DtExpandablePanelModule } from '@dynatrace/barista-components/expandable-panel';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtExampleExpandablePanelDefault } from './expandable-panel-default-example/expandable-panel-default-example';
import { DtExampleExpandablePanelDisabled } from './expandable-panel-disabled-example/expandable-panel-disabled-example';
import { DtExampleExpandablePanelDynamicTrigger } from './expandable-panel-dynamic-trigger-example/expandable-panel-dynamic-trigger-example';
import { DtExampleExpandablePanelProgrammatic } from './expandable-panel-programmatic-example/expandable-panel-programmatic-example';

@NgModule({
  imports: [CommonModule, DtExpandablePanelModule, DtButtonModule],
  declarations: [
    DtExampleExpandablePanelDefault,
    DtExampleExpandablePanelDisabled,
    DtExampleExpandablePanelDynamicTrigger,
    DtExampleExpandablePanelProgrammatic,
  ],
})
export class DtExpandablePanelExamplesModule {}
