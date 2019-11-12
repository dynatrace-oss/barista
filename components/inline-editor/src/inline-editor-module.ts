import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/barista-components/button';
import {
  DtError,
  DtFormFieldModule,
} from '@dynatrace/barista-components/form-field';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';

import { DtInlineEditor } from './inline-editor';

@NgModule({
  imports: [
    CommonModule,
    DtLoadingDistractorModule,
    DtButtonModule,
    DtInputModule,
    DtFormFieldModule,
    DtIconModule,
  ],
  exports: [DtInlineEditor, DtError],
  declarations: [DtInlineEditor],
})
export class DtInlineEditorModule {}
