import { Directive } from '@angular/core';

@Directive({
  selector: `dt-context-dialog-header-title, [dt-context-dialog-header-title], [dtContextDialogHeaderTitle]`,
  exportAs: 'dtContextDialogHeaderTitle',
  host: {
    class: 'dt-context-dialog-header-title',
    role: 'heading',
  },
})
export class DtContextDialogHeaderTitle {}
