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
    <dt-key-value-list>
      <dt-key-value-list-item *ngFor="let entry of entries">
        <dt-key-value-list-key>{{ entry.key }}</dt-key-value-list-key>
        <dt-key-value-list-value>{{ entry.value }}</dt-key-value-list-value>
      </dt-key-value-list-item>
    </dt-key-value-list>
  `,
})
export class KeyValueListDefaultExample {
  entries: Array<{ key: string; value: string }> = [
    { key: 'Temp', value: '28C' },
    { key: 'Temp1', value: '27C' },
    { key: 'Temp2', value: '24C' },
    { key: 'Temp3', value: '29C' },
    { key: 'Temp4', value: '22C' },
    { key: 'Temp5', value: '21C' },
    { key: 'Temp6', value: '25C' },
    { key: 'Temp7', value: '29C' },
  ];
}
