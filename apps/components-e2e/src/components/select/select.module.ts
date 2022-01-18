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
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { DtSelectModule } from '@dynatrace/barista-components/select';
import {
  DT_UI_TEST_CONFIG,
  DT_DEFAULT_UI_TEST_CONFIG,
} from '@dynatrace/barista-components/core';
import { DtE2ESelect } from './select';

const routes: Route[] = [{ path: '', component: DtE2ESelect }];

@NgModule({
  declarations: [DtE2ESelect],
  imports: [CommonModule, RouterModule.forChild(routes), DtSelectModule],
  exports: [],
  providers: [
    { provide: DT_UI_TEST_CONFIG, useValue: DT_DEFAULT_UI_TEST_CONFIG },
  ],
})
export class DtE2ESelectModule {}
