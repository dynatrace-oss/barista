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
    <dt-select
      placeholder="Choose your coffee"
      [disabled]="disabled"
      aria-label="Choose your coffee"
    >
      <dt-option value="ThePerfectPour">ThePerfectPour</dt-option>
      <dt-option disabled value="Affogato">Affogato</dt-option>
      <dt-option value="Americano">Americano</dt-option>
    </dt-select>
    <p>
      <dt-checkbox checked (change)="disabled = !disabled">
        Disabled
      </dt-checkbox>
    </p>
  `,
})
export class SelectDisabledExample {
  disabled = true;
}
