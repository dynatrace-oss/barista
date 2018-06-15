import { NgModule } from '@angular/core';
import { DtInputModule } from '../input/input-module';
import { DtButtonModule } from '../button/button-module';
import { DtIconModule } from '../icon/icon-module';
import { CommonModule } from '@angular/common';
import {
  DtCopyClipboard,
  DtCopyClipboardButton,
  DtCopyClipboardSource,
  DtCopyClipboardLabel,
} from './copy-clipboard';

@NgModule({
  imports: [CommonModule,
            DtInputModule,
            DtButtonModule,
            DtIconModule],
  exports: [
    DtCopyClipboard,
    DtCopyClipboardButton,
    DtCopyClipboardSource,
    DtCopyClipboardLabel,
  ],
  declarations: [
    DtCopyClipboard,
    DtCopyClipboardButton,
    DtCopyClipboardSource,
    DtCopyClipboardLabel,
  ],
})
export class DtCopyClipboardModule { }
