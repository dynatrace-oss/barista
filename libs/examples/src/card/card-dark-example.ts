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
    <div class="demo-card dark" dtTheme=":dark">
      <dt-card>
        <dt-card-icon>
          <dt-icon name="application"></dt-icon>
        </dt-card-icon>
        <dt-card-title>Top 3 JavaScript errors</dt-card-title>
        <dt-card-subtitle>Some subtitle</dt-card-subtitle>
        <dt-card-title-actions>
          <button dt-button variant="secondary">Some Action</button>
        </dt-card-title-actions>
        The card is not an interactive element, therefore there are no hover,
        active or disabled states.
      </dt-card>
    </div>
  `,
})
export class CardDarkExample {}
