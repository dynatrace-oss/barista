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

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtCheckboxModule } from '@dynatrace/barista-components/checkbox';
import {
  DtTriggerableViewportResizer,
  DtViewportResizer,
} from '@dynatrace/barista-components/core';
import { DtDrawerModule } from '@dynatrace/barista-components/drawer';
import { DtFilterFieldModule } from '@dynatrace/barista-components/filter-field';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtRadioModule } from '@dynatrace/barista-components/radio';
import {
  DtQuickFilter,
  DtQuickFilterSubTitle,
  DtQuickFilterTitle,
} from './quick-filter';
import { DtQuickFilterGroup } from './quick-filter-group';

const COMPONENTS = [DtQuickFilter, DtQuickFilterSubTitle, DtQuickFilterTitle];

@NgModule({
  imports: [
    CommonModule,
    DtDrawerModule,
    DtFilterFieldModule,
    DtCheckboxModule,
    DtRadioModule,
    DtButtonModule,
    DtIconModule,
    ScrollingModule,
  ],
  exports: COMPONENTS,
  declarations: [...COMPONENTS, DtQuickFilterGroup],
  providers: [
    { provide: DtViewportResizer, useClass: DtTriggerableViewportResizer },
  ],
})
export class DtQuickFilterModule {}
