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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtAutocompleteModule } from '@dynatrace/barista-components/autocomplete';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtButtonGroupModule } from '@dynatrace/barista-components/button-group';
import { DtCheckboxModule } from '@dynatrace/barista-components/checkbox';
import { DtOptionModule } from '@dynatrace/barista-components/core';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';

import { DtFilterField } from './filter-field';
import { DtFilterFieldMultiSelect } from './filter-field-multi-select/filter-field-multi-select';
import { DtFilterFieldMultiSelectTrigger } from './filter-field-multi-select/filter-field-multi-select-trigger';
import { DtFilterFieldRange } from './filter-field-range/filter-field-range';
import { DtFilterFieldRangeTrigger } from './filter-field-range/filter-field-range-trigger';
import { DtFilterFieldTag } from './filter-field-tag/filter-field-tag';
import { DtHighlightModule } from '@dynatrace/barista-components/highlight';

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
    DtOverlayModule,
    DtHighlightModule,
    DtCheckboxModule,
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
    DtFilterFieldMultiSelect,
    DtFilterFieldMultiSelectTrigger,
  ],
})
export class DtFilterFieldModule {}
