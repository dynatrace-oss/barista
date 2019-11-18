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

import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <button dt-button (click)="resetExample()">Start example</button>
    <dt-confirmation-dialog
      [state]="dialogState"
      aria-label="Dialog for changes that need to be confirmed or rejected"
    >
      <dt-confirmation-dialog-state name="dirty">
        You have pending changes.
        <dt-confirmation-dialog-actions>
          <button dt-button variant="secondary" (click)="clear()">Clear</button>
          <button dt-button (click)="save()">Save</button>
        </dt-confirmation-dialog-actions>
      </dt-confirmation-dialog-state>
      <dt-confirmation-dialog-state name="success">
        Successfully saved!
      </dt-confirmation-dialog-state>
    </dt-confirmation-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogDefaultExample {
  dialogState: string | null;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  save(): void {
    this.dialogState = 'success';

    setTimeout(() => {
      this.clear();
      this._changeDetectorRef.markForCheck();
    }, 2000);
  }

  clear(): void {
    this.dialogState = null;
  }

  resetExample(): void {
    this.dialogState = 'dirty';
  }
}
