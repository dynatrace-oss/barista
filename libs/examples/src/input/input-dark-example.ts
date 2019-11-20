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
    <section class="dark" dtTheme=":dark">
      <p>
        <input
          type="text"
          dtInput
          #input
          placeholder="Please insert text"
          value="Text"
          aria-label="Please insert text"
        />
        <!-- prettier-ignore -->
        <textarea
          dtInput
          #textarea
          placeholder="Please insert text"
          aria-label="Please insert text"
        >Text</textarea>
      </p>
      <button
        dt-button
        (click)="
          input.disabled = !input.disabled;
          textarea.disabled = !textarea.disabled
        "
      >
        Toggle disabled
      </button>
    </section>
  `,
  styles: ['textarea { margin-top: 8px; }'],
})
export class InputDarkExample {}
