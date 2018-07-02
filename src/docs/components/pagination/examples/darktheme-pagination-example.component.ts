import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<section class="dark" dtTheme=":dark">
  <dt-pagination [maxPages]="11"></dt-pagination>
</section>`,
})
@OriginalClassName('DarkThemePaginationExampleComponent')
export class DarkThemePaginationExampleComponent { }
