import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <p>
      Selected Value:
      <i>{{ selectedValue || 'No value selected' }}</i>
    </p>
    <dt-select
      placeholder="Choose your coffee"
      [(value)]="selectedValue"
      aria-label="Choose your coffee"
    >
      <dt-option value="ThePerfectPour">ThePerfectPour</dt-option>
      <dt-option value="Affogato">Affogato</dt-option>
      <dt-option value="Americano">Americano</dt-option>
    </dt-select>
  `,
})
export class SelectValueExample {
  selectedValue: string;
}
