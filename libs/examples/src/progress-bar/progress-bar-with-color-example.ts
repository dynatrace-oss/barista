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
    <dt-progress-bar [value]="45" [color]="color"></dt-progress-bar>
    <div>
      <dt-button-group [value]="color" (valueChange)="changed($event)">
        <dt-button-group-item value="main">main</dt-button-group-item>
        <dt-button-group-item value="accent">accent</dt-button-group-item>
        <dt-button-group-item value="warning">warning</dt-button-group-item>
        <dt-button-group-item value="error">error</dt-button-group-item>
        <dt-button-group-item value="recovered">recovered</dt-button-group-item>
      </dt-button-group>
    </div>
  `,
  styles: ['dt-progress-bar {margin: 8px 0}'],
})
export class ProgressBarWithColorExample {
  color = 'error';

  changed(val: string): void {
    this.color = val;
  }
}
