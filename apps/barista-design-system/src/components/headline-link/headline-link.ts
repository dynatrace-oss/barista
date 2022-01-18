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

import { Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { DtToastRef, DtToast } from '@dynatrace/barista-components/toast';

@Component({
  selector: 'ba-headline-link',
  templateUrl: 'headline-link.html',
  host: {
    'aria-hidden': 'true',
  },
})
export class BaHeadlineLink {
  @Input() id: string;

  toastRef: DtToastRef | null = null;

  constructor(private _toast: DtToast, private _clipboard: Clipboard) {}

  /** copy the headline to the clipboard */
  _copyHeadline(): void {
    if (window) {
      const link = `${window.location.origin}${window.location.pathname}#${this.id}`;

      const copySucceeded = this._clipboard.copy(link);

      if (copySucceeded) {
        this._createToast();
      }
    }
  }

  /**
   * Creates toast after successfully copying the link to the clipboard
   */
  private _createToast(): void {
    this.toastRef = this._toast.create('Copied to clipboard');
  }
}
