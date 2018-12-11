import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <dt-select placeholder="Choose your coffee" [disabled]="disabled">
      <dt-option value="ThePerfectPour">ThePerfectPour</dt-option>
      <dt-option disabled value="Affogato">Affogato</dt-option>
      <dt-option value="Americano">Americano</dt-option>
    </dt-select>
    <p><dt-checkbox checked (change)="disabled = !disabled">Disabled</dt-checkbox></p>
  `,
})
@OriginalClassName('DisabledSelectExampleComponent')
export class DisabledSelectExampleComponent {
  disabled = true;
}
