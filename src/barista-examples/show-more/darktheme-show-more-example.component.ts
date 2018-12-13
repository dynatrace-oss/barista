import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<section class="dark" dtTheme=":dark">
  <dt-show-more [showLess]="showLess" (changed)="showLess=!showLess">Toggle more/less</dt-show-more>
</section>`,
})
export class DarkThemeShowMoreExampleComponent {
  showLess = false;
}
