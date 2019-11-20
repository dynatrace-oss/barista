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
  selector: 'barista-demo',
  template: `
    <dt-progress-bar (valueChange)="changed($event)" [value]="value">
      <dt-progress-bar-description>
        We found more than 100 results. This may take a while, consider
        narrowing your search.
      </dt-progress-bar-description>
      <dt-progress-bar-count>
        <strong>
          <span
            [dtIndicator]="metricHasProblem(value)"
            dtIndicatorColor="error"
          >
            {{ value }}
          </span>
          /{{ max }} days
        </strong>
      </dt-progress-bar-count>
    </dt-progress-bar>
    <div>
      <button dt-button (click)="value = value - 10">decrease by 10</button>
      <button dt-button (click)="value = value + 10">increase by 10</button>
    </div>
    <p *ngIf="oldValue !== null">
      Event: OldValue: {{ oldValue }}
      <br />
      NewValue: {{ newValue }}
    </p>
  `,
  styles: ['dt-progress-bar {margin: 8px 0}'],
})
export class ProgressBarWithCountAndDescriptionIndicatorExample {
  oldValue: number | null = null;
  newValue: number | null = null;
  value = 70;
  max = 100;
  limit = 75;

  changed($event: { oldValue: number; newValue: number }): void {
    this.oldValue = $event.oldValue;
    this.newValue = $event.newValue;
  }

  metricHasProblem(value: number): boolean {
    return value > this.limit;
  }
}
