import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <div dtTheme=":dark" class="dark">
    <div><dt-checkbox checked>Check me</dt-checkbox></div>
    <div><dt-checkbox [indeterminate]="true">Indeterminate</dt-checkbox></div>
    <div><dt-checkbox disabled checked>Disabled</dt-checkbox></div>
  </div>
  `,
})
export class DarkCheckboxExample { }
