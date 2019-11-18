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

@Component({
  selector: 'component-barista-example',
  template: `
    <div>
      <button
        *ngIf="customTrigger"
        dt-icon-button
        [dtContextDialogTrigger]="interactiveDialog"
        [disabled]="interactiveDialogDisabled"
        variant="secondary"
        aria-label="Open context dialog"
      >
        <dt-icon name="agent"></dt-icon>
      </button>
      <dt-context-dialog
        #interactiveDialog
        [disabled]="interactiveDialogDisabled"
        aria-label="Show more details"
        aria-label-close-button="Close context dialog"
      >
        <p>
          Your dashboard "real user monitoring"
          <br />
          is only visible to you
        </p>
      </dt-context-dialog>
    </div>
    <button dt-button (click)="interactiveDialog.open()">Open</button>
    <button dt-button (click)="interactiveDialog.close()">Close</button>
    <button
      dt-button
      (click)="interactiveDialogDisabled = !interactiveDialogDisabled"
    >
      Disabled / Enable
    </button>
    <button dt-button (click)="customTrigger = !customTrigger">
      Toggle custom trigger
    </button>
  `,
})
export class ContextDialogInteractiveExample {
  interactiveDialogDisabled = false;
  customTrigger = false;
}
