import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtThemingModule, DtTableModule, DtLoadingDistractorModule, DtFormattersModule } from '@dynatrace/angular-components';
import { TableDefaultComponent } from './examples/table-default.component';
import { TableDifferentWidthComponent } from './examples/table-different-width.component';
import { TableMinWidthComponent } from './examples/table-min-width.component';
import { TableEmptyStateComponent } from './examples/table-empty-state.component';
import { TableEmptyCustomStateComponent } from './examples/table-empty-custom-state.component';
import { TableObservableComponent } from './examples/table-observable.component';
import { TableLoadingComponent } from './examples/table-loading.component';
import { TableDynamicColumnsComponent } from './examples/table-dynamic-columns.component';
import {TableExpandableRowsComponent} from './examples/table-expandable-rows.component';
import { TableSortingComponent } from './examples/table-sorting.component';

export const EXAMPLES = [
  TableDefaultComponent,
  TableDifferentWidthComponent,
  TableMinWidthComponent,
  TableEmptyStateComponent,
  TableEmptyCustomStateComponent,
  TableObservableComponent,
  TableLoadingComponent,
  TableDynamicColumnsComponent,
  TableExpandableRowsComponent,
  TableSortingComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtThemingModule,
    DtTableModule,
    DtLoadingDistractorModule,
    DtFormattersModule,
  ],
  declarations: [
    ...EXAMPLES,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
  providers: [
    { provide: COMPONENT_EXAMPLES, useValue: EXAMPLES, multi: true },
  ],
})
export class DocsTableModule { }
