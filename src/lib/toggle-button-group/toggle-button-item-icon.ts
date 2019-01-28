import { Directive } from '@angular/core';

/** Icon wrapper for the DtToggleButtonItemIcon */
@Directive({
  selector: `dt-toggle-button-item-icon`,
  host: {
    class: 'dt-toggle-button-item-icon',
  },
  exportAs: 'dtToggleButtonItemIcon',
})
export class DtToggleButtonItemIcon { }
