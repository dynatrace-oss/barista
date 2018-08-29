import { NgModule } from '@angular/core';
import { COMPONENT_EXAMPLES, UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { CountExample } from './examples/count-example';
import { DtFormattersModule, DtInputModule } from '@dynatrace/angular-components';
import { FormsModule } from '@angular/forms';
import { PercentExample } from './examples/percent-example';
import { RateExample } from './examples/rate-example';
import { BytesExample } from './examples/bytes-example';

export const EXAMPLES = [
  BytesExample,
  CountExample,
  PercentExample,
  RateExample,
];

@NgModule({
  imports: [
    CommonModule,
    DtInputModule,
    FormsModule,
    UiModule,
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
export class DocsFormattersModule {
}
