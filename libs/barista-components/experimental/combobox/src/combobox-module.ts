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

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtCombobox } from './combobox';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtAutocompleteModule } from '@dynatrace/barista-components/autocomplete';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import { PortalModule } from '@angular/cdk/portal';
import { DtOptionModule } from '@dynatrace/barista-components/core';

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    FormsModule,
    DtIconModule,
    DtInputModule,
    DtAutocompleteModule,
    DtLoadingDistractorModule,
    PortalModule,
  ],
  exports: [DtCombobox, DtOptionModule],
  declarations: [DtCombobox],
})
export class DtComboboxModule {}
