import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { DtInlineEditor } from './inline-editor.component';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtInputModule } from '@dynatrace/angular-components/input';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DtLoadingDistractorModule,
    DtButtonModule,
    DtInputModule
  ],
  exports: [
    DtInlineEditor,
  ],
  declarations: [
    DtInlineEditor,
  ],
})
export class InlineEditorModule {}
