import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { DtIconModule } from '@dynatrace/angular-components';
import { UiModule } from '../../ui/ui.module';
import { AllIconExample, DocsAsyncIcon } from './examples/icon-all-example';
import { DefaultIconExample } from './examples/icon-default-example';

const EXAMPLES = [
  DefaultIconExample,
  AllIconExample,
  DocsAsyncIcon,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    HttpClientModule,
    DtIconModule,
  ],
  declarations: [
    ...EXAMPLES,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsIconModule {
}
