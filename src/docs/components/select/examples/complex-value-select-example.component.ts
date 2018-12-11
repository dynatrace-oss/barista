import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <p>Selected Value label: <i>{{selectedValue?.viewValue || 'No value selected'}}</i></p>
    <dt-select placeholder="Choose your coffee" [(ngModel)]="selectedValue">
      <dt-option *ngFor="let coffee of coffees" [value]="coffee">
        {{coffee.viewValue}}
      </dt-option>
    </dt-select>
  `,
})
@OriginalClassName('ComplexValueSelectExampleComponent')
export class ComplexValueSelectExampleComponent {
  selectedValue: { value: string;  viewValue: string };
  coffees = [
    { value: 'ThePerfectPour', viewValue: 'ThePerfectPour' },
    { value: 'Affogato', viewValue: 'Affogato' },
    { value: 'Americano', viewValue: 'Americano' },
  ];
}
