import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtInlineEditor } from './inline-editor';
import { DtInputModule } from '../input/input-module';
import { DtButtonModule } from '../button/button-module';
import { DtLoadingDistractorModule } from '../loading-distractor/index';
import { DtFormFieldModule } from '../form-field/index';
import { DtIconModule } from '../icon/index';

@NgModule({
  imports: [
    CommonModule,
    DtLoadingDistractorModule,
    DtButtonModule,
    DtInputModule,
    DtFormFieldModule,
    DtIconModule,
  ],
  exports: [
    DtInlineEditor,
  ],
  declarations: [
    DtInlineEditor,
  ],
})
export class DtInlineEditorModule {}
