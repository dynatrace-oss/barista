import { Directive } from '@angular/core';

/** Action area in the overlay, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-selection-area-actions, [dt-selection-area-actions], [dtSelectionAreaActions]`,
  host: {
    class: 'dt-selection-area-actions',
  },
  exportAs: 'dtSelectionAreaActions',
})
export class DtSelectionAreaActions { }
