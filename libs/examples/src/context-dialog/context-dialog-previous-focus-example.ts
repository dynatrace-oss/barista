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

import { Component, ViewChild } from '@angular/core';

import { DtButton } from '@dynatrace/barista-components/button';
import { DtContextDialog } from '@dynatrace/barista-components/context-dialog';

@Component({
  selector: 'component-barista-example',
  template: `
    <button dt-button variant="secondary" (click)="open()" #focusme>
      Open
    </button>
    <dt-context-dialog
      #contextdialog
      color="cta"
      aria-label="Show more details"
      aria-label-close-button="Close context dialog"
    >
      <p>Close me to return the focus to the "Open" button</p>
      <button dt-button variant="secondary">Focused</button>
    </dt-context-dialog>
  `,
  styles: ['.dt-button + .dt-context-dialog { margin-left: 8px; }'],
})
export class ContextDialogPreviousFocusExample {
  @ViewChild('focusme', { static: true }) focusMe: DtButton;
  @ViewChild('contextdialog', { static: true }) contextdialog: DtContextDialog;

  open(): void {
    this.contextdialog.open();
  }
}
