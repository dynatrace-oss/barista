import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DtIconModule } from '@dynatrace/angular-components';
import { AllIconExample, DocsAsyncIcon } from './examples/icon-all-example';
import { DefaultIconExample } from './examples/icon-default-example';

export const EXAMPLES = [
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
  providers: [
    { provide: COMPONENT_EXAMPLES, useValue: EXAMPLES, multi: true },
  ],
})
export class DocsIconModule {
}
