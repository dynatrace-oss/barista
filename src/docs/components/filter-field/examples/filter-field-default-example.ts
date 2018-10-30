import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { DtActiveFilterChangeEvent, DtFilterFieldFilterNode, DtFilterFieldNodeValue } from '@dynatrace/angular-components';

type State = {name: string; value: string; cities?: string[]};

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
    <dt-filter-field (inputChange)="_handleInputChange($event)" (activeFilterChange)="_handleActiveFilterChange($event)">
      <dt-autocomplete *ngIf="filteredStates" [displayWith]="stateDisplayFn" autoActiveFirstOption>
        <dt-option *ngFor="let state of filteredStates" [value]="state">{{state.name}}</dt-option>
      </dt-autocomplete>
      <dt-autocomplete *ngIf="filteredCities" autoActiveFirstOption>
        <dt-option *ngFor="let city of filteredCities" [value]="city">{{city}}</dt-option>
      </dt-autocomplete>
    </dt-filter-field>
  `,
})
@OriginalClassName('DefaultFilterFieldExample')
export class DefaultFilterFieldExample {
  private _inputValue = '';

  private _states: State[] | null = STATES;
  private _cities : string[] | null = null;

  get filteredStates(): State[] | null {
    const value = this._inputValue.toUpperCase();
    return this._states && value.length ?
      this._states.filter((state) => state.name.toUpperCase().indexOf(value) !== -1) : this._states;
  }

  get filteredCities(): string[] | null {
    const value = this._inputValue.toUpperCase();
    return this._cities && value.length ? this._cities.filter((city) => city.toUpperCase().indexOf(value) !== -1) : this._cities;
  }

  stateDisplayFn = (value: State) => value.name;

  change(): void {
    console.log('LALALALALA');
  }

  _handleActiveFilterChange(event: DtActiveFilterChangeEvent): void {
    const activeNode = event.activeNode as DtFilterFieldFilterNode;
    const item = (activeNode.properties[0] as DtFilterFieldNodeValue<State>).value;
    if (item.cities) {
      this._cities = item.cities;
      this._states = null;
    }
    this._inputValue = '';
  }

  constructor() {

  }
}
