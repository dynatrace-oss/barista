import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DtButtonModule } from '@dynatrace/angular-components/button';
import {
  DtError,
  DtFormFieldModule,
} from '@dynatrace/angular-components/form-field';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtInputModule } from '@dynatrace/angular-components/input';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';

import { DtInlineEditor } from './inline-editor';

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
  exports: [DtInlineEditor, DtError],
  declarations: [DtInlineEditor],
})
export class DtInlineEditorModule {}
