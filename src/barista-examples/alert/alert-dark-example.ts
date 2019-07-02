import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `<section class="dark" dtTheme=":dark">
  <dt-alert severity="warning">{{text}}</dt-alert>
</section>`,
})
export class AlertDarkExample {
  text = `This is a warning on dark background!`;
}
