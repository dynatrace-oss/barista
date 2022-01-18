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

import { PortalModule } from '@angular/cdk/portal';
import { CdkTableModule } from '@angular/cdk/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIndicatorModule } from '@dynatrace/barista-components/indicator';
import { DtEmptyStateModule } from '@dynatrace/barista-components/empty-state';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtFormattersModule } from '@dynatrace/barista-components/formatters';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtCheckboxModule } from '@dynatrace/barista-components/checkbox';
import { DtContextDialogModule } from '@dynatrace/barista-components/context-dialog';

import { DtCell, DtCellDef, DtColumnDef } from './cell';
import {
  DtExpandableCell,
  DtExpandableRow,
  DtExpandableRowContent,
} from './expandable/index';
import {
  DtHeaderCell,
  DtHeaderCellDef,
  DtHeaderRow,
  DtHeaderRowDef,
} from './header/index';
import { DtRow, DtRowDef } from './row';
import { DtTableSearch } from './search/index';
import {
  DtFavoriteColumn,
  DtSimpleNumberColumn,
  DtSimpleTextColumn,
} from './simple-columns/index';
import { DtSort } from './sort/sort';
import { DtSortHeader } from './sort/sort-header';
import { DtTableLoadingState } from './states/index';
import { DtOrder } from './order/order-directive';
import { DtOrderCell } from './order/order-cell';
import { DtTable } from './table';
import {
  DtTableSelection,
  DtTableRowSelector,
  DtTableHeaderSelector,
} from './selection/index';

const EXPORTED_DECLARATIONS = [
  DtTable,
  DtHeaderRow,
  DtHeaderRowDef,
  DtRow,
  DtRowDef,
  DtCell,
  DtCellDef,
  DtColumnDef,
  DtExpandableCell,
  DtExpandableRow,
  DtHeaderCell,
  DtHeaderCellDef,
  DtOrder,
  DtOrderCell,
  DtTableLoadingState,
  DtSort,
  DtSortHeader,
  DtTableSearch,
  DtSimpleTextColumn,
  DtSimpleNumberColumn,
  DtExpandableRowContent,
  DtFavoriteColumn,
  DtTableSelection,
  DtTableRowSelector,
  DtTableHeaderSelector,
];

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    ScrollingModule,
    CdkTableModule,
    DragDropModule,
    DtIconModule,
    DtFormFieldModule,
    DtInputModule,
    DtButtonModule,
    DtIndicatorModule,
    DtFormattersModule,
    DtEmptyStateModule,
    ReactiveFormsModule,
    DtCheckboxModule,
    DtContextDialogModule,
  ],
  exports: [...EXPORTED_DECLARATIONS, DtIndicatorModule],
  declarations: [...EXPORTED_DECLARATIONS],
})
export class DtTableModule {}
