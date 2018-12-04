import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { DtSelectionAreaChange } from '@dynatrace/angular-components';

@Component({
  template: `
  <div class="origin" [dtSelectionArea]="area"></div>
  <dt-selection-area #area="dtSelectionArea" (changed)="handleChange($event)">
    {{dynamic}} static
    <dt-selection-area-actions>
      <button dt-button>Zoom in</button>
    </dt-selection-area-actions>
  </dt-selection-area>
  `,
  styles: [
    '.origin { width: 100%; height: 400px; border: 1px solid #e6e6e6; }',
  ],
})
@OriginalClassName('SelectionAreaDefaultExample')
export class SelectionAreaDefaultExample {
  dynamic = '';
  handleChange(ev: DtSelectionAreaChange): void {
    this.dynamic = `${ev.left}, ${ev.right} yeah so dynamic - ${ev.widthPx}`;
  }
}
