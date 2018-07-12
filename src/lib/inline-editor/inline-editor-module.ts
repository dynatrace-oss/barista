import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtInlineEditor } from './inline-editor';
import { DtInputModule } from '@dynatrace/angular-components/input';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';
import { DtFormFieldModule } from '@dynatrace/angular-components/form-field';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { FormsModule } from '@angular/forms';
import { IeError } from './error';

@NgModule({
  imports: [
    CommonModule,
    DtLoadingDistractorModule,
    DtButtonModule,
    DtInputModule,
    DtFormFieldModule,
    DtIconModule,
    FormsModule,
  ],
  exports: [
    DtInlineEditor,
    IeError,
  ],
  declarations: [
    DtInlineEditor,
    IeError,
  ],
})
export class DtInlineEditorModule {}
