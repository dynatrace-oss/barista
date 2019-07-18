import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <section class="dark" dtTheme=":dark">
      <button dt-show-more [showLess]="showLess" (click)="showLess = !showLess">
        Toggle more/less
      </button>
    </section>
  `,
})
export class ShowMoreDarkExample {
  showLess = false;
}
