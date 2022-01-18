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

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { COUNTRIES, CountryOption, countryCompareWithFn } from '../countries';

@Component({
  selector: 'dt-example-autocomplete-control-values-example',
  templateUrl: 'autocomplete-control-values-example.html',
})
export class DtExampleAutocompleteControlValues implements OnInit {
  myControl = new FormControl();
  options: CountryOption[] = COUNTRIES;
  filteredOptions: Observable<CountryOption[]>;

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith<string | CountryOption>(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.options.slice())),
    );
  }

  displayFn(country?: CountryOption): string | undefined {
    return country ? country.name : undefined;
  }

  private _filter(name: string): CountryOption[] {
    return this.options.filter((option) => countryCompareWithFn(option, name));
  }
}
