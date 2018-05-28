import { NgModule } from '@angular/core';
import { DefaultKeyValueListExampleComponent } from './examples/default-key-value-list-example.component';
import { MulticolumnKeyValueListExampleComponent } from './examples/multicolumn-key-value-list-example.component';
import { FunctionKeyValueListExampleComponent } from './examples/function-key-value-list-example.component';
import { DocsKeyValueListComponent } from './docs-key-value-list.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtKeyValueListModule } from '@dynatrace/angular-components';

const EXAMPLES = [
  DefaultKeyValueListExampleComponent,
  MulticolumnKeyValueListExampleComponent,
  FunctionKeyValueListExampleComponent
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtKeyValueListModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsKeyValueListComponent,
  ],
  exports: [
    DocsKeyValueListComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsKeyValueListModule {
}
