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
import { DtAutocompleteModule } from '@dynatrace/barista-components/autocomplete';
import { DtButtonGroupModule } from '@dynatrace/barista-components/button-group';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtFilterField } from './filter-field';
import { DtFilterFieldRange } from './filter-field-range/filter-field-range';
import { DtFilterFieldRangeTrigger } from './filter-field-range/filter-field-range-trigger';
import { DtFilterFieldTag } from './filter-field-tag/filter-field-tag';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    DtIconModule,
    DtButtonModule,
    DtOptionModule,
    DtAutocompleteModule,
    DtInputModule,
    DtButtonGroupModule,
    DtLoadingDistractorModule,
  ],
  exports: [
    DtAutocompleteModule,
    DtOptionModule,
    DtFilterField,
    DtFilterFieldTag,
  ],
  declarations: [
    DtFilterField,
    DtFilterFieldTag,
    DtFilterFieldRange,
    DtFilterFieldRangeTrigger,
  ],
  providers: [
    {
      provide: DT_OVERLAY_ATTRIBUTE_PROPAGATION_CONFIG,
      useValue: DT_DEFAULT_UI_TEST_CONFIG,
    },
  ],
})
export class DtFilterFieldModule {}
