import { NgModule } from '@angular/core';
import { DtInputModule } from '../input/input-module';
import { DtButtonModule } from '../button/button-module';
import { DtIconModule } from '../icon/icon-module';
import { CommonModule } from '@angular/common';
import {
  DtCopyToClipboard,
} from './copy-to-clipboard';
import {
  DtCopyToClipboardLabel,
} from './copy-to-clipboard-label';

@NgModule({
  imports: [CommonModule,
            DtInputModule,
            DtButtonModule,
            DtIconModule],
  exports: [
    DtCopyToClipboard,
    DtCopyToClipboardLabel,
  ],
  declarations: [
    DtCopyToClipboard,
    DtCopyToClipboardLabel,
  ],
})
export class DtCopyToClipboardModule { }
