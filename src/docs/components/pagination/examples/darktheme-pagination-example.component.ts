import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<section class="dark" dtTheme=":dark">
  <dt-pagination [maxPages]="11"></dt-pagination>
</section>`,
})
export class DarkThemePaginationExampleComponent { }
