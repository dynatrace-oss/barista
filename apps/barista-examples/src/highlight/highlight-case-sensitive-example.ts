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
  styles: ['input { margin-bottom: 20px; }'],
  template: `
    <input
      type="text"
      dtInput
      value="Dy"
      #search
      aria-label="Insert the text that should be highlighted in the example below."
    />
    <dt-highlight [term]="search.value" caseSensitive>
      Dynatrace system Monitoring
    </dt-highlight>
  `,
})
export class HighlightCaseSensitiveExample {}
