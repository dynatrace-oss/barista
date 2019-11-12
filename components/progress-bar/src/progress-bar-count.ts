import { Directive } from '@angular/core';

/** Counter text wrapper for dt-progress-bar */
@Directive({
  selector: `dt-progress-bar-count`,
  exportAs: 'dtProgressBarCount',
  host: {
    class: 'dt-progress-bar-count',
  },
})
export class DtProgressBarCount {}
