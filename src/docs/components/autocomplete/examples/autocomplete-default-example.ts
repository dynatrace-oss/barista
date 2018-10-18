import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { COUNTRIES, countryCompareWithFn } from './countries';

@Component({
  moduleId: module.id,
  template: `
  <input dtInput placeholder="Country" [dtAutocomplete]="auto" [(ngModel)]="value" >
  <dt-autocomplete #auto="dtAutocomplete">
    <dt-option *ngFor="let country of countries" [value]="country.name">{{country.name}}</dt-option>
  </dt-autocomplete>
  `,
})
@OriginalClassName('DefaultAutocompleteExample')
export class DefaultAutocompleteExample {

  value: string;

  get countries(): any[] {
    return COUNTRIES.filter((country) => this.value ? countryCompareWithFn(country, this.value) : true);
  }
}
