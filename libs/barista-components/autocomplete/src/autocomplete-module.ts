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

import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtOptionModule } from '@dynatrace/barista-components/core';

import { DtAutocomplete } from './autocomplete';
import { DtAutocompleteOrigin } from './autocomplete-origin';
import { DtAutocompleteTrigger } from './autocomplete-trigger';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [CommonModule, OverlayModule, DtOptionModule, PortalModule],
  exports: [
    DtAutocompleteTrigger,
    DtAutocomplete,
    DtAutocompleteOrigin,
    DtOptionModule,
  ],
  declarations: [DtAutocompleteTrigger, DtAutocomplete, DtAutocompleteOrigin],
})
export class DtAutocompleteModule {}
