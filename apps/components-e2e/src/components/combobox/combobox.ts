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

import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { timer } from 'rxjs';
import {
  DtCombobox,
  DtComboboxFilterChange,
} from '@dynatrace/barista-components/experimental/combobox';

interface ExampleComboboxOption {
  readonly name: string;
  readonly value: string;
}

const allOptions: ExampleComboboxOption[] = [
  { name: 'Value 1', value: '[value: Value 1]' },
  { name: 'Value 2', value: '[value: Value 2]' },
  { name: 'Value 3', value: '[value: Value 3]' },
];

/**
 * Factory function for generating a filter function for a given filter string.
 *
 * @param filter Text to filter options for
 */
function optionFilter(
  filter: string,
): (option: ExampleComboboxOption) => boolean {
  return (option: ExampleComboboxOption): boolean => {
    return option.value.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
  };
}

@Component({
  selector: 'dt-e2e-combobox',
  templateUrl: 'combobox.html',
})
export class DtE2ECombobox {
  @ViewChild(DtCombobox) combobox: DtCombobox<any>;

  _initialValue: ExampleComboboxOption | null = allOptions[0];
  _options = [...allOptions];
  _loading = false;
  _displayWith = (option: ExampleComboboxOption) => option.name;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  openedChanged(event: boolean): void {
    console.log(`openedChanged: '${event}'`);
  }

  valueChanged(event: ExampleComboboxOption): void {
    this._options = [...allOptions].filter(optionFilter(event.value));
  }

  filterChanged(event: DtComboboxFilterChange): void {
    if (!event.isResetEvent) {
      this._loading = true;
      this._changeDetectorRef.markForCheck();
    }

    timer(1000)
      .pipe(take(1))
      .subscribe(() => {
        this._options = allOptions.filter(optionFilter(event.filter));
        this._loading = false;
        this._changeDetectorRef.markForCheck();
      });
  }
}
