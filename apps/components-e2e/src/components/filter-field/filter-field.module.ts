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
import { DtFilterFieldModule } from '@dynatrace/barista-components/filter-field';
import { DtE2EFilterField } from './filter-field';
import {
  DtExampleFilterFieldAsync,
  DtFilterFieldExamplesModule,
} from '@dynatrace/barista-examples/filter-field';

const routes: Route[] = [
  { path: '', component: DtE2EFilterField },
  { path: 'async', component: DtExampleFilterFieldAsync },
];

@NgModule({
  declarations: [DtE2EFilterField],
  imports: [
    CommonModule,
    DtFilterFieldExamplesModule,
    RouterModule.forChild(routes),
    DtFilterFieldModule,
  ],
  exports: [],
  providers: [],
})
export class DtE2EFilterFieldModule {}
