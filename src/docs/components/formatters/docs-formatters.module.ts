import { NgModule } from '@angular/core';
import { COMPONENT_EXAMPLES, UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { CountPipeExample } from './examples/count-pipe-example';
import { FormattersModule } from '@dynatrace/angular-components/formatters/formatters.module';
import { DtInputModule } from '@dynatrace/angular-components';
import { FormsModule } from '@angular/forms';
import { PercentPipeExample } from './examples/percent-pipe-example';

export const EXAMPLES = [
  CountPipeExample,
  PercentPipeExample,
];

@NgModule({
  imports: [
    CommonModule,
    DtInputModule,
    FormsModule,
    UiModule,
    FormattersModule,
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
