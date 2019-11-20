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
    <dt-bar-indicator
      [value]="value"
      [min]="min"
      [max]="max"
      (valueChange)="changed($event)"
    ></dt-bar-indicator>
    <div style="margin-top: 16px;">
      <button dt-button (click)="value = value - 10">
        decrease value by 10
      </button>
      <button dt-button (click)="value = value + 10">
        increase value by 10
      </button>
    </div>
    <div style="margin-top: 16px;">
      <button dt-button (click)="min = min - 10">decrease min by 10</button>
      <button dt-button (click)="min = min + 10">increase min by 10</button>
    </div>
    <div style="margin-top: 16px;">
      <button dt-button (click)="max = max - 10">decrease max by 10</button>
      <button dt-button (click)="max = max + 10">increase max by 10</button>
    </div>
    <p>
      Current value: {{ value }}
      <br />
      Current min: {{ min }}
      <br />
      Current max: {{ max }}
      <br />
    </p>
    <p *ngIf="oldValue !== null">
      Event: OldValue: {{ oldValue }}
      <br />
      NewValue: {{ newValue }}
    </p>
  `,
})
export class BarIndicatorDynamicExample {
  min = 0;
  max = 100;
  value = 50;

  oldValue: number | null = null;
  newValue: number | null = null;

  changed($event: { oldValue: number; newValue: number }): void {
    this.oldValue = $event.oldValue;
    this.newValue = $event.newValue;
  }
}
