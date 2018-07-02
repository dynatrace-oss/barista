import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<div class="demo-card">
<dt-card>
  <dt-card-title>Top 3 JavaScript errors</dt-card-title>
  This is some generic content
</dt-card></div>`,
})
@OriginalClassName('TitleCardExampleComponent')
export class TitleCardExampleComponent { }
