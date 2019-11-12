import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIconModule } from '@dynatrace/barista-components/icon';

import { DtCopyToClipboard } from './copy-to-clipboard';
import { DtCopyToClipboardLabel } from './copy-to-clipboard-label';

@NgModule({
  imports: [CommonModule, DtButtonModule, DtIconModule],
  exports: [DtCopyToClipboard, DtCopyToClipboardLabel],
  declarations: [DtCopyToClipboard, DtCopyToClipboardLabel],
})
export class DtCopyToClipboardModule {}
