import { NgModule } from '@angular/core';

import { DocsTableComponent } from './docs-table.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtThemingModule } from '@dynatrace/angular-components/theming';
import { DtTableModule } from '@dynatrace/angular-components/table';
import { DtTableEmptyStateModule } from '@dynatrace/angular-components/table/table-empty-state';
import { TableDefaultComponent } from './examples/table-default.component';
import { TableDifferentWidthComponent } from './examples/table-different-width.component';
import { TableEmptyStateComponent } from './examples/table-empty-state.component';
import { TableObservableComponent } from './examples/table-observable.component';
import { TableDataSourceComponent } from './examples/table-data-source.component';
import { TableLoadingComponent } from './examples/table-loading.component';

const EXAMPLES = [
  TableDefaultComponent,
  TableDifferentWidthComponent,
  TableEmptyStateComponent,
  TableObservableComponent,
  TableDataSourceComponent,
  TableLoadingComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtThemingModule,
    DtTableModule,
    DtTableEmptyStateModule,
  ],
  exports: [
    DocsTableComponent,
  ],
  declarations: [
    ...EXAMPLES,
    DocsTableComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsTableModule { }
