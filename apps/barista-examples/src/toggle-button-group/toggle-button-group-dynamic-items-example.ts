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
    <dt-toggle-button-group #group1>
      <button dt-toggle-button-item *ngFor="let item of items" [value]="item">
        <dt-toggle-button-item-icon>
          <dt-icon name="agent"></dt-icon>
        </dt-toggle-button-item-icon>
        {{ item }}
      </button>
    </dt-toggle-button-group>
    <div style="margin-top: 16px;">
      <button dt-button (click)="addItem()">Add item</button>
      <button dt-button (click)="removeItem()">Remove item</button>
    </div>
    <div style="margin-top: 16px;">Current value: "{{ group1.value }}"</div>
  `,
  styles: [
    '.dt-toggle-button-item { margin-right: 16px; }',
    '.dt-toggle-button-item:last-of-type { margin-right: 0; }',
  ],
})
export class ToggleButtonGroupDynamicItemsExample {
  items: number[] = [1, 2, 3];

  addItem(): void {
    let newNumber = this.items[this.items.length - 1] + 1;
    if (isNaN(newNumber)) {
      newNumber = 0;
    }
    this.items.push(newNumber);
  }

  removeItem(): void {
    this.items.pop();
  }
}
