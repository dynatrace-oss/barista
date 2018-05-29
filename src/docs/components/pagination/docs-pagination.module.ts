import { NgModule } from '@angular/core';
import { DocsPaginationComponent } from './docs-pagination.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import {DtPaginationModule, DtButtonModule, DtThemingModule} from '@dynatrace/angular-components';
import { DefaultPaginationExampleComponent } from './examples/default-pagination-example.component';
import {ManyPaginationExampleComponent} from './examples/many-pagination-example.component';


const EXAMPLES = [
  DefaultPaginationExampleComponent,
  ManyPaginationExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtThemingModule,
    DtPaginationModule,
    DtButtonModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsPaginationComponent,
  ],
  exports: [
    DocsPaginationComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsPaginationModule {
}
