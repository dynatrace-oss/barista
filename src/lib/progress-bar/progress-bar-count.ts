import { Directive } from '@angular/core';

/** Counter text wrapper for dt-progress-bar */
@Directive({
  selector: `dt-progress-bar-count`,
  host: {
    class: 'dt-progress-bar-count',
  },
  exportAs: 'dtProgressBarCount',
})
export class DtProgressBarCount {}
