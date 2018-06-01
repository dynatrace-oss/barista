import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DtInputModule, DtFormFieldModule, DtButtonModule, DtIconModule } from '@dynatrace/angular-components';
import { DocsFormField } from './docs-form-field';
import { DefaultFormFieldExample } from './examples/form-field-default-example';
import { HintFormFieldExample } from './examples/form-field-hint-example';
import { ErrorFormFieldExample } from './examples/form-field-error-example';
import { PrefixSuffixFormFieldExample } from './examples/form-field-prefix-suffix-example';

const EXAMPLES = [
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
  ],
  declarations: [
    ...EXAMPLES,
    DocsFormField,
  ],
  exports: [
    DocsFormField,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsFormFieldModule {
}
