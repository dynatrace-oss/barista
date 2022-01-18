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
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtTopBarNavigationModule } from '@dynatrace/barista-components/top-bar-navigation';
import { DtDrawerModule } from '@dynatrace/barista-components/drawer';

import { DtExampleTopBarNavigationDrawer } from './top-bar-navigation-drawer-example/top-bar-navigation-drawer-example';
import { DtExampleTopBarNavigationDefault } from './top-bar-navigation-default-example/top-bar-navigation-default-example';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    DtIconModule,
    DtTopBarNavigationModule,
    DtDrawerModule,
  ],
  declarations: [
    DtExampleTopBarNavigationDrawer,
    DtExampleTopBarNavigationDefault,
  ],
})
export class DtExamplesTopBarNavigationModule {}
