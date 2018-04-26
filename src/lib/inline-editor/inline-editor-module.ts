import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DtInlineEditor } from './inline-editor.component';
import { DtInputModule } from '../input/input-module'
import { DtButtonModule } from '../button/button-module'
import { DtLoadingDistractorModule } from '../loading-distractor/loading-distractor-module'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DtLoadingDistractorModule,
    DtButtonModule,
    DtInputModule,
  ],
  exports: [
    DtInlineEditor,
  ],
  declarations: [
    DtInlineEditor,
  ],
})
export class DtInlineEditorModule {}
