import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { DtInlineEditor } from './inline-editor.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    DtInlineEditor,
  ],
  declarations: [
    DtInlineEditor,
  ],
})
export class InlineEditorModule {}
