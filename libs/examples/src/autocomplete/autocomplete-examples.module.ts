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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DtAutocompleteModule } from '@dynatrace/barista-components/autocomplete';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtExampleAutocompleteAttachDifferentElement } from './autocomplete-attach-different-element-example/autocomplete-attach-different-element-example';
import { DtExampleAutocompleteControlValues } from './autocomplete-control-values-example/autocomplete-control-values-example';
import { DtExampleAutocompleteCustomFilter } from './autocomplete-custom-filter-example/autocomplete-custom-filter-example';
import { DtExampleAutocompleteDefault } from './autocomplete-default-example/autocomplete-default-example';
import { DtExampleAutocompleteGroups } from './autocomplete-groups-example/autocomplete-groups-example';
import { DtExampleAutocompleteHighlightFirstOption } from './autocomplete-highlight-first-option-example/autocomplete-highlight-first-option-example';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DtAutocompleteModule,
    DtInputModule,
    DtFormFieldModule,
  ],
  declarations: [
    DtExampleAutocompleteAttachDifferentElement,
    DtExampleAutocompleteControlValues,
    DtExampleAutocompleteCustomFilter,
    DtExampleAutocompleteDefault,
    DtExampleAutocompleteGroups,
    DtExampleAutocompleteHighlightFirstOption,
  ],
})
export class DtAutocompleteExamplesModule {}
