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
import { DtButtonGroupModule } from '@dynatrace/barista-components/button-group';
import { DtE2EButtonGroup } from './button-group';

const routes: Route[] = [{ path: '', component: DtE2EButtonGroup }];

@NgModule({
  declarations: [DtE2EButtonGroup],
  imports: [CommonModule, RouterModule.forChild(routes), DtButtonGroupModule],
  exports: [],
  providers: [],
})
export class DtE2EButtonGroupModule {}
