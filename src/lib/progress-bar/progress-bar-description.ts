import { Directive } from '@angular/core';

/** Description text wrapper for dt-progress-bar */
@Directive({
  selector: `dt-progress-bar-description`,
  host: {
    class: 'dt-progress-bar-description',
  },
  exportAs: 'dtProgressBarDescription',
})
export class DtProgressBarDescription { }
