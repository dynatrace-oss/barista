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
  selector: 'barista-demo',
  template: `
    <button dt-button (click)="_fakeError()" variant="secondary">
      Fake error
    </button>
    <dt-copy-to-clipboard
      (copyFailed)="_handleError()"
      (copied)="_resetErrorState()"
    >
      <input
        dtInput
        value="https://barista.dynatrace.com/"
        aria-label="The value of this input field will be copied to clipboard."
      />
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>
    <dt-alert severity="error" *ngIf="_copyFailed">
      It was not possible to copy the text to the clipboard.
    </dt-alert>
  `,
  styles: ['dt-alert { margin-top: 16px; } button { margin-bottom: 16px; }'],
})
export class CopyToClipboardErrorExample {
  _copyFailed = false;

  _fakeError(): void {
    this._copyFailed = true;
  }

  _handleError(): void {
    /* noop */
  }

  _resetErrorState(): void {
    this._copyFailed = false;
  }
}
