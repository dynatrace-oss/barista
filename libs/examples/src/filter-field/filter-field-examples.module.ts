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
import { DtFilterFieldModule } from '@dynatrace/barista-components/filter-field';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtExampleFilterFieldAsync } from './filter-field-async-example/filter-field-async-example';
import { DtExampleFilterFieldClearall } from './filter-field-clearall-example/filter-field-clearall-example';
import { DtExampleFilterFieldCustomParser } from './filter-field-custom-parser-example/filter-field-custom-parser-example';
import { DtExampleFilterFieldCustomPlaceholder } from './filter-field-custom-placeholder-example/filter-field-custom-placeholder-example';
import { DtExampleFilterFieldDefaultSearch } from './filter-field-default-search-example/filter-field-default-search-example';
import { DtExampleFilterFieldDisabled } from './filter-field-disabled-example/filter-field-disabled-example';
import { DtExampleFilterFieldDistinct } from './filter-field-distinct-example/filter-field-distinct-example';
import { DtExampleFilterFieldInfiniteDataDepth } from './filter-field-infinite-data-depth-example/filter-field-infinite-data-depth-example';
import { DtExampleFilterFieldMultiSelect } from './filter-field-multi-select-example/filter-field-multi-select-example';
import { DtExampleFilterFieldPartial } from './filter-field-partial-example/filter-field-partial-example';
import { DtExampleFilterFieldProgrammaticFilters } from './filter-field-programmatic-filters-example/filter-field-programmatic-filters-example';
import { DtExampleFilterFieldReadOnlyTags } from './filter-field-readonly-non-editable-tags-example/filter-field-readonly-non-editable-tags-example';
import { DtExampleFilterFieldUnique } from './filter-field-unique-example/filter-field-unique-example';
import { DtExampleFilterFieldValidator } from './filter-field-validator-example/filter-field-validator-example';

@NgModule({
  imports: [DtFilterFieldModule, DtInputModule],
  declarations: [
    DtExampleFilterFieldAsync,
    DtExampleFilterFieldClearall,
    DtExampleFilterFieldCustomParser,
    DtExampleFilterFieldCustomPlaceholder,
    DtExampleFilterFieldDefaultSearch,
    DtExampleFilterFieldDistinct,
    DtExampleFilterFieldInfiniteDataDepth,
    DtExampleFilterFieldPartial,
    DtExampleFilterFieldProgrammaticFilters,
    DtExampleFilterFieldDisabled,
    DtExampleFilterFieldReadOnlyTags,
    DtExampleFilterFieldUnique,
    DtExampleFilterFieldValidator,
    DtExampleFilterFieldMultiSelect,
  ],
})
export class DtFilterFieldExamplesModule {}
