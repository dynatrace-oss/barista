/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { DtExampleFilterFieldDefault } from './filter-field-default-example/filter-field-default-example';
import { DtExampleFilterFieldDistinct } from './filter-field-distinct-example/filter-field-distinct-example';
import { DtExampleFilterFieldProgrammaticFilters } from './filter-field-programmatic-filters-example/filter-field-programmatic-filters-example';
import { DtExampleFilterFieldReadOnlyTags } from './filter-field-readonly-non-editable-tags-example/filter-field-readonly-non-editable-tags-example';
import { DtExampleFilterFieldUnique } from './filter-field-unique-example/filter-field-unique-example';
import { DtExampleFilterFieldDisabled } from './filter-field-disabled-example/filter-field-disabled-example';
import { DtExampleFilterFieldValidator } from './filter-field-validator-example/filter-field-validator-example';

export const DT_FILTER_FIELD_EXAMPLES = [
  DtExampleFilterFieldAsync,
  DtExampleFilterFieldClearall,
  DtExampleFilterFieldDefault,
  DtExampleFilterFieldDistinct,
  DtExampleFilterFieldProgrammaticFilters,
  DtExampleFilterFieldDisabled,
  DtExampleFilterFieldReadOnlyTags,
  DtExampleFilterFieldUnique,
  DtExampleFilterFieldValidator,
];

@NgModule({
  imports: [DtFilterFieldModule, DtInputModule],
  declarations: [...DT_FILTER_FIELD_EXAMPLES],
  entryComponents: [...DT_FILTER_FIELD_EXAMPLES],
})
export class DtFilterFieldExamplesModule {}
