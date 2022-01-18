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
import { DtMenuModule } from '@dynatrace/barista-components/menu';
import { DtContextDialogModule } from '@dynatrace/barista-components/context-dialog';
import { DtDrawerModule } from '@dynatrace/barista-components/drawer';
import { DtCheckboxModule } from '@dynatrace/barista-components/checkbox';

import { DtExampleMenuDefault } from './menu-default-example/menu-default-example';
import { DtExampleMenuWithinContextDialog } from './menu-within-context-dialog-example/menu-within-context-dialog-example';
import { DtExampleMenuWithinDrawer } from './menu-within-drawer-example/menu-within-drawer-example';

@NgModule({
  imports: [
    DtMenuModule,
    DtContextDialogModule,
    DtDrawerModule,
    DtCheckboxModule,
  ],
  declarations: [
    DtExampleMenuDefault,
    DtExampleMenuWithinContextDialog,
    DtExampleMenuWithinDrawer,
  ],
})
export class DtMenuExamplesModule {}
