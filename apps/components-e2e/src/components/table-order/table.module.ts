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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DtTableModule } from '@dynatrace/barista-components/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  DT_UI_TEST_CONFIG,
  DT_DEFAULT_UI_TEST_CONFIG,
} from '@dynatrace/barista-components/core';
import { DtE2ETable } from './table-order/table';
import { DtE2ETableExpandable } from './table-order-expandable/table-expandable';

const routes: Route[] = [
  { path: '', component: DtE2ETable },
  { path: 'expandable', component: DtE2ETableExpandable },
];

@NgModule({
  declarations: [DtE2ETable, DtE2ETableExpandable],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DtTableModule,
    DragDropModule,
  ],
  exports: [],
  providers: [
    { provide: DT_UI_TEST_CONFIG, useValue: DT_DEFAULT_UI_TEST_CONFIG },
  ],
})
export class DtE2ETableModule {}
