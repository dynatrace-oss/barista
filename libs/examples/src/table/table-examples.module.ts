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
import { DtTableModule } from '@dynatrace/barista-components/table';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIndicatorModule } from '@dynatrace/barista-components/indicator';
import { DtPaginationModule } from '@dynatrace/barista-components/pagination';
import { DtShowMoreModule } from '@dynatrace/barista-components/show-more';
import { DtEmptyStateModule } from '@dynatrace/barista-components/empty-state';
import { DtInfoGroupModule } from '@dynatrace/barista-components/info-group';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';
import { DtKeyValueListModule } from '@dynatrace/barista-components/key-value-list';
import { DtFormattersModule } from '@dynatrace/barista-components/formatters';
import { DtContainerBreakpointObserverModule } from '@dynatrace/barista-components/container-breakpoint-observer';
import { DtHighlightModule } from '@dynatrace/barista-components/highlight';

import { DtExampleTableColumnProportion } from './table-column-proportion-example/table-column-proportion-example';
import { DtExampleTableExpandableRows } from './table-expandable-rows-example/table-expandable-rows-example';
import { DtExampleTableButtons } from './table-buttons-example/table-buttons-example';
import { DtExampleTableColumnMinWidth } from './table-column-min-width-example/table-column-min-width-example';
import { DtExampleTableComparators } from './table-comparators-example/table-comparators-example';
import { DtExampleTableCustomColumns } from './table-custom-columns-example/table-custom-columns-example';
import { DtExampleTableDefault } from './table-default-example/table-default-example';
import { DtExampleTableDynamicColumns } from './table-dynamic-columns-example/table-dynamic-columns-example';
import { DtExampleTableEmptyState } from './table-empty-state-example/table-empty-state-example';
import { DtExampleTableExport } from './table-export-example/table-export-example';
import { DtExampleTableExportSelection } from './table-export-selection-example/table-export-selection-example';
import { DtExampleTableFavoriteColumn } from './table-favorite-column-example/table-favorite-column-example';
import { DtExampleTableFavoriteColumnNoHeader } from './table-favorite-column-no-header-example/table-favorite-column-no-header-example';
import { DtExampleTableInteractiveRows } from './table-interactive-rows-example/table-interactive-rows-example';
import { DtExampleTableLoading } from './table-loading-example/table-loading-example';
import { DtExampleTableObservable } from './table-observable-example/table-observable-example';
import { DtExampleTableOrderColumn } from './table-order-column-example/table-order-column-example';
import { DtExampleTableOrderExpandable } from './table-order-expandable-example/table-order-expandable-example';
import { DtExampleTableOrderObservable } from './table-order-observable-example/table-order-observable-example';
import { DtExampleTablePagination } from './table-pagination-example/table-pagination-example';
import { DtExampleTableProblem } from './table-problem-example/table-problem-example';
import { DtExampleTableResponsive } from './table-responsive-example/table-responsive-example';
import { DtExampleTableSearch } from './table-search-example/table-search-example';
import { DtExampleTableSelection } from './table-selection-example/table-selection-example';
import { DtExampleTableShowMore } from './table-show-more-example/table-show-more-example';
import { DtExampleTableSorting } from './table-sorting-example/table-sorting-example';
import { DtExampleTableSortingMixedColumns } from './table-sorting-mixed-columns-example/table-sorting-mixed-columns-example';
import { DtExampleTableStickyHeader } from './table-sticky-header-example/table-sticky-header-example';
import { DtExampleTableWithInfoGroupCell } from './table-with-info-group-cell-example/table-with-info-group-cell-example';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    DtKeyValueListModule,
    DtTableModule,
    DtButtonModule,
    DtIndicatorModule,
    DtPaginationModule,
    DtShowMoreModule,
    DtEmptyStateModule,
    DtInfoGroupModule,
    DtLoadingDistractorModule,
    DtFormattersModule,
    DtContainerBreakpointObserverModule,
    DtHighlightModule,
  ],
  declarations: [
    DtExampleTableButtons,
    DtExampleTableColumnMinWidth,
    DtExampleTableColumnProportion,
    DtExampleTableComparators,
    DtExampleTableCustomColumns,
    DtExampleTableDefault,
    DtExampleTableDynamicColumns,
    DtExampleTableEmptyState,
    DtExampleTableExport,
    DtExampleTableExportSelection,
    DtExampleTableExpandableRows,
    DtExampleTableFavoriteColumn,
    DtExampleTableFavoriteColumnNoHeader,
    DtExampleTableInteractiveRows,
    DtExampleTableLoading,
    DtExampleTableObservable,
    DtExampleTableOrderColumn,
    DtExampleTableOrderExpandable,
    DtExampleTableOrderObservable,
    DtExampleTablePagination,
    DtExampleTableProblem,
    DtExampleTableResponsive,
    DtExampleTableSearch,
    DtExampleTableSelection,
    DtExampleTableShowMore,
    DtExampleTableSorting,
    DtExampleTableSortingMixedColumns,
    DtExampleTableStickyHeader,
    DtExampleTableWithInfoGroupCell,
  ],
})
export class DtExamplesTableModule {}
