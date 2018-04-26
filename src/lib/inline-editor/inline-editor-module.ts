import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DtInlineEditor } from './inline-editor.component';
import {
  DtLoadingDistractorModule,
  DtButtonModule,
  DtInputModule,
} from '@dynatrace/angular-components';

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
