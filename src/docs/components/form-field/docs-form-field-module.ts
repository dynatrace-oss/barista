import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DtInputModule, DtFormFieldModule, DtButtonModule, DtIconModule, DtLoadingDistractorModule } from '@dynatrace/angular-components';
import { DefaultFormFieldExample } from './examples/form-field-default-example';
import { HintFormFieldExample } from './examples/form-field-hint-example';
import { ErrorFormFieldExample } from './examples/form-field-error-example';
import { PrefixSuffixFormFieldExample } from './examples/form-field-prefix-suffix-example';

export const EXAMPLES = [
  DefaultFormFieldExample,
  HintFormFieldExample,
  ErrorFormFieldExample,
  PrefixSuffixFormFieldExample,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    DtInputModule,
    DtIconModule,
    DtFormFieldModule,
    DtButtonModule,
    DtLoadingDistractorModule,
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
export class DocsFormFieldModule {
}
