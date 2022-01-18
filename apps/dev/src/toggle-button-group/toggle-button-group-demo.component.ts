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

import { DtToggleButtonChange } from '@dynatrace/barista-components/toggle-button-group';

@Component({
  selector: 'demo-component',
  templateUrl: './toggle-button-group-demo.component.html',
  styleUrls: ['./toggle-button-group-demo.component.scss'],
})
export class ToggleButtonGroupDemo {
  items: number[] = [1, 2, 3];
  loadMoreItems: string[] = [
    'lr-co-cf40001v.dynatrace.vmta',
    'lr-co-cf40002v.dynatrace.vmta',
    'lr-co-cf40003v.dynatrace.vmta',
    'lr-co-cf40004v.dynatrace.vmta',
    'lr-co-cf40005v.dynatrace.vmta',
    'lr-co-cf40006v.dynatrace.vmta',
    'lr-co-cf40007v.dynatrace.vmta',
    'lr-co-cf40008v.dynatrace.vmta',
  ];
  hasMoreItems = true;

  handleSelectionChange(change: DtToggleButtonChange<string>): void {
    console.log(change);
  }

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

  handleLoadMoreItems(): void {
    this.loadMoreItems.push(
      'lr-co-cf40009v.dynatrace.vmta',
      'lr-co-cf400010v.dynatrace.vmta',
      'lr-co-cf400011v.dynatrace.vmta',
      'lr-co-cf400012v.dynatrace.vmta',
      'lr-co-cf400013v.dynatrace.vmta',
    );
    this.hasMoreItems = false;
  }
}
