import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <div class="dark" dtTheme=":dark">
      <dt-switch>Default</dt-switch>
      <br>
      <dt-switch checked>Checked</dt-switch>
      <br>
      <dt-switch disabled>Disabled</dt-switch>
      <br>
      <dt-switch checked disabled>Checked Disabled</dt-switch>
    </div>
  `,
})
export class DarkThemeSwitchExampleComponent { }
