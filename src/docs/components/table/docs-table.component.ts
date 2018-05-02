import { Component, ViewChild } from '@angular/core';
import { HeaderRowPlaceholder } from '@angular/cdk/table';
import { TableDefaultComponent } from './examples/table-default.component';
import { TableDifferentWidthComponent } from './examples/table-different-width.component';
import { TableMinWidthComponent } from './examples/table-min-width.component';
import { TableEmptyStateComponent } from './examples/table-empty-state.component';
import { TableEmptyCustomStateComponent } from './examples/table-empty-custom-state.component';
import { TableObservableComponent } from './examples/table-observable.component';
import { TableLoadingComponent } from './examples/table-loading.component';
import { TableDynamicColumnsComponent } from './examples/table-dynamic-columns.component';

@Component({
  moduleId: module.id,
  selector: 'docs-table',
  templateUrl: './docs-table.component.html',
})
export class DocsTableComponent {
  examples = {
    default: TableDefaultComponent,
    width: TableDifferentWidthComponent,
    minWidth: TableMinWidthComponent,
    empty: TableEmptyStateComponent,
    emptyCustom: TableEmptyCustomStateComponent,
    observable: TableObservableComponent,
    loading: TableLoadingComponent,
    dynamicColumns: TableDynamicColumnsComponent,
  };
}
