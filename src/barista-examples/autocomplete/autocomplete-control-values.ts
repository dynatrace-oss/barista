import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { COUNTRIES, countryCompareWithFn, CountryOption } from './countries';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
  <input dtInput [dtAutocomplete]="auto" [formControl]="myControl" placeholder="Search a country" aria-label="Search a country">
  <dt-autocomplete #auto="dtAutocomplete" [displayWith]="displayFn">
    <dt-option *ngFor="let option of filteredOptions | async" [value]="option">{{option.name}}</dt-option>
  </dt-autocomplete>
  `,
})
export class ControlValuesAutocompleteExample implements OnInit {
  myControl = new FormControl();
  options: CountryOption[] = COUNTRIES;
  filteredOptions: Observable<CountryOption[]>;

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith<string | CountryOption>(''),
      map((value) => typeof value === 'string' ? value : value.name),
      map((name) => name ? this._filter(name) : this.options.slice())
    );
  }

  displayFn(country?: CountryOption): string | undefined {
    return country ? country.name : undefined;
  }

  private _filter(name: string): CountryOption[] {
    return this.options.filter((option) => countryCompareWithFn(option, name));
  }
}
