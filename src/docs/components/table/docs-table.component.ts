import { Component, ViewChild } from '@angular/core';
import { HeaderRowPlaceholder } from '@angular/cdk/table';
import { TableDefaultComponent } from './examples/table-default.component';
import { TableEmptyStateComponent } from './examples/table-empty-state.component';
import { TableObservableComponent } from './examples/table-observable.component';
import { TableDataSourceComponent } from './examples/table-data-source.component';
import { TableLoadingComponent } from './examples/table-loading.component';

@Component({
  moduleId: module.id,
  selector: 'docs-table',
  templateUrl: './docs-table.component.html',
})
export class DocsTableComponent {
  examples = {
    default: TableDefaultComponent,
    empty: TableEmptyStateComponent,
    observable: TableObservableComponent,
    dataSource: TableDataSourceComponent,
    loading: TableLoadingComponent,
  };
}
