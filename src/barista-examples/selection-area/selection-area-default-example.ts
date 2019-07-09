import { Component } from '@angular/core';
import { DtSelectionAreaChange } from '@dynatrace/angular-components';

@Component({
  selector: 'barista-demo',
  template: `
    <div class="origin" [dtSelectionArea]="area"></div>
    <dt-selection-area
      #area="dtSelectionArea"
      (changed)="handleChange($event)"
      aria-label-selected-area="Text that describes the content of the selection area."
      aria-label-left-handle="Resize selection area to the left."
      aria-label-right-handle="Resize selection area to the right."
      aria-label-close-button="Close the selection area."
    >
      {{ overlayContent }}
      <dt-selection-area-actions>
        <button dt-button>Zoom in</button>
      </dt-selection-area-actions>
    </dt-selection-area>
  `,
  styles: [
    '.origin { width: 100%; height: 400px; border: 1px solid #e6e6e6; }',
  ],
})
export class SelectionAreaDefaultExample {
  overlayContent = '';
  // tslint:disable-next-line: deprecation
  handleChange(ev: DtSelectionAreaChange): void {
    this.overlayContent = `Left: ${ev.left}, Right: ${ev.right}`;
  }
}
