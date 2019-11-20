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
  selector: 'error-consumption-example',
  template: `
    <dt-consumption [max]="max" [value]="value" color="error">
      <dt-consumption-icon aria-label="Log file">
        <dt-icon name="logfile"></dt-icon>
      </dt-consumption-icon>
      <dt-consumption-title>
        Log analytics
      </dt-consumption-title>

      <dt-consumption-count>
        {{ value | dtMegabytes }}/{{ max | dtMegabytes }}
      </dt-consumption-count>

      <dt-consumption-label>
        Restricted overages
      </dt-consumption-label>

      <dt-consumption-overlay>
        <dt-consumption [max]="max" [value]="value" color="error">
          <dt-consumption-title>
            Log analytics
          </dt-consumption-title>
          <dt-consumption-subtitle>
            Quota
          </dt-consumption-subtitle>
          <dt-consumption-count>
            {{ value | dtMegabytes }}/{{ max | dtMegabytes }}
          </dt-consumption-count>
        </dt-consumption>
      </dt-consumption-overlay>
    </dt-consumption>
  `,
})
export class ConsumptionErrorExample {
  max = 8000000000;
  value = 8000000000;
}
