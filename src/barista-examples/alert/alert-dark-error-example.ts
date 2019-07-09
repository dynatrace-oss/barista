import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <section class="dark" dtTheme=":dark">
      <dt-alert severity="error">{{ text }}</dt-alert>
    </section>
  `,
})
export class AlertDarkErrorExample {
  text = `This is a error on dark background!`;
}
