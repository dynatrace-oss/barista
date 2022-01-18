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
import { DtTagModule } from '@dynatrace/barista-components/tag';
import { DtE2ETagList } from './tag-list/tag-list';
import { DtE2ETagAdd } from './tag-add/tag-add';
import {
  DT_UI_TEST_CONFIG,
  DT_DEFAULT_UI_TEST_CONFIG,
} from '@dynatrace/barista-components/core';

const routes: Route[] = [
  { path: 'tag-list', component: DtE2ETagList },
  { path: 'tag-add', component: DtE2ETagAdd },
];

@NgModule({
  declarations: [DtE2ETagList, DtE2ETagAdd],
  imports: [CommonModule, RouterModule.forChild(routes), DtTagModule],
  exports: [],
  providers: [
    { provide: DT_UI_TEST_CONFIG, useValue: DT_DEFAULT_UI_TEST_CONFIG },
  ],
})
export class DtE2ETagModule {}
