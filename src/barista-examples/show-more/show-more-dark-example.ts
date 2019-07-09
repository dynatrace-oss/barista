import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <section class="dark" dtTheme=":dark">
      <dt-show-more [showLess]="showLess" (changed)="showLess = !showLess"
        >Toggle more/less</dt-show-more
      >
    </section>
  `,
})
export class ShowMoreDarkExample {
  showLess = false;
}
