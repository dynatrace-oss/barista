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
    <div class="dark" dtTheme=":dark">
      <dt-progress-bar [value]="value">
        <dt-progress-bar-description>
          We found more than 100 results. This may take a while, consider
          narrowing your search.
        </dt-progress-bar-description>
        <dt-progress-bar-count>{{ value }}% loaded</dt-progress-bar-count>
      </dt-progress-bar>
    </div>
  `,
})
export class ProgressBarDarkExample {
  value = 67;
}
