import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DtInlineEditor } from './inline-editor.component';
import {
  DtLoadingDistractorModule,
  DtButtonModule,
  DtInputModule,
} from '../';

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
