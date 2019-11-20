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
  selector: 'default-consumption-example',
  template: `
    <dt-consumption [max]="max" [value]="value">
      <dt-consumption-icon aria-label="Host">
        <dt-icon name="host"></dt-icon>
      </dt-consumption-icon>
      <dt-consumption-title>
        Host units
      </dt-consumption-title>

      <dt-consumption-count>
        {{ value | dtCount }}/{{ max | dtCount }}
      </dt-consumption-count>

      <dt-consumption-label>
        Restricted host unit hours
      </dt-consumption-label>

      <dt-consumption-overlay>
        <dt-consumption [max]="max" [value]="value" class="overlay-value-panel">
          <dt-consumption-title>
            Host units
          </dt-consumption-title>
          <dt-consumption-subtitle>
            Quota
          </dt-consumption-subtitle>
          <dt-consumption-count>
            {{ value | dtCount }}/{{ max | dtCount }}
          </dt-consumption-count>
        </dt-consumption>

        <div class="overlay-value-panel">
          <div>Consumption breakdown</div>

          <dt-key-value-list>
            <dt-key-value-list-item *ngFor="let entry of breakdown">
              <dt-key-value-list-key>{{ entry.name }}</dt-key-value-list-key>
              <dt-key-value-list-value>
                {{ entry.value | dtCount }}
              </dt-key-value-list-value>
            </dt-key-value-list-item>
          </dt-key-value-list>
        </div>

        <dt-consumption [max]="5" [value]="0" class="overlay-value-panel">
          <dt-consumption-subtitle>
            Free credits (Exp. 20. Mar 2019)
          </dt-consumption-subtitle>
          <dt-consumption-count>
            {{ 0 | dtCount }}/{{ 5 | dtCount }}
          </dt-consumption-count>
        </dt-consumption>
      </dt-consumption-overlay>
    </dt-consumption>
  `,
})
export class ConsumptionDefaultExample {
  max = 20;
  value = 5;
  breakdown = [
    { name: 'Cloud infrastructure', value: 2 },
    { name: 'Full stack', value: 2 },
    { name: 'Cloud app platform', value: 1 },
  ];
}
