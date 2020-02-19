/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIndicatorModule } from '@dynatrace/barista-components/core';
import { DtEmptyStateModule } from '@dynatrace/barista-components/empty-state';
import { DtFormFieldModule } from '@dynatrace/barista-components/form-field';
import { DtFormattersModule } from '@dynatrace/barista-components/formatters';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtInputModule } from '@dynatrace/barista-components/input';

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
  DtSimpleNumberColumn,
  DtSimpleTextColumn,
  DtFavoriteColumn,
} from './simple-columns/index';
import { DtSort } from './sort/sort';
import { DtSortHeader } from './sort/sort-header';
import {
  DtTableEmptyState,
  DtTableEmptyStateDirective,
  DtTableEmptyStateImage,
  DtTableEmptyStateMessage,
  DtTableEmptyStateTitle,
  DtTableLoadingState,
} from './states/index';
import { DtTable } from './table';

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
  DtTableEmptyState, // tslint:disable-line:deprecation
  DtTableEmptyStateDirective, // tslint:disable-line:deprecation
  DtTableEmptyStateImage, // tslint:disable-line:deprecation
  DtTableEmptyStateTitle, // tslint:disable-line:deprecation
  DtTableEmptyStateMessage, // tslint:disable-line:deprecation
  DtTableLoadingState,
  DtSort,
  DtSortHeader,
  DtTableSearch,
  DtSimpleTextColumn,
  DtSimpleNumberColumn,
  DtExpandableRowContent,
  DtFavoriteColumn,
];

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    CdkTableModule,
    DtIconModule,
    DtFormFieldModule,
    DtInputModule,
    DtButtonModule,
    DtIndicatorModule,
    DtFormattersModule,
    DtEmptyStateModule,
  ],
  exports: [...EXPORTED_DECLARATIONS, DtIndicatorModule],
  declarations: [...EXPORTED_DECLARATIONS],
})
export class DtTableModule {}
