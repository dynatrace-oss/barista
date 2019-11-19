/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import {
  DT_DEFAULT_UI_TEST_CONFIG,
  DT_OVERLAY_ATTRIBUTE_PROPAGATION_CONFIG,
  DtOptionModule,
} from '@dynatrace/barista-components/core';

import { CommonModule } from '@angular/common';
import { DtAutocomplete } from './autocomplete';
import { DtAutocompleteOrigin } from './autocomplete-origin';
import { DtAutocompleteTrigger } from './autocomplete-trigger';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [CommonModule, OverlayModule, DtOptionModule],
  exports: [
    DtAutocompleteTrigger,
    DtAutocomplete,
    DtAutocompleteOrigin,
    DtOptionModule,
  ],
  declarations: [DtAutocompleteTrigger, DtAutocomplete, DtAutocompleteOrigin],
  providers: [
    {
      provide: DT_OVERLAY_ATTRIBUTE_PROPAGATION_CONFIG,
      useValue: DT_DEFAULT_UI_TEST_CONFIG,
    },
  ],
})
export class DtAutocompleteModule {}
