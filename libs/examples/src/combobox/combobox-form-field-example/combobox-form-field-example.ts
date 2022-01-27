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
import { FormControl, ValidatorFn } from '@angular/forms';
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
  { name: 'Espresso', value: 'espresso' },
  { name: 'Cappuccino', value: 'cappuccino' },
  { name: 'Americano', value: 'americano' },
  { name: 'No Coffee (Triggers an error)', value: 'noCoffee' },
];

function coffeeValidator(): ValidatorFn {
  return (control: FormControl): { [key: string]: boolean } | null => {
    const isCoffee = control.value ? control.value.value !== 'noCoffee' : true;
    return isCoffee ? null : { noCoffee: true };
  };
}

@Component({
  selector: 'dt-example-form-field-combobox',
  templateUrl: './combobox-form-field-example.html',
})
export class DtExampleComboboxFormField {
  @ViewChild(DtCombobox) combobox: DtCombobox<any>;

  coffeeControl: FormControl;

  _options = [...allOptions];
  _loading = false;

  _displayCoffee = (value: ExampleComboboxOption) =>
    value.value === 'noCoffee' ? '' : value.name;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    this.coffeeControl = new FormControl(null, coffeeValidator());
  }

  openedChanged(event: boolean): void {
    console.log(`openedChanged: '${event}'`);
  }

  valueChanged(event: ExampleComboboxOption): void {
    this._options = [...allOptions].filter(
      (option) => option.value === event.value,
    );
  }

  filterChanged(event: DtComboboxFilterChange): void {
    if (!event.isResetEvent) {
      this._loading = true;
      this._changeDetectorRef.markForCheck();
    }

    timer(1500)
      .pipe(take(1))
      .subscribe(() => {
        this._options = allOptions.filter((option) =>
          option.name.toLowerCase().includes(event.filter.toLowerCase()),
        );
        this._loading = false;
        this._changeDetectorRef.markForCheck();
      });
  }
}
