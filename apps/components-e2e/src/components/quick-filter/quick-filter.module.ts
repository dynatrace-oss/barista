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
import { Route, RouterModule } from '@angular/router';
import { DtQuickFilterModule } from '@dynatrace/barista-components/quick-filter';
import { DtE2EQuickFilter } from './quick-filter/quick-filter';
import { DtE2EQuickFilterInitialData } from './quick-filter-initial-data/quick-filter-initial-data';
import { DtE2EQuickFilterAsync } from './quick-filter-async/quick-filter-async';
import { DtE2EQuickFilterShowMore } from './quick-filter-show-more/quick-filter-show-more';
import {
  DtExampleQuickFilterDefault,
  DtExampleQuickFilterCustomShowMore,
} from '@dynatrace/barista-examples/quick-filter';

const routes: Route[] = [
  { path: '', component: DtE2EQuickFilter },
  { path: 'initial-data', component: DtE2EQuickFilterInitialData },
  { path: 'async', component: DtE2EQuickFilterAsync },
  { path: 'show-more', component: DtE2EQuickFilterShowMore },
  { path: 'examples/default', component: DtExampleQuickFilterDefault },
  { path: 'examples/show-more', component: DtExampleQuickFilterCustomShowMore },
];

@NgModule({
  declarations: [
    DtE2EQuickFilter,
    DtE2EQuickFilterInitialData,
    DtE2EQuickFilterAsync,
    DtE2EQuickFilterShowMore,
  ],
  imports: [CommonModule, DtQuickFilterModule, RouterModule.forChild(routes)],
  exports: [],
  providers: [],
})
export class DtE2EQuickFilterModule {}
