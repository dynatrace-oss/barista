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

import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtThemingModule } from '@dynatrace/barista-components/theming';

import { DtTag, DtTagKey } from './tag';
import { DtTagAdd } from './tag-add/tag-add';
import { DtTagAddButton } from './tag-add/tag-add-button';
import { DtTagList } from './tag-list/tag-list';

@NgModule({
  imports: [
    CommonModule,
    DtIconModule,
    DtButtonModule,
    DtInputModule,
    OverlayModule,
    A11yModule,
    DtThemingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [DtTag, DtTagKey, DtTagAdd, DtTagList],
  declarations: [DtTag, DtTagKey, DtTagAdd, DtTagList, DtTagAddButton],
})
export class DtTagModule {}
