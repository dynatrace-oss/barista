import { NgModule } from '@angular/core';

import { DocsTableComponent } from './docs-table.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtThemingModule } from '@dynatrace/angular-components/theming';
import { DtTableModule } from '@dynatrace/angular-components/table';
import { DtEmptyStateModule } from '@dynatrace/angular-components/empty-state';
import { TableDefaultComponent } from './examples/table-default.component';
import { TableEmptyStateComponent } from './examples/table-empty-state.component';
import { TableObservableComponent } from './examples/table-observable.component';
import { TableDataSourceComponent } from './examples/table-data-source.component';

const EXAMPLES = [
  TableDefaultComponent,
  TableEmptyStateComponent,
  TableObservableComponent,
  TableDataSourceComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtThemingModule,
    DtTableModule,
    DtEmptyStateModule,
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
