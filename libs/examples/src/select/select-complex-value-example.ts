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
    <p>
      Selected Value label:
      <i>{{ selectedValue?.viewValue || 'No value selected' }}</i>
    </p>
    <dt-select
      placeholder="Choose your coffee"
      [(ngModel)]="selectedValue"
      aria-label="Choose your coffee"
    >
      <dt-option *ngFor="let coffee of coffees" [value]="coffee">
        {{ coffee.viewValue }}
      </dt-option>
    </dt-select>
  `,
})
export class SelectComplexValueExample {
  selectedValue: { value: string; viewValue: string };
  coffees = [
    { value: 'ThePerfectPour', viewValue: 'ThePerfectPour' },
    { value: 'Affogato', viewValue: 'Affogato' },
    { value: 'Americano', viewValue: 'Americano' },
  ];
}
