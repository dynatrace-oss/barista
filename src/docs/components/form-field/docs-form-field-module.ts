import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DtInputModule, DtThemingModule, DtFormFieldModule } from '@dynatrace/angular-components';
import { DocsFormField } from './docs-form-field';
import { DefaultFormFieldExample } from './examples/form-field-default-example';
import { HintFormFieldExample } from './examples/form-field-hint-example';
import { ErrorFormFieldExample } from './examples/form-field-error-example';

const EXAMPLES = [
  DefaultFormFieldExample,
  HintFormFieldExample,
  ErrorFormFieldExample,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    DtInputModule,
    DtFormFieldModule,
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
