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

import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <button dt-button (click)="resetExample()">Start example</button>

    <dt-confirmation-dialog
      [state]="dialogState"
      [showBackdrop]="showBackdrop"
      aria-label="Dialog for changes that need to be confirmed or rejected"
    >
      <dt-confirmation-dialog-state name="cancel">
        <dt-confirmation-dialog-actions>
          <button dt-button (click)="cancel()">Cancel</button>
        </dt-confirmation-dialog-actions>
      </dt-confirmation-dialog-state>
      <dt-confirmation-dialog-state name="backdrop">
        Showing backdrop for 3 seconds... only then can you leave.
      </dt-confirmation-dialog-state>
    </dt-confirmation-dialog>
  `,
})
export class ConfirmationDialogShowBackdropExample {
  dialogState: string | null;
  showBackdrop: boolean;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  cancel(): void {
    this.dialogState = 'backdrop';
    setTimeout(() => {
      this.showBackdrop = false;
      this.dialogState = null;
      this._changeDetectorRef.markForCheck();
    }, 3000);
  }

  resetExample(): void {
    this.dialogState = 'cancel';
    this.showBackdrop = true;
  }
}
