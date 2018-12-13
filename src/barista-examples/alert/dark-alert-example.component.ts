import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<section class="dark" dtTheme=":dark">
  <dt-alert severity="warning">{{text}}</dt-alert>
</section>`,
})
@OriginalClassName('DarkAlertExampleComponent')
export class DarkAlertExampleComponent {
  text = `This is a warning on dark background!`;
}
