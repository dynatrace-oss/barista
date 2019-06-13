import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-form-field>
      <dt-label>Your Coffee:</dt-label>
      <dt-select placeholder="Choose your coffee" required [(ngModel)]="selectedValue">
        <dt-option>No Coffee (Triggers an error)</dt-option>
        <dt-option value="ThePerfectPour">ThePerfectPour</dt-option>
        <dt-option value="Affogato">Affogato</dt-option>
        <dt-option value="Americano">Americano</dt-option>
      </dt-select>
      <dt-hint>Choose one of the coffees in the list</dt-hint>
      <dt-error>Please select a coffee</dt-error>
    </dt-form-field>
  `,
})
export class FormFieldSelectExampleComponent {
  selectedValue: string;
}
