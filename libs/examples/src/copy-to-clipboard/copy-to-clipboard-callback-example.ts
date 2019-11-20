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

import { ChangeDetectorRef, Component } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-copy-to-clipboard (copied)="copyCallback()">
      <input
        dtInput
        [value]="_value"
        aria-label="Text that is copied to clipboard"
      />
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>
    <br />
    <div>
      {{ _copyHint }}
    </div>
  `,
})
export class CopyToClipboardCallbackExample {
  _value = 'https://barista.dynatrace.com/';
  _copyHint = 'Will change after copy.';

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  copyCallback(): void {
    this._copyHint = `Copied "${this._value}" to clipboard.`;
    // tslint:disable-next-line:no-magic-numbers
    timer(2500).subscribe((): void => {
      this._copyHint = 'Will change after copy.';
      this._changeDetectorRef.markForCheck();
    });
  }
}
