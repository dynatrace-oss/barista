import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiModule } from '../../ui/ui.module';
import { InlineEditorModule } from '@dynatrace/angular-components/inline-editor';
import { DocsInlineEditorComponent } from './docs-inline-editor.component'
import { DefaultInlineEditorExample } from './examples/inline-editor-default-example';
import { ApiInlineEditorExample } from './examples/inline-editor-api-example';
import { SuccessfulInlineEditorExample } from './examples/inline-editor-successful-example';
import { FailingInlineEditorExample } from './examples/inline-editor-failing-example';

const EXAMPLES = [
  DefaultInlineEditorExample,
  ApiInlineEditorExample,
  SuccessfulInlineEditorExample,
  FailingInlineEditorExample,
]

@NgModule({
  imports: [
    FormsModule,
    InlineEditorModule,
    UiModule,
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
