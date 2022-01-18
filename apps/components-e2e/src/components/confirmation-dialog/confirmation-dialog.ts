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

import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'dt-e2e-confirmation-dialog',
  templateUrl: 'confirmation-dialog.html',
})
export class DtE2EConfirmationDialog {
  dialogState: string | null;
  showBackdrop: boolean;

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
