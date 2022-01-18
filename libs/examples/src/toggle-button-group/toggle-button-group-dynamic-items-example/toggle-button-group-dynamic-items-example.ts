/**
 * @license
 * Copyright 2022 Dynatrace LLC
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
  selector: 'dt-example-toggle-button-group-dynamic-items',
  templateUrl: 'toggle-button-group-dynamic-items-example.html',
  styleUrls: ['toggle-button-group-dynamic-items-example.scss'],
})
export class DtExampleToggleButtonGroupDynamicItems {
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
