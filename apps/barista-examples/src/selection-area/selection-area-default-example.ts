/**
 * @license
 * Copyright 2019 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';

import { DtSelectionAreaChange } from '@dynatrace/barista-components/selection-area';

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
