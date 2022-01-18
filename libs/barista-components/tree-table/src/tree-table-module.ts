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

import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtTableModule } from '@dynatrace/barista-components/table';

import { DtTreeTable } from './tree-table';
import { DtTreeTableHeaderCell } from './tree-table-header-cell';
import { DtTreeTableRow } from './tree-table-row';
import { DtTreeTableToggleCell } from './tree-table-toggle-cell';

@NgModule({
  imports: [
    CdkTableModule,
    CommonModule,
    DtButtonModule,
    DtIconModule,
    DtTableModule,
  ],
  declarations: [
    DtTreeTableRow,
    DtTreeTable,
    DtTreeTableToggleCell,
    DtTreeTableHeaderCell,
  ],
  exports: [
    DtTreeTableRow,
    DtTreeTable,
    DtTreeTableToggleCell,
    DtTreeTableHeaderCell,
    DtButtonModule,
    DtIconModule,
    DtTableModule,
  ],
})
export class DtTreeTableModule {}
