/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';

import { DtConfirmationDialog } from '@dynatrace/barista-components/confirmation-dialog';

@Component({
  templateUrl: 'confirmation-dialog-demo.component.html',
  selector: 'confirmation-dialog-dev-app-demo',
  styleUrls: ['confirmation-dialog-demo.component.scss'],
})
export class ConfirmationDialogDemo {
  // the dialog's state input is bound to this field.
  dialogState: string | null = 'dirty';
  // show the blocking overlay forcing user to resolve changes.
  showBackdrop = false;
  // some form value to be associated with the dialog.
  textValue: string | null = null;

  dynamic = false;

  @ViewChild('confirmationDialog', { static: true })
  confirmationDialog: DtConfirmationDialog;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  // handle user input.
  update(event: Event): void {
    if (event.target) {
      this.textValue = (event.target as HTMLInputElement).value;
      if (this.textValue) {
        // this will show the "dirty" dt-confirmation-dialog-state markup.
        this.dialogState = 'dirty';
      }
    }
  }

  // save, set success for 2 seconds.
  save(): void {
    setTimeout(() => {
      this.clear();
      // since parent app is ChangeDetectionStrategy.OnPush, mark for check in this callback.
      this.changeDetectorRef.markForCheck();
    }, 2000);
    // this will show the "success" dt-confirmation-dialog-state markup.
    this.dialogState = 'success';
    this.showBackdrop = false;
  }

  // clear the input and dialog state.
  clear(): void {
    this.textValue = null;
    this.dialogState = null;
    this.showBackdrop = false;
  }

  // show the backdrop and prevent navigation if in "dirty" state.
  preventNavIfDirty(event: Event): void {
    if (this.dialogState === 'dirty') {
      this.showBackdrop = true;
      event.stopPropagation();
      event.preventDefault();
      this.confirmationDialog.focusAttention();
    }
  }

  changeToDynamic(): void {
    this.dynamic = true;
    this.dialogState = 'dynamic';
  }

  toggleDirty(): void {
    this.dialogState = this.dialogState == 'dirty' ? null : 'dirty';
  }
}
