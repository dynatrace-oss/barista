import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-select placeholder="Choose your coffee" [disabled]="disabled" aria-label="Choose your coffee">
      <dt-option value="ThePerfectPour">ThePerfectPour</dt-option>
      <dt-option disabled value="Affogato">Affogato</dt-option>
      <dt-option value="Americano">Americano</dt-option>
    </dt-select>
    <p><dt-checkbox checked (change)="disabled = !disabled">Disabled</dt-checkbox></p>
  `,
})
export class DisabledSelectExampleComponent {
  disabled = true;
}
