import { NgModule } from '@angular/core';
import { DtInputModule } from '../input/input-module';
import { DtButtonModule } from '../button/button-module';
import { CommonModule } from '@angular/common';
import {
  DtCopyClipboard,
  DtCopyClipboardButton,
  DtCopyClipboardSpan
} from './copy-clipboard';

@NgModule({
  imports: [CommonModule,
            DtInputModule,
            DtButtonModule],
  exports: [
    DtCopyClipboard,
    DtCopyClipboardButton,
    DtCopyClipboardSpan,
  ],
  declarations: [
    DtCopyClipboard,
    DtCopyClipboardButton,
    DtCopyClipboardSpan
  ],
})
export class DtCopyClipboardModule { }
