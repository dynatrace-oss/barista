import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { DtInlineEditorModule } from '@dynatrace/angular-components';
import { DefaultInlineEditorExample } from './examples/inline-editor-default-example';
import { ApiInlineEditorExample } from './examples/inline-editor-api-example';
import { SuccessfulInlineEditorExample } from './examples/inline-editor-successful-example';
import { FailingInlineEditorExample } from './examples/inline-editor-failing-example';
import { RequiredInlineEditorExample } from './examples/inline-editor-required-example';

export const EXAMPLES = [
  DefaultInlineEditorExample,
  ApiInlineEditorExample,
  RequiredInlineEditorExample,
  SuccessfulInlineEditorExample,
  FailingInlineEditorExample,
];

@NgModule({
  imports: [
    FormsModule,
    DtInlineEditorModule,
    UiModule,
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
export class DocsInlineEditorModule {
}
