import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

const STATES = [
  {
    name: 'Oberösterreich',
    value: 'OOE',
    cities: ['Linz', 'Wels', 'Steyr', 'Leonding', 'Traun', 'Vöcklabruck'],
  },
  {
    name: 'Niederösterreich',
    value: 'NOE',
    cities: ['St. Pölten', 'Melk', 'Krems', 'St. Valentin', 'Amstetten'],
  },
  {
    name: 'Wien',
    value: 'W',
  },
  {
    name: 'Burgenland',
    value: 'B',
  },
  {
    name: 'Steiermark',
    value: 'SMK',
  },
  {
    name: 'Kärnten',
    value: 'KTN',
  },
  {
    name: 'Tirol',
    value: 'TRL',
  },
  {
    name: 'Vorarlberg',
    value: 'VRB',
  },
  {
    name: 'Salzburg',
    value: 'SBZ',
  },
];

@Component({
  moduleId: module.id,
  template: `
    <dt-filter-field (inputChange)="_handleInputChange($event)">
      <dt-autocomplete [displayWith]="optionsDisplayFn">
        <dt-option *ngFor="let category of categories" [value]="category">{{category.name}}</dt-option>
      </dt-autocomplete>
    </dt-filter-field>
  `,
})
@OriginalClassName('DefaultFilterFieldExample')
export class DefaultFilterFieldExample {
  categories: any[] | null = STATES;

  optionsDisplayFn = (value: any) => value.name;

  _handleInputChange(value: string): void {
    console.log(value);
  }

  constructor() {

  }
}
