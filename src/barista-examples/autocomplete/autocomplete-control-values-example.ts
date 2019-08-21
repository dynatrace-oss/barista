import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { COUNTRIES, CountryOption, countryCompareWithFn } from './countries';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <input
      dtInput
      [dtAutocomplete]="auto"
      [formControl]="myControl"
      placeholder="Search a country"
      aria-label="Search a country"
    />
    <dt-autocomplete #auto="dtAutocomplete" [displayWith]="displayFn">
      <dt-option
        *ngFor="let option of filteredOptions | async"
        [value]="option"
      >
        {{ option.name }}
      </dt-option>
    </dt-autocomplete>
  `,
})
export class AutocompleteControlValuesExample implements OnInit {
  myControl = new FormControl();
  options: CountryOption[] = COUNTRIES;
  filteredOptions: Observable<CountryOption[]>;

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith<string | CountryOption>(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.options.slice())),
    );
  }

  displayFn(country?: CountryOption): string | undefined {
    return country ? country.name : undefined;
  }

  private _filter(name: string): CountryOption[] {
    return this.options.filter(option => countryCompareWithFn(option, name));
  }
}
