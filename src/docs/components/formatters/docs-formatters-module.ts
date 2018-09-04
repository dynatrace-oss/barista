import { NgModule } from '@angular/core';
import { COMPONENT_EXAMPLES, UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { CountExample } from './examples/count-example';
import { DtFormattersModule, DtInputModule, DtFormFieldModule } from '@dynatrace/angular-components';
import { FormsModule } from '@angular/forms';
import { PercentExample } from './examples/percent-example';
import { RateExample } from './examples/rate-example';
import { BytesExample } from './examples/bytes-example';
import { BitsExample } from './examples/bits-example';

export const EXAMPLES = [
  BytesExample,
  CountExample,
  PercentExample,
  RateExample,
  BitsExample,
];

@NgModule({
  imports: [
    CommonModule,
    DtInputModule,
    FormsModule,
    UiModule,
    DtFormattersModule,
    DtFormFieldModule,
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
