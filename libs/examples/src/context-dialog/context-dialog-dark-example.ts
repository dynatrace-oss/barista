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

// tslint:disable:max-line-length
import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <div class="dark" dtTheme=":dark">
      <dt-context-dialog
        aria-label="Show more actions"
        aria-label-close-button="Close context dialog"
      >
        <button dt-button variant="secondary">Edit</button>
      </dt-context-dialog>
      <button
        dt-icon-button
        [dtContextDialogTrigger]="darkIcondialog"
        variant="secondary"
        aria-label="Open context dialog"
      >
        <dt-icon name="agent"></dt-icon>
      </button>
      <dt-context-dialog
        #darkIcondialog
        aria-label="Open context dialog"
        aria-label-close-button="Close context dialog"
      >
        <p>
          Your dashboard "real user monitoring"
          <br />
          is only visible to you
        </p>
      </dt-context-dialog>
    </div>
  `,
  styles: ['.dt-context-dialog + .dt-button { margin-left: 8px; }'],
})
export class ContextDialogDarkExample {}
// tslint:enable:max-line-length
