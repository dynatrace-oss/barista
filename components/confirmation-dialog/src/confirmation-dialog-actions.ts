import { Directive } from '@angular/core';

@Directive({
  selector: 'dt-confirmation-dialog-actions',
  host: {
    class: 'dt-confirmation-dialog-actions',
  },
  exportAs: 'dtConfirmationDialogActions',
})
export class DtConfirmationDialogActions {}
