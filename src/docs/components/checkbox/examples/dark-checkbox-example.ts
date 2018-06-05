import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <div dtTheme=":dark" class="dark">
    <dt-checkbox>Check me</dt-checkbox>
  </div>
  `,
})
export class DarkCheckboxExample { }
