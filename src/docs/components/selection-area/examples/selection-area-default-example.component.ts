import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { DtSelectionAreaChange } from '@dynatrace/angular-components';

@Component({
  template: `
  <div class="origin" [dtSelectionArea]="area"></div>
  <dt-selection-area #area="dtSelectionArea" (changed)="handleChange($event)">
    {{overlayContent}}
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
  overlayContent = '';
  handleChange(ev: DtSelectionAreaChange): void {
    this.overlayContent = `Left: ${ev.left}, Right: ${ev.right}`;
  }
}
