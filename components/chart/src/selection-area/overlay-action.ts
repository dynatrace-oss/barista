import { Directive } from '@angular/core';

/** Directive to select the Overlay action for the range and the timestamp component */
@Directive({
  selector: '[dtChartSelectionAreaAction]',
  exportAs: 'dtChartSelectionAreaAction',
  host: {
    class: 'dt-chart-selection-area-action',
  },
})
export class DtChartSelectionAreaAction {}
