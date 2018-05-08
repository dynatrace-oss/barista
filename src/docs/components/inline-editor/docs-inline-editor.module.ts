import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiModule } from '../../ui/ui.module';
import { DtInlineEditorModule } from '@dynatrace/angular-components';
import { DocsInlineEditorComponent } from './docs-inline-editor.component';
import { DefaultInlineEditorExample } from './examples/inline-editor-default-example';
import { ApiInlineEditorExample } from './examples/inline-editor-api-example';
import { SuccessfulInlineEditorExample } from './examples/inline-editor-successful-example';
import { FailingInlineEditorExample } from './examples/inline-editor-failing-example';

const EXAMPLES = [
  DefaultInlineEditorExample,
  ApiInlineEditorExample,
  SuccessfulInlineEditorExample,
  FailingInlineEditorExample,
];

@NgModule({
  imports: [
    FormsModule,
    DtInlineEditorModule,
    UiModule,
    DtInlineEditorModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsInlineEditorComponent,
  ],
  exports: [
    DocsInlineEditorComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsInlineEditorModule {
}
