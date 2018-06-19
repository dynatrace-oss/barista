import { NgModule } from '@angular/core';
import { DtInputModule } from '../input/input-module';
import { DtButtonModule } from '../button/button-module';
import { DtIconModule } from '../icon/icon-module';
import { CommonModule } from '@angular/common';
import {
  DtCopyClipboard,
} from './copy-clipboard';
import {
  DtCopyClipboardButton,
} from './copy-clipboard-btn';
import {
  DtCopyClipboardSource,
} from './copy-clipboard-source';
import {
  DtCopyClipboardLabel,
} from './copy-clipboard-label';
import {
  DtCopyClipboardSuccess,
} from './copy-clipboard-success';

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
    DtCopyClipboardSuccess,
  ],
  declarations: [
    DtCopyClipboard,
    DtCopyClipboardButton,
    DtCopyClipboardSource,
    DtCopyClipboardLabel,
    DtCopyClipboardSuccess,
  ],
})
export class DtCopyClipboardModule { }
