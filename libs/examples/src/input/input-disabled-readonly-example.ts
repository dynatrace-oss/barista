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
    <input
      dtInput
      placeholder="Please insert text"
      [disabled]="isDisabled"
      aria-label="Please insert text"
    />
    <p>
      <button dt-button (click)="isDisabled = !isDisabled">
        Toggle disabled
      </button>
    </p>

    <input
      dtInput
      placeholder="Please insert text"
      [readonly]="isReadonly"
      aria-label="Please insert text"
    />
    <p>
      <button dt-button (click)="isReadonly = !isReadonly">
        Toggle readonly
      </button>
    </p>
  `,
})
export class InputDisabledReadonlyExample {
  isDisabled = false;
  isReadonly = false;
}
