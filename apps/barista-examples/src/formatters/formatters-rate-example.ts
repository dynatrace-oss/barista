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

import { DtRateUnit } from '@dynatrace/barista-components/formatters';

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-form-field>
      <dt-label>Value to be transformed</dt-label>
      <input dtInput [(ngModel)]="exampleValue" />
    </dt-form-field>
    <p>per request: {{ exampleValue | dtRate: 'request' }}</p>
    <p>per second: {{ exampleValue | dtCount | dtRate: 's' }}</p>
    <p>Chaining rate + bytes: {{ exampleValue | dtRate: 's' | dtBytes }}</p>
    <p>Chaining bytes + rate: {{ exampleValue | dtBytes | dtRate: 's' }}</p>
  `,
})
export class FormattersRateExample {
  exampleValue: number;
  rate = DtRateUnit.PER_MILLISECOND;
}
