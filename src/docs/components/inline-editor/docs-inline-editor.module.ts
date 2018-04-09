import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { InlineEditorModule } from '../../../lib/inline-editor/inline-editor-module';
import { DocsInlineEditorComponent } from './docs-inline-editor.component'

@NgModule({
  imports: [
    UiModule,
    InlineEditorModule
  ],
  declarations: [
    DocsInlineEditorComponent
  ],
  exports: [
    DocsInlineEditorComponent,
  ]
})
export class DocsInlineEditorModule {
}
