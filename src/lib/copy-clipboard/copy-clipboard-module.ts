import { NgModule } from '@angular/core';
import { DtInputModule } from '../input/input-module';
import { DtButtonModule } from '../button/button-module';
import { DtIconModule } from '../icon/icon-module';
import { CommonModule } from '@angular/common';
import {
  DtCopyClipboard,
} from './copy-clipboard';
import {
  DtCopyClipboardLabel,
} from './copy-clipboard-label';

@NgModule({
  imports: [CommonModule,
            DtInputModule,
            DtButtonModule,
            DtIconModule],
  exports: [
    DtCopyClipboard,
    DtCopyClipboardLabel,
  ],
  declarations: [
    DtCopyClipboard,
    DtCopyClipboardLabel,
  ],
})
export class DtCopyClipboardModule { }
