import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <p>Selected Value: <i>{{selectedValue || 'No value selected'}}</i></p>
    <dt-select placeholder="Choose your coffee" [(ngModel)]="selectedValue" aria-label="Choose your coffee">
      <dt-option *ngFor="let coffee of coffees" [value]="coffee.value">
        {{coffee.viewValue}}
      </dt-option>
    </dt-select>
  `,
})
export class FormsSelectExampleComponent {
  selectedValue: string;
  coffees = [
    { value: 'ThePerfectPour', viewValue: 'ThePerfectPour' },
    { value: 'Affogato', viewValue: 'Affogato' },
    { value: 'Americano', viewValue: 'Americano' },
  ];
}
