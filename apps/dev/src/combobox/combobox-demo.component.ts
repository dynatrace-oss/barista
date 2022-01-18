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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { timer } from 'rxjs';
import {
  DtCombobox,
  DtComboboxFilterChange,
} from '@dynatrace/barista-components/experimental/combobox';
import { DT_OPTION_CONFIG } from '@dynatrace/barista-components/autocomplete';

interface ComboboxDemoOption {
  readonly name: string;
  readonly value: string;
}

const customOptionHeight = 40;
const allOptions: ComboboxDemoOption[] = [
  { name: 'Value 1', value: '[value: Value 1]' },
  { name: 'Value 2', value: '[value: Value 2]' },
  { name: 'Value 3', value: '[value: Value 3]' },
  { name: 'Value 4', value: '[value: Value 4]' },
  { name: 'Value 5', value: '[value: Value 5]' },
  { name: 'Value 6', value: '[value: Value 6]' },
  { name: 'Value 7', value: '[value: Value 7]' },
  { name: 'Value 8', value: '[value: Value 8]' },
  { name: 'Value 9', value: '[value: Value 9]' },
  { name: 'Value 10', value: '[value: Value 10]' },
];

/**
 * Factory function for generating a filter function for a given filter string.
 *
 * @param filter Text to filter options for
 */
function optionFilter(filter: string): (option: ComboboxDemoOption) => boolean {
  return (option: ComboboxDemoOption): boolean => {
    return option.value.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
  };
}

@Component({
  selector: 'combobox-dev-app-demo',
  templateUrl: 'combobox-demo.component.html',
  styleUrls: ['combobox-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DT_OPTION_CONFIG, useValue: { height: customOptionHeight } },
  ],
})
export class ComboboxDemo {
  @ViewChild(DtCombobox) combobox: DtCombobox<any>;

  _initialValue = allOptions[0];
  _options = [...allOptions];
  _loading = false;
  _displayWith = (option: ComboboxDemoOption) => option.name;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  openedChanged(event: boolean): void {
    console.log(`openedChanged: '${event}'`);
  }

  valueChanged(event: ComboboxDemoOption): void {
    console.log('valueChanged', event);
    this._options = [...allOptions].filter(optionFilter(event.value));
  }

  filterChanged(event: DtComboboxFilterChange): void {
    if (!event.isResetEvent) {
      this._loading = true;
      this._changeDetectorRef.markForCheck();
    }

    timer(1500)
      .pipe(take(1))
      .subscribe(() => {
        this._options = allOptions.filter(optionFilter(event.filter));
        this._loading = false;
        this._changeDetectorRef.markForCheck();
      });
  }
}
