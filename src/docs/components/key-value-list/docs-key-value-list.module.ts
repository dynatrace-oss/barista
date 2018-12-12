import { NgModule } from '@angular/core';
import { DefaultKeyValueListExampleComponent } from './examples/default-key-value-list-example.component';
import { MulticolumnKeyValueListExampleComponent } from './examples/multicolumn-key-value-list-example.component';
import { LongtextKeyValueListExampleComponent } from './examples/longtext-key-value-list-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtKeyValueListModule } from '@dynatrace/angular-components';
import {HtmlKeyValueListExampleComponent} from "./examples/html-key-value-list-example.component";

export const EXAMPLES = [
  DefaultKeyValueListExampleComponent,
  MulticolumnKeyValueListExampleComponent,
  LongtextKeyValueListExampleComponent,
  HtmlKeyValueListExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtKeyValueListModule,
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
export class DocsKeyValueListModule {
}
