/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { Component, ViewChild } from '@angular/core';

import {
  DtToggleButtonGroup,
  DtToggleButtonItem,
} from '@dynatrace/barista-components/toggle-button-group';

@Component({
  selector: 'dt-example-toggle-button-group-in-use',
  templateUrl: 'toggle-button-group-in-use-example.html',
  styleUrls: ['toggle-button-group-in-use-example.scss'],
})
export class DtExampleToggleButtonGroupInUse<T> {
  @ViewChild(DtToggleButtonGroup, { static: true })
  dtToggleButtonGroup: DtToggleButtonGroup<T>;

  selectedItem: DtToggleButtonItem<T> | null;

  getSelectedItem(): void {
    this.selectedItem = this.dtToggleButtonGroup.selectedItem;
  }
}
