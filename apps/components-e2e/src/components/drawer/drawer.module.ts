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
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DtChartModule } from '@dynatrace/barista-components/chart';
import { DtDrawerModule } from '@dynatrace/barista-components/drawer';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { DtE2EDrawer } from './drawer';

const routes: Route[] = [{ path: '', component: DtE2EDrawer }];

@NgModule({
  declarations: [DtE2EDrawer],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DtChartModule,
    DtDrawerModule,
    DtOverlayModule,
    ScrollingModule,
  ],
  exports: [],
  providers: [],
})
export class DtE2EDrawerModule {}
